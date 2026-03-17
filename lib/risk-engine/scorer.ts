export const HIGH_RISK_COUNTRIES = ["NG","RU","UA","BY","IR","KP","SY","YE","VE","MM","AF","IQ","LY","SD"]
export const MED_RISK_COUNTRIES = ["BR","MX","PH","PK","BD","VN","ID","GH","KE","TZ","EG","MA"]
const DISPOSABLE_EMAIL_DOMAINS = ["mailinator","tempmail","guerrilla","throwaway","yopmail","trashmail","fakeinbox"]

export interface TransactionInput {
  amount: number
  country?: string
  email?: string
  disputed?: boolean
  created_at?: string
  ip_address?: string
}

export interface ScoredTransaction {
  score: number
  action: 'approve' | 'review' | 'block'
  signals: string[]
}

export function scoreTransaction(tx: TransactionInput): ScoredTransaction {
  let score = 0
  const signals: string[] = []

  if (tx.country && HIGH_RISK_COUNTRIES.includes(tx.country)) {
    score += 25; signals.push("High-risk country")
  } else if (tx.country && MED_RISK_COUNTRIES.includes(tx.country)) {
    score += 12; signals.push("Medium-risk country")
  }

  if (tx.amount > 5000) { score += 15; signals.push("Very high amount") }
  else if (tx.amount > 2500) { score += 12; signals.push("High amount") }
  else if (tx.amount > 1000) { score += 8; signals.push("Above average amount") }

  if (tx.email && DISPOSABLE_EMAIL_DOMAINS.some(d => tx.email!.includes(d))) {
    score += 10; signals.push("Disposable email domain")
  }

  if (tx.created_at) {
    const hour = new Date(tx.created_at).getHours()
    if (hour >= 1 && hour <= 5) { score += 8; signals.push("Unusual transaction hour") }
  }

  if (tx.disputed) { score += 20; signals.push("Previously disputed") }

  score = Math.min(100, Math.max(0, score))

  let action: 'approve' | 'review' | 'block' = 'approve'
  if (score >= 80) action = 'block'
  else if (score >= 50) action = 'review'

  return { score, action, signals }
}

export function calcMidHealthScore(chargebackRate: number, highRiskCount: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - (chargebackRate * 100 * 30) - (highRiskCount * 2))))
}
