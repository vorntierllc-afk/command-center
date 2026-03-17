'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

interface ProcessorField {
  key: string
  label: string
  placeholder: string
}

interface Processor {
  id: string
  name: string
  color: string
  fields: ProcessorField[]
}

const PROCESSORS: Processor[] = [
  { id: 'stripe', name: 'Stripe', color: '#635BFF', fields: [{ key: 'secret_key', label: 'Secret Key', placeholder: 'sk_live_...' }] },
  { id: 'paypal', name: 'PayPal', color: '#003087', fields: [{ key: 'client_id', label: 'Client ID', placeholder: '' }, { key: 'client_secret', label: 'Client Secret', placeholder: '' }] },
  { id: 'authorize_net', name: 'Authorize.net', color: '#00A651', fields: [{ key: 'api_login_id', label: 'API Login ID', placeholder: '' }, { key: 'transaction_key', label: 'Transaction Key', placeholder: '' }] },
  { id: 'braintree', name: 'Braintree', color: '#1A1F71', fields: [{ key: 'merchant_id', label: 'Merchant ID', placeholder: '' }, { key: 'public_key', label: 'Public Key', placeholder: '' }, { key: 'private_key', label: 'Private Key', placeholder: '' }] },
  { id: 'square', name: 'Square', color: '#3E4348', fields: [{ key: 'access_token', label: 'Access Token', placeholder: 'sq0atp-...' }] },
  { id: 'nmi', name: 'NMI', color: '#E31837', fields: [{ key: 'security_key', label: 'Security Key', placeholder: '' }] },
  { id: 'checkout', name: 'Checkout.com', color: '#0B5FFF', fields: [{ key: 'secret_key', label: 'Secret Key', placeholder: 'sk_...' }] },
  { id: 'adyen', name: 'Adyen', color: '#0ABF53', fields: [{ key: 'api_key', label: 'API Key', placeholder: '' }, { key: 'merchant_account', label: 'Merchant Account', placeholder: '' }] },
  { id: 'mx', name: 'MX Merchant', color: '#FF6B35', fields: [{ key: 'api_key', label: 'API Key', placeholder: '' }] },
]

export default function IntegrationsPage() {
  const supabase = createClient()
  const [connectedProcessor, setConnectedProcessor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProcessor, setSelectedProcessor] = useState<Processor | null>(null)
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [connecting, setConnecting] = useState(false)
  const [connectSuccess, setConnectSuccess] = useState(false)
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const [lastSynced, setLastSynced] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: m } = await supabase.from('merchants').select('id, processor, last_synced_at').eq('user_id', user.id).single()
      if (m) {
        setConnectedProcessor(m.processor || null)
        setMerchantId(m.id)
        setLastSynced(m.last_synced_at || null)
      }
      setLoading(false)
    }
    load()
  }, [])

  function openConnect(p: Processor) {
    setSelectedProcessor(p)
    setCredentials({})
    setConnectSuccess(false)
  }

  async function handleConnect() {
    if (!selectedProcessor || !merchantId) return
    setConnecting(true)
    try {
      const res = await fetch('/api/processor/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processor: selectedProcessor.id, credentials, merchantId })
      })
      if (res.ok) {
        await supabase.from('merchants').update({ processor: selectedProcessor.id, last_synced_at: new Date().toISOString() }).eq('id', merchantId)
        setConnectedProcessor(selectedProcessor.id)
        setLastSynced(new Date().toISOString())
        setConnectSuccess(true)
      }
    } catch {
      // silently handle
    } finally {
      setConnecting(false)
    }
  }

  async function handleSyncNow() {
    if (!merchantId || !connectedProcessor) return
    await fetch('/api/processor/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processor: connectedProcessor, merchantId })
    })
    await supabase.from('merchants').update({ last_synced_at: new Date().toISOString() }).eq('id', merchantId)
    setLastSynced(new Date().toISOString())
  }

  async function handleDisconnect(processorId: string) {
    if (!merchantId) return
    await supabase.from('merchants').update({ processor: null }).eq('id', merchantId)
    setConnectedProcessor(null)
  }

  function formatSyncTime(ts: string | null): string {
    if (!ts) return 'Never'
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff} min ago`
    return new Date(ts).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Integrations</h1>
        <p className="text-[#6B7280] text-sm mt-1">Connect your payment processors to unlock real-time data sync.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROCESSORS.map(p => {
            const isConnected = connectedProcessor === p.id
            return (
              <div key={p.id} className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 flex items-center gap-4 h-[100px]">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: p.color }}>
                  {p.name[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827]">{p.name}</p>
                  {isConnected && (
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Synced: {formatSyncTime(lastSynced)}</p>
                  )}
                </div>

                {/* Action */}
                {isConnected ? (
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                      <span className="text-xs text-[#10B981] font-medium">Connected</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={handleSyncNow} className="text-xs border border-[#E5E7EB] text-[#6B7280] px-2 py-1 rounded-lg hover:bg-gray-50 transition">Sync</button>
                      <button onClick={() => handleDisconnect(p.id)} className="text-xs border border-red-100 text-[#EF4444] px-2 py-1 rounded-lg hover:bg-red-50 transition">Disconnect</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => openConnect(p)}
                    className="text-xs bg-[#4F46E5] text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium flex-shrink-0">
                    Connect +
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Connect Panel */}
      <AnimatePresence>
        {selectedProcessor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProcessor(null)}
              className="fixed inset-0 bg-black/30 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: selectedProcessor.color }}>
                    {selectedProcessor.name[0]}
                  </div>
                  <h3 className="font-bold text-[#111827]">Connect {selectedProcessor.name}</h3>
                </div>
                <button onClick={() => setSelectedProcessor(null)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition">✕</button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-5">
                {connectSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#10B981] text-2xl">✓</span>
                    </div>
                    <p className="text-lg font-bold text-[#111827] mb-2">Connected!</p>
                    <p className="text-sm text-[#6B7280]">{selectedProcessor.name} has been connected. Your data will sync shortly.</p>
                    <button onClick={() => setSelectedProcessor(null)} className="mt-6 bg-[#4F46E5] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-indigo-700 transition">
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    {selectedProcessor.fields.map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">{field.label}</label>
                        <input
                          type="password"
                          value={credentials[field.key] || ''}
                          onChange={e => setCredentials(c => ({ ...c, [field.key]: e.target.value }))}
                          placeholder={field.placeholder || `Enter ${field.label}`}
                          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4F46E5] transition bg-[#F9FAFB]"
                        />
                      </div>
                    ))}

                    <div className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                      <span className="text-sm">🔒</span>
                      <p className="text-xs text-[#6B7280]">Encrypted with AES-256. Your credentials are never stored in plain text.</p>
                    </div>

                    <button
                      onClick={handleConnect}
                      disabled={connecting || selectedProcessor.fields.some(f => !credentials[f.key])}
                      className="w-full bg-[#4F46E5] text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {connecting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Connecting & Syncing...
                        </span>
                      ) : 'Connect & Sync'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
