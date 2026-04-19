import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimit } from '@/lib/server/rate-limit'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

    // Rate limit: 20 AI requests per user per hour
    const { allowed, remaining } = checkRateLimit(`ai-chat:${user.id}`, 20, 60 * 60 * 1000)
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit reached. Try again in an hour.' }, { status: 429 })
    }

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

    const systemPrompt = `You are HighRiskIntel AI — payment risk specialist for high-risk merchants. Be direct, use the merchant's actual numbers, max 3 sentences per reply.
Thresholds: Visa warning=0.65%, standard=0.9%, termination=1.8%. Mastercard=1.0%.
Merchant: CB rate=${merchant?.chargeback_rate ?? 'N/A'}%, risk=${merchant?.mid_risk_level ?? 'unknown'}, volume=$${merchant?.total_volume ?? 0}, threat=${merchant?.biggest_threat ?? 'none'}, actions=${(merchant?.recommended_actions as string[] | null)?.slice(0, 2).join('; ') ?? 'connect processor'}.`

    // Keep only last 4 messages to minimize tokens
    const history = (conversation_history as Array<{ role: string; content: string }>)
      .slice(-4)
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: String(m.content).slice(0, 500), // cap each message
      }))

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system: systemPrompt,
      messages: [
        ...history,
        { role: 'user', content: message },
      ],
    })

    const assistantReply = response.content[0].type === 'text' ? response.content[0].text : ''

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
