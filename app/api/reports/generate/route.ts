import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: merchant } = await supabase
      .from('merchants')
      .select('id, chargeback_rate, total_volume, ai_analysis, biggest_threat, recommended_actions')
      .eq('user_id', user.id)
      .single()

    if (!merchant) return NextResponse.json({ error: 'No merchant profile found' }, { status: 400 })

    // Fetch transactions from this week
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
    const { data: txs } = await supabase
      .from('transactions')
      .select('id, amount, disputed, risk_score, refunded')
      .eq('merchant_id', merchant.id)
      .gte('created_at', weekAgo)

    const transactions = txs || []
    const disputesCaught = transactions.filter(t => t.disputed).length
    const highRiskRefunded = transactions.filter(t => t.refunded && t.risk_score >= 75).length
    const revenueSaved = transactions.filter(t => t.refunded).reduce((s, t) => s + (t.amount || 0), 0)
    const cbRate = merchant.chargeback_rate ?? 0

    const weekLabel = `Week of ${new Date(Date.now() - 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

    const summary = `Analyzed ${transactions.length} transactions this week. Chargeback rate: ${(cbRate * 100).toFixed(2)}%. ${disputesCaught} disputes detected. ${highRiskRefunded} high-risk transactions refunded proactively, saving approximately $${revenueSaved.toFixed(0)} in potential chargebacks.${merchant.biggest_threat ? ` Biggest risk: ${merchant.biggest_threat}.` : ''}`

    const fullReport = [
      `# HighRiskIntel Weekly Risk Report`,
      `${weekLabel}`,
      ``,
      `## Summary`,
      summary,
      ``,
      `## Key Metrics`,
      `- Chargeback Rate: ${(cbRate * 100).toFixed(2)}%`,
      `- Transactions Analyzed: ${transactions.length}`,
      `- Disputes Caught: ${disputesCaught}`,
      `- High-Risk Refunds: ${highRiskRefunded}`,
      `- Revenue Protected: $${revenueSaved.toFixed(2)}`,
      ``,
      `## Recommended Actions`,
      ...(merchant.recommended_actions as string[] || ['Review high-risk transactions', 'Monitor chargeback rate daily']).map((a: string) => `- ${a}`),
    ].join('\n')

    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        merchant_id: merchant.id,
        user_id: user.id,
        week_label: weekLabel,
        transactions_analyzed: transactions.length,
        disputes_caught: disputesCaught,
        revenue_saved: revenueSaved,
        actions_taken: highRiskRefunded,
        chargeback_rate: cbRate,
        summary,
        full_report: fullReport,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ report })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
