import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { message, conversation_history = [] } = await request.json() as {
      message: string
      conversation_history: Array<{ role: string; content: string }>
    }
    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

    // Fetch merchant data
    const { data: merchant } = await supabase
      .from('merchants')
      .select('chargeback_rate, mid_risk_level, biggest_threat, top_risk_factors, recommended_actions, ai_analysis, total_volume')
      .eq('user_id', user.id)
      .single()

    // Fetch last 5 transactions for context
    const { data: recentTxns } = await supabase
      .from('transactions')
      .select('amount, country, risk_score, disputed, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    const systemPrompt = `You are the HighRiskIntel AI Analyst — a specialist in payment risk, chargebacks, and MID (Merchant ID) protection for high-risk merchants. You have deep expertise in:

DOMAIN KNOWLEDGE:
- Visa and Mastercard chargeback thresholds: Visa Early Warning = 0.65%, Standard = 0.9%, Excessive = 1.8%. Mastercard = 1.0% (100 disputes/mo). Exceeding these leads to monitoring programs (VAMP, MATCH list) and MID termination.
- High-risk verticals: supplements/nutraceuticals, peptides, adult content, crypto, travel, firearms, gaming, CBD, SaaS with trials
- Dispute reason codes: 10.4 (fraud/no authorization), 13.1 (merchandise not received), 13.3 (not as described), 4853 (Mastercard cardholder dispute), 4837 (no cardholder authorization)
- Fraud patterns: card testing, friendly fraud, triangulation fraud, identity theft, account takeover
- Risk signals: high-risk countries (NG, RU, UA, BY, IR, KP, VE), disposable emails, off-hours orders, velocity attacks, BIN attacks, large single orders
- Prevention tactics: 3DS2 authentication, AVS/CVV checks, velocity rules, email verification, IP geolocation blocking, refund-before-dispute strategy
- EDR (Early Dispute Resolution) networks: Ethoca, Verifi CDRN — alert merchants within 24-72hrs of dispute filing before it becomes a chargeback
- MATCH list: the industry blacklist that permanently blocks merchants from getting new accounts
- Chargeback fees: typically $15-$100 per dispute plus lost merchandise plus potential fines

RESPONSE RULES:
- Always reference the merchant's ACTUAL numbers below, never generic examples
- Be direct and specific — tell them exactly what to do and why
- Prioritize urgency correctly: anything above 1.0% is serious, above 1.5% is critical
- Keep responses to 3-4 sentences max
- If they have no data yet, explain what connecting their processor will show them
- Never say "I recommend consulting a professional" — you ARE the professional

THIS MERCHANT'S DATA:
Chargeback rate: ${merchant?.chargeback_rate != null ? `${merchant.chargeback_rate}%` : 'Not connected yet'}
MID risk level: ${merchant?.mid_risk_level ?? 'Unknown'}
Total volume: ${merchant?.total_volume != null ? `$${Number(merchant.total_volume).toLocaleString()}` : 'Unknown'}
Biggest threat: ${merchant?.biggest_threat ?? 'Not analyzed yet'}
Top risk factors: ${(merchant?.top_risk_factors as string[] | null)?.join(', ') ?? 'None identified'}
Recommended actions: ${(merchant?.recommended_actions as string[] | null)?.join('; ') ?? 'Connect processor to get recommendations'}
AI analysis: ${JSON.stringify(merchant?.ai_analysis ?? {})}
Recent transactions (last 5): ${JSON.stringify(recentTxns ?? [])}`

    const history = (conversation_history as Array<{ role: string; content: string }>)
      .slice(-10)
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    let assistantReply = ''
    try {
      const response = await openai.chat.completions.create({
        model: 'llama3',
        max_tokens: 400,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: message },
        ],
      })
      assistantReply = response.choices[0]?.message?.content ?? ''
    } catch (aiErr) {
      // Ollama not running — return a helpful static response
      const cbRate = merchant?.chargeback_rate ?? 0
      const cbPct = (cbRate * 100).toFixed(2)
      assistantReply = cbRate >= 0.018
        ? `Your chargeback rate is ${cbPct}% — this is above Visa's 1.8% termination threshold. Immediately refund your highest-risk transactions and contact your processor. (AI analyst offline — start Ollama locally to enable full responses.)`
        : cbRate >= 0.01
        ? `Your chargeback rate is ${cbPct}% — approaching the 1.0% warning threshold. Review your high-risk transactions and consider implementing 3DS2 authentication. (AI analyst offline — start Ollama locally to enable full responses.)`
        : `I can see your account data but the AI analyst is currently offline. Start Ollama locally with "ollama run llama3" to enable full AI responses.`
    }

    // Save to chat_history table
    try {
      await supabase.from('chat_history').insert([
        { user_id: user.id, role: 'user', message, created_at: new Date().toISOString() },
        { user_id: user.id, role: 'assistant', message: assistantReply, created_at: new Date().toISOString() },
      ])
    } catch { /* fail silently */ }

    return NextResponse.json({ response: assistantReply })
  } catch (err) {
    console.error('AI chat error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
