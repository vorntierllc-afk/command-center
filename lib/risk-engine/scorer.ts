const HIGH_RISK_COUNTRIES = ["NG","RU","UA","BY","IR","KP","SY","YE","VE","MM","AF","IQ"]
const MED_RISK_COUNTRIES = ["BR","MX","PH","PK","BD","VN","ID","GH","KE","TZ"]
const DISPOSABLE_EMAILS = ["mailinator","tempmail","guerrilla","throwaway","yopmail","trashmail"]

export function scoreTransaction(tx: {
  amount: number
  country?: string
  email?: string
  created_at?: string
  disputed?: boolean
}) {
  let score = 0
  const signals: string[] = []

  if (tx.country && HIGH_RISK_COUNTRIES.includes(tx.country)) { score += 25; signals.push("High-risk country") }
  else if (tx.country && MED_RISK_COUNTRIES.includes(tx.country)) { score += 12; signals.push("Medium-risk country") }

  if (tx.amount > 5000) { score += 15; signals.push("Very high amount") }
  else if (tx.amount > 2500) { score += 12; signals.push("High amount") }
  else if (tx.amount > 1000) { score += 8; signals.push("Above average amount") }

  if (tx.email && DISPOSABLE_EMAILS.some(d => tx.email!.includes(d))) {
    score += 10; signals.push("Disposable email")
  }

  if (tx.created_at) {
    const hour = new Date(tx.created_at).getHours()
    if (hour >= 1 && hour <= 5) { score += 8; signals.push("Unusual hour") }
  }

  if (tx.disputed) { score += 20; signals.push("Previously disputed") }

  score = Math.min(100, Math.max(0, score))
  const action = score >= 80 ? "block" : score >= 50 ? "review" : "approve"

  return { score, action, signals }
}
