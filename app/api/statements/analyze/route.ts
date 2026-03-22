import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { generateAlerts } from '@/lib/alerts/generator'

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
})

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
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const files = formData.getAll('files').filter((v): v is File => v instanceof File)

    const allText: string[] = []
    const uploadedFiles: Array<{ name: string; url: string; type: string }> = []

    for (const file of files.slice(0, 6)) {
      // Upload to Supabase storage
      try {
        const path = `${user.id}/${Date.now()}-${file.name}`
        const buf = await file.arrayBuffer()
        await supabase.storage.from('statements').upload(path, Buffer.from(buf), {
          contentType: file.type,
          upsert: false,
        })
        uploadedFiles.push({
          name: file.name,
          url: path,
          type: file.name.endsWith('.csv') ? 'csv' : 'pdf',
        })
        // Insert into statement_uploads table
        await supabase.from('statement_uploads').insert({
          user_id: user.id,
          file_name: file.name,
          file_url: path,
          file_type: file.name.endsWith('.csv') ? 'csv' : 'pdf',
        })
      } catch (e) {
        console.error('Upload error', e)
      }

      const text = await extractText(file)
      allText.push(`--- ${file.name} ---\n${text}`)
    }

    const combinedText = allText.join('\n\n').slice(0, 12000)

    const prompt = `You are a payment risk analyst. Analyze this merchant processing statement.
Return ONLY valid JSON with no markdown wrapper:

{
  "total_volume": number,
  "chargeback_rate": number (as percentage like 1.84),
  "dispute_count": number,
  "total_transactions": number,
  "avg_ticket_size": number,
  "monthly_breakdown": [{"month": "string", "volume": number, "chargeback_rate": number}],
  "top_risk_factors": ["up to 5 specific factors"],
  "high_risk_transactions": [{"amount": number, "reason": "string", "date": "string"}],
  "recommended_actions": ["up to 5 specific actionable steps"],
  "mid_risk_level": "low|moderate|high|critical",
  "days_until_threshold": null,
  "summary": "2-3 sentences about their specific situation",
  "biggest_threat": "the single most urgent thing they need to fix"
}

Statement data:
${combinedText}`

    let parsedAnalysis: Record<string, unknown> = {}
    try {
      const resp = await openai.chat.completions.create({
        model: 'llama3',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      })
      const text = resp.choices[0]?.message?.content ?? ''
      const firstBrace = text.indexOf('{')
      const lastBrace = text.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        parsedAnalysis = JSON.parse(text.slice(firstBrace, lastBrace + 1))
      }
    } catch (e) {
      console.error('AI analysis error', e)
      parsedAnalysis = {
        summary: 'Statements uploaded. Analysis in progress.',
        biggest_threat: 'Review your statements manually',
        chargeback_rate: 0,
        total_transactions: 0,
        mid_risk_level: 'unknown',
      }
    }

    // AI returns chargeback_rate as percentage (e.g. 1.84), store as fraction (0.0184)
    const chargebackRatePercent = (parsedAnalysis.chargeback_rate as number) ?? 0
    const chargebackRate = chargebackRatePercent / 100
    const midRiskLevel = (parsedAnalysis.mid_risk_level as string) ?? 'unknown'
    const biggestThreat = (parsedAnalysis.biggest_threat as string) ?? null
    const topRiskFactors = (parsedAnalysis.top_risk_factors as string[]) ?? []
    const recommendedActions = (parsedAnalysis.recommended_actions as string[]) ?? []
    const totalVolume = (parsedAnalysis.total_volume as number) ?? 0

    // Update merchants table
    await supabase.from('merchants').update({
      ai_analysis: parsedAnalysis,
      chargeback_rate: chargebackRate,  // stored as fraction 0.0184
      mid_risk_level: midRiskLevel,
      biggest_threat: biggestThreat,
      top_risk_factors: topRiskFactors,
      recommended_actions: recommendedActions,
      total_volume: totalVolume,
      onboard_method: 'upload',
      status: 'active',
    }).eq('user_id', user.id)

    // Generate alerts
    const highRiskTxns = (parsedAnalysis.high_risk_transactions as Array<{ amount: number; reason: string; date: string }>) ?? []
    await generateAlerts(user.id, chargebackRatePercent, highRiskTxns.map((tx, i) => ({
      risk_score: i < 3 ? 85 : 70,
      country: 'US',
    })))

    return NextResponse.json({ success: true, analysis: parsedAnalysis })
  } catch (err) {
    console.error('Statements analyze error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
