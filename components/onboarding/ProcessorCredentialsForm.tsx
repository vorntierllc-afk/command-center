'use client'

import { useState } from 'react'

const PROCESSORS = [
  { id: 'stripe', name: 'Stripe', logo: '💳', fields: [
    { key: 'secret_key', label: 'Secret Key', placeholder: 'sk_live_...' }
  ]},
  { id: 'paypal', name: 'PayPal', logo: '🅿️', fields: [
    { key: 'client_id', label: 'Client ID', placeholder: 'AXxx...' },
    { key: 'client_secret', label: 'Client Secret', placeholder: 'EXxx...' }
  ]},
  { id: 'authorize_net', name: 'Authorize.net', logo: '🏦', fields: [
    { key: 'api_login_id', label: 'API Login ID', placeholder: '' },
    { key: 'transaction_key', label: 'Transaction Key', placeholder: '' }
  ]},
  { id: 'braintree', name: 'Braintree', logo: '🌿', fields: [
    { key: 'merchant_id', label: 'Merchant ID', placeholder: '' },
    { key: 'public_key', label: 'Public Key', placeholder: '' },
    { key: 'private_key', label: 'Private Key', placeholder: '' }
  ]},
  { id: 'square', name: 'Square', logo: '⬛', fields: [
    { key: 'access_token', label: 'Access Token', placeholder: 'sq0atp-...' }
  ]},
  { id: 'nmi', name: 'NMI', logo: '🔐', fields: [
    { key: 'security_key', label: 'Security Key', placeholder: '' }
  ]},
]

interface Props {
  onConnect: (processor: string, credentials: Record<string, string>) => void
  loading?: boolean
}

export default function ProcessorCredentialsForm({ onConnect, loading }: Props) {
  const [selectedProcessor, setSelectedProcessor] = useState<string>('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})

  const processorConfig = PROCESSORS.find(p => p.id === selectedProcessor)

  function handleSelectProcessor(id: string) {
    setSelectedProcessor(id)
    setCredentials({})
  }

  function handleFieldChange(key: string, value: string) {
    setCredentials(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    if (!selectedProcessor || !processorConfig) return
    onConnect(selectedProcessor, credentials)
  }

  const allFieldsFilled = processorConfig
    ? processorConfig.fields.every(f => credentials[f.key]?.trim())
    : false

  return (
    <div className="w-full">
      {/* Processor grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {PROCESSORS.map(p => (
          <button
            key={p.id}
            onClick={() => handleSelectProcessor(p.id)}
            className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-sm font-medium transition ${
              selectedProcessor === p.id
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : 'bg-white text-[#0A0A0A] border-[#E5E7EB] hover:border-[#0A0A0A]'
            }`}
          >
            <span className="text-xl">{p.logo}</span>
            <span className="text-xs">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Credential fields */}
      {processorConfig && (
        <div className="space-y-3 mb-4">
          {processorConfig.fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
              <input
                type="password"
                placeholder={field.placeholder}
                value={credentials[field.key] || ''}
                onChange={e => handleFieldChange(field.key, e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] font-mono bg-white"
                autoComplete="off"
              />
            </div>
          ))}
        </div>
      )}

      {/* Security note */}
      {selectedProcessor && (
        <p className="text-xs text-gray-400 mb-5">
          🔒 Your credentials are encrypted with AES-256 and never stored in plaintext
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!allFieldsFilled || loading}
        className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          'Connect & Sync →'
        )}
      </button>
    </div>
  )
}
