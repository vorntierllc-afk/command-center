import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, conversation_history = [] } = await request.json() as {
    message: string
    conversation_history: Array<{ role: string; content: string }>
  }
  if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  const { data: merchant } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
  const { data: recentTxs } = await supabase
    .from('transactions')
    .select('amount, country, risk_score, disputed, created_at')
    .eq('merchant_id', merchant?.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const systemPrompt = `You are the HighRiskIntel AI Analyst. You are speaking directly to a merchant about their specific payment risk data. Be direct, specific, and actionable. Never give generic advice. Always reference their actual numbers.

${merchant?.ai_analysis ? `Their risk profile: ${JSON.stringify(merchant.ai_analysis)}` : 'No analysis yet — encourage them to connect their processor or upload statements.'}
${merchant?.chargeback_rate != null ? `Their chargeback rate: ${(merchant.chargeback_rate * 100).toFixed(2)}%` : ''}
${merchant?.mid_risk_level ? `Their MID risk level: ${merchant.mid_risk_level}` : ''}
${merchant?.biggest_threat ? `Their biggest threat: ${merchant.biggest_threat}` : ''}
${recentTxs && recentTxs.length > 0 ? `Their recent transactions (last 10): ${JSON.stringify(recentTxs)}` : ''}

Answer in 2-3 sentences maximum. Be specific to their data. Reference their actual numbers when relevant.`

  const history = conversation_history.slice(-10).map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content
  }))

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    system: systemPrompt,
    messages: [...history, { role: 'user', content: message }]
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    await supabase.from('chat_history').insert([
      { user_id: user.id, role: 'user', message },
      { user_id: user.id, role: 'assistant', message: reply }
    ])
  } catch { /* fail silently */ }

  return NextResponse.json({ reply })
}
