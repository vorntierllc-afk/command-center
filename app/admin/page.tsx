import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const PLAN_MRR: Record<string, number> = {
  basic: 30,
  pro: 50,
  agency: 200,
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  // Check if user is admin
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)
  if (!adminEmails.includes(user.email ?? '')) {
    redirect('/dashboard')
  }

  const admin = createSupabaseAdminClient()
  if (!admin) redirect('/dashboard')

  // Fetch all merchants
  const { data: merchants } = await admin
    .from('merchants')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch auth users to get emails
  const { data: authData } = await admin.auth.admin.listUsers()
  const userMap = new Map(authData?.users?.map(u => [u.id, u]) ?? [])

  const merchantList = merchants ?? []
  const activeCount = merchantList.filter(m => m.subscription_status === 'active').length
  const mrr = merchantList.reduce((sum, m) => {
    if (m.subscription_status === 'active') {
      return sum + (PLAN_MRR[m.plan ?? 'basic'] ?? 30)
    }
    return sum
  }, 0)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#07070A', color: '#F1F1F3', minHeight: '100vh', padding: '48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Admin Panel</h1>
          <p style={{ color: '#8C8C9A', fontSize: 14 }}>HighRiskIntel internal dashboard</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Merchants', value: merchantList.length.toString() },
            { label: 'Active Subscriptions', value: activeCount.toString() },
            { label: 'Monthly MRR', value: `$${mrr.toLocaleString()}` },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px 28px' }}>
              <p style={{ fontSize: 12, color: '#55555F', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>{stat.label}</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#F1F1F3' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Merchants Table */}
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>All Merchants</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Business Name', 'Email', 'Plan', 'Chargeback Rate', 'Status', 'Joined', 'Actions'].map(col => (
                    <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#55555F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {merchantList.map(merchant => {
                  const authUser = userMap.get(merchant.user_id)
                  const email = authUser?.email ?? '—'
                  const businessName = merchant.business_name ?? merchant.businessName ?? '—'
                  const plan = merchant.plan ?? 'basic'
                  const chargebackRate = merchant.chargeback_rate ?? 0
                  const status = merchant.status ?? 'onboarding'
                  const joined = merchant.created_at ? new Date(merchant.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
                  const rateColor = chargebackRate > 1.5 ? '#EF4444' : chargebackRate > 1.0 ? '#F59E0B' : '#22C55E'
                  const statusColor = status === 'active' ? '#22C55E' : status === 'analyzing' ? '#3B82F6' : '#55555F'

                  return (
                    <tr key={merchant.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#F1F1F3', fontWeight: 500 }}>{businessName}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#8C8C9A' }}>{email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#F1F1F3', background: 'rgba(255,255,255,0.07)', padding: '3px 10px', borderRadius: 100, textTransform: 'capitalize' }}>
                          {plan}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: rateColor }}>
                        {typeof chargebackRate === 'number' ? `${chargebackRate.toFixed(2)}%` : '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: statusColor, textTransform: 'capitalize' }}>
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#55555F' }}>{joined}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link
                          href={`/admin/merchant/${merchant.id}`}
                          style={{ fontSize: 12, fontWeight: 600, color: '#3B82F6', textDecoration: 'none' }}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {merchantList.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#55555F', fontSize: 13 }}>
                      No merchants yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
