import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { scoreTransaction } from '@/lib/risk-engine/scorer'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function extractText(file: File): Promise<string> {
  if (file.name.endsWith('.csv') || file.type === 'text/csv') {
    return await file.text()
  }
  try {
    const pdfParse = (await import('pdf-parse')).default
    const buffer = Buffer.from(await file.arrayBuffer())
    const data = await pdfParse(buffer)
    return data.text
  } catch {
    return `File: ${file.name} (extraction failed)`
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: merchant } = await supabase.from('merchants').select('id').eq('user_id', user.id).single()
  if (!merchant) return NextResponse.json({ error: 'Merchant not found' }, { status: 404 })

  const formData = await request.formData()
  const files = formData.getAll('files').filter((v): v is File => v instanceof File)

  const allText: string[] = []
  for (const file of files.slice(0, 6)) {
    try {
      const path = `${merchant.id}/${Date.now()}-${file.name}`
      const buf = await file.arrayBuffer()
      await supabase.storage.from('statements').upload(path, Buffer.from(buf), { contentType: file.type, upsert: false })
      await supabase.from('statement_uploads').insert({
        merchant_id: merchant.id,
        user_id: user.id,
        file_name: file.name,
        file_url: path,
        file_type: file.name.endsWith('.csv') ? 'csv' : 'pdf',
        status: 'pending'
      })
    } catch (e) { console.error('Upload error', e) }
    const text = await extractText(file)
    allText.push(`--- ${file.name} ---\n${text}`)
  }

  const combinedText = allText.join('\n\n').slice(0, 12000)

  let aiAnalysis: Record<string, unknown> = {}
  try {
    const resp = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a payment risk analyst. Analyze this merchant processing statement data and return ONLY a valid JSON object with no markdown, no explanation, just pure JSON.\n\nStatement data:\n${combinedText}\n\nReturn this exact JSON structure:\n{"total_volume":number,"chargeback_rate":number,"dispute_count":number,"total_transactions":number,"avg_ticket_size":number,"highest_ticket":number,"monthly_breakdown":[{"month":"string","volume":number,"disputes":number,"chargeback_rate":number}],"top_risk_factors":["string array max 5 specific to their data"],"high_risk_transactions":[{"amount":number,"reason":"string","date":"string"}],"country_breakdown":{"US":number},"recommended_actions":["string array max 5 specific actionable steps"],"mid_risk_level":"low|moderate|high|critical","days_until_threshold":null,"summary":"2-3 sentence plain English analysis","biggest_threat":"single most important fix right now"}`
      }]
    })
    const text = resp.content[0].type === 'text' ? resp.content[0].text : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (match) aiAnalysis = JSON.parse(match[0])
  } catch (e) {
    console.error('AI analysis error', e)
    aiAnalysis = {
      summary: 'Statements uploaded. Analysis in progress.',
      biggest_threat: 'Review your statements manually',
      chargeback_rate: 0,
      total_transactions: 0
    }
  }

  // Score any extracted transactions
  const highRiskTxs = (aiAnalysis.high_risk_transactions as Array<{amount: number; reason: string; date: string}>) || []
  for (const tx of highRiskTxs.slice(0, 20)) {
    const { score, signals } = scoreTransaction({ amount: tx.amount })
    await supabase.from('transactions').insert({
      merchant_id: merchant.id,
      tx_id: `STMT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount: tx.amount,
      currency: 'USD',
      status: 'flagged',
      risk_score: score,
      risk_signals: signals,
      disputed: false,
      created_at: tx.date || new Date().toISOString()
    })
  }

  const chargebackRate = (aiAnalysis.chargeback_rate as number) || 0
  const totalTx = (aiAnalysis.total_transactions as number) || 0
  const highRiskCount = highRiskTxs.length

  await supabase.from('merchants').update({
    chargeback_rate: chargebackRate,
    total_volume: (aiAnalysis.total_volume as number) || 0,
    avg_ticket: (aiAnalysis.avg_ticket_size as number) || 0,
    ai_analysis: aiAnalysis,
    biggest_threat: (aiAnalysis.biggest_threat as string) || null,
    top_risk_factors: (aiAnalysis.top_risk_factors as string[]) || [],
    recommended_actions: (aiAnalysis.recommended_actions as string[]) || [],
    mid_risk_level: (aiAnalysis.mid_risk_level as string) || 'unknown',
    status: 'active',
  }).eq('user_id', user.id)

  await supabase.from('statement_uploads').update({ status: 'analyzed' }).eq('merchant_id', merchant.id)

  const alerts: Array<{ merchant_id: string; user_id: string; type: string; message: string; read: boolean }> = []
  if (chargebackRate * 100 > 1.8) {
    alerts.push({
      merchant_id: merchant.id,
      user_id: user.id,
      type: 'critical',
      message: `Your chargeback rate is ${(chargebackRate * 100).toFixed(2)}% — above Visa's 1.8% termination threshold. Immediate action required.`,
      read: false
    })
  } else if (chargebackRate * 100 > 1.0) {
    alerts.push({
      merchant_id: merchant.id,
      user_id: user.id,
      type: 'warning',
      message: `Your chargeback rate is ${(chargebackRate * 100).toFixed(2)}% — approaching the 1.0% early warning threshold.`,
      read: false
    })
  }
  if (highRiskCount > 0) {
    alerts.push({
      merchant_id: merchant.id,
      user_id: user.id,
      type: 'warning',
      message: `${highRiskCount} high-risk transaction${highRiskCount > 1 ? 's' : ''} identified in your statements.`,
      read: false
    })
  }
  if (alerts.length > 0) await supabase.from('alerts').insert(alerts)

  return NextResponse.json({ analysis: aiAnalysis, files_processed: files.length, transactions_found: totalTx })
}
