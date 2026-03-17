import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function generateAlerts(userId: string, chargebackRate: number, transactions: Array<{ risk_score?: number; country?: string }>) {
  const alerts: Array<{ user_id: string; type: string; message: string; read: boolean }> = []

  if (chargebackRate >= 1.8) {
    alerts.push({
      user_id: userId,
      type: 'critical',
      message: `Your chargeback rate is ${chargebackRate.toFixed(2)}% — above Visa's 1.8% termination threshold. Immediate action required.`,
      read: false
    })
  } else if (chargebackRate >= 1.0) {
    alerts.push({
      user_id: userId,
      type: 'warning',
      message: `Your chargeback rate is ${chargebackRate.toFixed(2)}% — approaching the 1.0% early warning threshold.`,
      read: false
    })
  }

  const highRiskTxns = transactions.filter(t => (t.risk_score ?? 0) >= 80)
  if (highRiskTxns.length >= 3) {
    alerts.push({
      user_id: userId,
      type: 'critical',
      message: `${highRiskTxns.length} high-risk transactions detected. Recommended: review and refund immediately.`,
      read: false
    })
  }

  const ngRu = transactions.filter(t => ["NG","RU","UA"].includes(t.country ?? ""))
  if (ngRu.length >= 2) {
    alerts.push({
      user_id: userId,
      type: 'warning',
      message: `${ngRu.length} transactions from high-risk countries detected. Monitor closely.`,
      read: false
    })
  }

  if (alerts.length > 0) {
    await supabase.from('alerts').insert(alerts)
  }
}
