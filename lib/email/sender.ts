import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendCriticalAlertEmail(to: string, name: string, chargebackRate: number, biggestThreat: string, recommendedAction: string) {
  await getResend().emails.send({
    from: 'alerts@highriskintel.com',
    to,
    subject: `\u26a0\ufe0f Your chargeback rate needs attention \u2014 HighRiskIntel`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
        <h2 style="color: #111; margin-bottom: 8px;">Action Required</h2>
        <p style="color: #666; margin-bottom: 24px;">Hi ${name},</p>
        <p style="color: #333;">Your chargeback rate is now <strong style="color: #dc2626;">${chargebackRate.toFixed(2)}%</strong>, above the warning threshold.</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; color: #991b1b;"><strong>Top risk factor:</strong> ${biggestThreat}</p>
          <p style="margin: 8px 0 0; color: #991b1b;"><strong>Recommended action:</strong> ${recommendedAction}</p>
        </div>
        <a href="https://highriskintel.com/dashboard" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View your dashboard &rarr;</a>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">HighRiskIntel &middot; Unsubscribe</p>
      </div>
    `
  })
}

export async function sendWeeklyReportEmail(to: string, name: string, chargebackRate: number, totalVolume: number, alertCount: number) {
  await getResend().emails.send({
    from: 'reports@highriskintel.com',
    to,
    subject: `Your weekly risk report \u2014 HighRiskIntel`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
        <h2 style="color: #111;">Weekly Risk Report</h2>
        <p style="color: #666;">Hi ${name}, here's your week in review.</p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0;">
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">${chargebackRate.toFixed(2)}%</p>
            <p style="color: #666; font-size: 12px; margin: 4px 0 0;">Chargeback Rate</p>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">$${totalVolume.toLocaleString()}</p>
            <p style="color: #666; font-size: 12px; margin: 4px 0 0;">Total Volume</p>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">${alertCount}</p>
            <p style="color: #666; font-size: 12px; margin: 4px 0 0;">New Alerts</p>
          </div>
        </div>
        <a href="https://highriskintel.com/dashboard" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View full report &rarr;</a>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">HighRiskIntel &middot; Unsubscribe</p>
      </div>
    `
  })
}
