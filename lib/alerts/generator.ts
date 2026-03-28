import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import { sendCriticalAlertEmail } from "@/lib/email/sender"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ollama = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
})

async function getAIExplanation(alertType: string, message: string): Promise<string> {
  try {
    const resp = await ollama.chat.completions.create({
      model: 'llama3',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `You are a payment risk expert. In one short paragraph (2-3 sentences), explain this risk alert to a merchant and tell them the most important action to take immediately: "${message}"`
      }]
    })
    return resp.choices[0]?.message?.content ?? ''
  } catch {
    return ''
  }
}

export async function generateAlerts(userId: string, chargebackRate: number, transactions: Array<{ risk_score?: number; country?: string }>) {
  const alerts: Array<{ user_id: string; type: string; message: string; ai_explanation?: string; read: boolean }> = []

  if (chargebackRate >= 1.8) {
    const message = `Your chargeback rate is ${chargebackRate.toFixed(2)}% — above Visa's 1.8% termination threshold. Immediate action required.`
    const ai_explanation = await getAIExplanation('critical', message)
    alerts.push({ user_id: userId, type: 'critical', message, ai_explanation, read: false })
  } else if (chargebackRate >= 1.0) {
    const message = `Your chargeback rate is ${chargebackRate.toFixed(2)}% — approaching the 1.0% early warning threshold.`
    const ai_explanation = await getAIExplanation('warning', message)
    alerts.push({ user_id: userId, type: 'warning', message, ai_explanation, read: false })
  } else if (chargebackRate >= 0.65) {
    const message = `Your chargeback rate is ${chargebackRate.toFixed(2)}% — above Visa's 0.65% early warning threshold.`
    const ai_explanation = await getAIExplanation('warning', message)
    alerts.push({ user_id: userId, type: 'warning', message, ai_explanation, read: false })
  }

  const highRiskTxns = transactions.filter(t => (t.risk_score ?? 0) >= 80)
  if (highRiskTxns.length >= 3) {
    const message = `${highRiskTxns.length} high-risk transactions detected (risk score ≥80). Recommended: review and refund immediately.`
    const ai_explanation = await getAIExplanation('critical', message)
    alerts.push({ user_id: userId, type: 'critical', message, ai_explanation, read: false })
  }

  const ngRu = transactions.filter(t => ["NG", "RU", "UA", "KP", "IR"].includes(t.country ?? ""))
  if (ngRu.length >= 2) {
    const message = `${ngRu.length} transactions from high-risk countries detected. These countries have elevated fraud rates.`
    const ai_explanation = await getAIExplanation('warning', message)
    alerts.push({ user_id: userId, type: 'warning', message, ai_explanation, read: false })
  }

  if (alerts.length > 0) {
    await supabase.from('alerts').insert(alerts)

    // Send email for critical alerts if user has email
    if (process.env.RESEND_API_KEY) {
      const criticalAlert = alerts.find(a => a.type === 'critical')
      if (criticalAlert) {
        const { data: { user } } = await createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        ).auth.admin.getUserById(userId)
        if (user?.email) {
          const name = user.user_metadata?.full_name || 'Merchant'
          const { data: merchant } = await supabase
            .from('merchants')
            .select('biggest_threat, recommended_actions')
            .eq('user_id', userId)
            .single()
          await sendCriticalAlertEmail(
            user.email,
            name,
            chargebackRate,
            merchant?.biggest_threat || 'High chargeback rate',
            (merchant?.recommended_actions as string[])?.[0] || 'Review your high-risk transactions immediately'
          ).catch(() => {}) // fail silently
        }
      }
    }
  }
}
