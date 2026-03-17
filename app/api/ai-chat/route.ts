import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

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

    const systemPrompt = `You are the HighRiskIntel AI Analyst. You are speaking to a specific merchant about their payment risk data. Be direct, specific, and actionable. Always reference their actual numbers. Never give generic advice. Keep responses to 2-3 sentences maximum.

MERCHANT DATA:
Chargeback rate: ${merchant?.chargeback_rate ?? 'unknown'}%
MID risk level: ${merchant?.mid_risk_level ?? 'unknown'}
Biggest threat: ${merchant?.biggest_threat ?? 'unknown'}
Top risk factors: ${(merchant?.top_risk_factors as string[] | null)?.join(', ') ?? 'none'}
Full analysis: ${JSON.stringify(merchant?.ai_analysis ?? {})}
Recent transactions: ${JSON.stringify(recentTxns ?? [])}`

    const history = (conversation_history as Array<{ role: string; content: string }>)
      .slice(-10)
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: systemPrompt,
      messages: [...history, { role: 'user', content: message }],
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
