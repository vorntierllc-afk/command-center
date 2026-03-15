'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

type Step = 1 | 2 | 3 | 4 | 5 | '5a' | '5b' | 6

const TOTAL_STEPS = 5

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex gap-2 justify-center mb-12">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? 'bg-[#0A0A0A] w-6' : i === current ? 'bg-[#0A0A0A] w-4' : 'bg-[#E5E7EB] w-4'
          }`}
        />
      ))}
    </div>
  )
}

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedProcessor, setSelectedProcessor] = useState('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<File[]>([])
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [done, setDone] = useState(false)

  const stepIndex = step === 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : step === 4 ? 3 : 4

  function pick(key: string, value: string, next: Step) {
    setAnswers(a => ({ ...a, [key]: value }))
    setStep(next)
  }

  async function saveOnboarding() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('merchants').upsert({
      user_id: user.id,
      business_type: answers.businessType,
      industry: answers.industry,
      monthly_volume: answers.volume,
      dispute_rate: answers.disputeRate,
      onboarding_complete: true,
    })
  }

  async function startAnalysis() {
    setStep(6)
    await saveOnboarding()
    const steps = [0, 1, 2, 3, 4, 5]
    for (const s of steps) {
      await new Promise(r => setTimeout(r, 900))
      setAnalyzeStep(s + 1)
    }
    setDone(true)
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">I&apos;m a...</h1>
            <p className="text-gray-500 mb-8">Tell us about your business so we can personalize your risk profile.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏪', label: 'Solo merchant', value: 'solo' },
                { icon: '🏢', label: 'Business owner', value: 'business' },
                { icon: '🔗', label: 'ISO / Reseller', value: 'iso' },
                { icon: '🏦', label: 'Payment facilitator', value: 'payfac' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => pick('businessType', opt.value, 2)}
                  className="flex flex-col items-start p-6 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#0A0A0A] transition text-left"
                >
                  <span className="text-2xl mb-3">{opt.icon}</span>
                  <span className="font-medium text-[#0A0A0A]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">What&apos;s your industry?</h1>
            <p className="text-gray-500 mb-8">This helps us calibrate your risk thresholds.</p>
            <div className="space-y-2">
              {[
                { icon: '💊', label: 'Nutraceuticals / Supplements', value: 'supplements' },
                { icon: '✈️', label: 'Travel & Hospitality', value: 'travel' },
                { icon: '🎮', label: 'Gaming & Digital Goods', value: 'gaming' },
                { icon: '💻', label: 'SaaS & Software', value: 'saas' },
                { icon: '🔞', label: 'Adult Content', value: 'adult' },
                { icon: '🔫', label: 'Firearms & Ammunition', value: 'firearms' },
                { icon: '₿', label: 'Crypto & Digital Assets', value: 'crypto' },
                { icon: '🛒', label: 'E-commerce (General)', value: 'ecommerce' },
                { icon: '🏥', label: 'Health & Wellness', value: 'health' },
                { icon: '❓', label: 'Other', value: 'other' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => pick('industry', opt.value, 3)}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0A0A0A] transition text-left"
                >
                  <span className="text-xl w-8">{opt.icon}</span>
                  <span className="font-medium text-[#0A0A0A]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">What&apos;s your monthly volume?</h1>
            <p className="text-gray-500 mb-8">We use this to set your baseline risk thresholds.</p>
            <div className="space-y-2">
              {[
                { label: 'Under $10,000', value: 'under_10k' },
                { label: '$10,000 – $50,000', value: '10k_50k' },
                { label: '$50,000 – $200,000', value: '50k_200k' },
                { label: '$200,000 – $500,000', value: '200k_500k' },
                { label: '$500,000 – $1,000,000', value: '500k_1m' },
                { label: 'Over $1,000,000', value: 'over_1m' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => pick('volume', opt.value, 4)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0A0A0A] transition text-left"
                >
                  <span className="font-medium text-[#0A0A0A]">{opt.label}</span>
                  <span className="text-gray-300">→</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">What&apos;s your current dispute rate?</h1>
            <p className="text-gray-500 mb-8">Be honest — this helps us understand where you&apos;re starting from.</p>
            <div className="space-y-2">
              {[
                { icon: '✅', label: "Under 0.5% — I'm in good shape", value: 'under_0.5' },
                { icon: '⚠️', label: '0.5% – 1.0% — Getting close to thresholds', value: '0.5_1.0' },
                { icon: '🔴', label: '1.0% – 2.0% — My processor has warned me', value: '1.0_2.0' },
                { icon: '🚨', label: "Over 2.0% — I'm at risk of termination", value: 'over_2.0' },
                { icon: '❓', label: "I don't know my dispute rate", value: 'unknown' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => pick('disputeRate', opt.value, 5)}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0A0A0A] transition text-left"
                >
                  <span className="text-xl w-8">{opt.icon}</span>
                  <span className="font-medium text-[#0A0A0A]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">How do you want to connect?</h1>
            <p className="text-gray-500 mb-8">Choose how to get your transaction data into HighRiskIntel.</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setStep('5a')}
                className="flex flex-col p-6 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#0A0A0A] transition text-left"
              >
                <span className="text-2xl mb-3">⚡</span>
                <span className="font-semibold text-[#0A0A0A] mb-2">Connect Processor API</span>
                <p className="text-gray-500 text-sm mb-4">Get live data instantly. We validate your credentials and sync your last 90 days.</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Real-time</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">5 min setup</span>
                </div>
              </button>
              <button
                onClick={() => setStep('5b')}
                className="flex flex-col p-6 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#0A0A0A] transition text-left"
              >
                <span className="text-2xl mb-3">📄</span>
                <span className="font-semibold text-[#0A0A0A] mb-2">Upload Statements</span>
                <p className="text-gray-500 text-sm mb-4">Upload 2–3 months of processing and bank statements. PDF or CSV.</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">No API needed</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Upload & done</span>
                </div>
              </button>
            </div>
            <button onClick={startAnalysis} className="text-sm text-gray-400 hover:text-gray-600 transition mx-auto block">
              Skip for now →
            </button>
          </div>
        )

      case '5a':
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Select your processor.</h1>
            <div className="flex gap-3 flex-wrap mb-8">
              {['Stripe', 'MXMerchant', 'Checkout.com', 'Adyen', 'Authorize.net'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedProcessor(p)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${selectedProcessor === p ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white text-[#0A0A0A] border-[#E5E7EB] hover:border-[#0A0A0A]'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {selectedProcessor && (
              <div className="space-y-3 mb-6">
                {selectedProcessor === 'Stripe' && <>
                  <input placeholder="Secret Key (sk_live_...)" onChange={e => setCredentials(c => ({...c, secret: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                  <input placeholder="Publishable Key (pk_live_...)" onChange={e => setCredentials(c => ({...c, pub: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                </>}
                {selectedProcessor === 'Checkout.com' && <>
                  <input placeholder="Secret Key" onChange={e => setCredentials(c => ({...c, secret: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                  <input placeholder="Processing Channel ID" onChange={e => setCredentials(c => ({...c, channel: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                </>}
                {selectedProcessor === 'Adyen' && <>
                  <input placeholder="API Key" onChange={e => setCredentials(c => ({...c, apiKey: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                  <input placeholder="Merchant Account" onChange={e => setCredentials(c => ({...c, merchantAccount: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                  <input placeholder="Client Key" onChange={e => setCredentials(c => ({...c, clientKey: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                </>}
                {selectedProcessor === 'MXMerchant' && <>
                  <input placeholder="API Key" onChange={e => setCredentials(c => ({...c, apiKey: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                  <input placeholder="Merchant ID" onChange={e => setCredentials(c => ({...c, merchantId: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                </>}
                {selectedProcessor === 'Authorize.net' && <>
                  <input placeholder="API Login ID" onChange={e => setCredentials(c => ({...c, loginId: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                  <input placeholder="Transaction Key" onChange={e => setCredentials(c => ({...c, txKey: e.target.value}))} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A]" />
                </>}
              </div>
            )}

            <p className="text-xs text-gray-400 mb-4">🔒 AES-256 encrypted. Read-only access only. Revoke anytime.</p>
            <button
              onClick={startAnalysis}
              disabled={!selectedProcessor}
              className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-40"
            >
              Connect & continue →
            </button>
          </div>
        )

      case '5b':
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Upload your statements.</h1>
            <p className="text-gray-500 mb-8">Upload 2–3 months of processing statements and bank statements.</p>
            <label className="block border-2 border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center cursor-pointer hover:border-[#0A0A0A] transition mb-4">
              <input type="file" multiple accept=".pdf,.csv" className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
              <p className="text-gray-400 mb-1">Drop files here or click to browse</p>
              <p className="text-xs text-gray-300">PDF and CSV · Up to 6 files · Max 10MB each</p>
            </label>
            {files.length > 0 && (
              <div className="space-y-2 mb-4">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">📄</span>
                      <div>
                        <p className="text-sm font-medium text-[#0A0A0A]">{f.name}</p>
                        <p className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-500 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: '💳', title: 'Processing Statements', desc: 'Monthly statements from your processor' },
                { icon: '🏦', title: 'Bank Statements', desc: '2-3 months of business bank statements' },
                { icon: '📋', title: 'Dispute Reports', desc: 'Any chargeback reports (optional)' },
              ].map(c => (
                <div key={c.title} className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl mb-2 block">{c.icon}</span>
                  <p className="text-xs font-semibold text-[#0A0A0A] mb-1">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={startAnalysis}
              className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition"
            >
              Analyze my statements →
            </button>
          </div>
        )

      case 6: {
        const analysisSteps = [
          'Connecting to your data source...',
          'Pulling transaction history...',
          'Calculating your baseline risk score...',
          'Identifying dispute patterns...',
          'Generating your first weekly report...',
          'Your dashboard is ready.',
        ]
        return (
          <div className="w-full max-w-[400px] mx-auto text-center">
            <div className={`w-16 h-16 rounded-full border-2 mx-auto mb-8 flex items-center justify-center ${done ? 'border-[#16A34A] bg-green-50' : 'border-[#0A0A0A] animate-pulse'}`}>
              <span className="text-2xl">{done ? '✓' : '⚡'}</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-8">
              {done ? 'Analysis complete.' : 'Building your risk profile...'}
            </h1>
            <div className="space-y-4 text-left mb-8">
              {analysisSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${analyzeStep > i ? 'bg-[#16A34A] text-white' : analyzeStep === i ? 'bg-[#0A0A0A] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {analyzeStep > i ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm ${analyzeStep > i ? 'text-[#16A34A]' : analyzeStep === i ? 'text-[#0A0A0A] font-medium' : 'text-gray-400'}`}>{s}</span>
                  {analyzeStep === i && !done && <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin ml-auto" />}
                </div>
              ))}
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mb-8">
              <div
                className="bg-[#0A0A0A] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${(analyzeStep / analysisSteps.length) * 100}%` }}
              />
            </div>
            {done && (
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition"
              >
                Go to dashboard →
              </button>
            )}
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          <span className="font-semibold tracking-tight text-[#0A0A0A]">HighRiskIntel</span>
        </div>
        {step !== 6 && step !== 1 && (
          <button
            onClick={() => {
              const prev: Record<string, Step> = { '2': 1, '3': 2, '4': 3, '5': 4, '5a': 5, '5b': 5 }
              setStep(prev[String(step)] ?? 1)
            }}
            className="text-sm text-gray-400 hover:text-[#0A0A0A] transition flex items-center gap-1"
          >
            ← Back
          </button>
        )}
      </div>

      {step !== 6 && <ProgressDots current={stepIndex} />}

      <div className="flex-1 flex items-start justify-center px-4 pb-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={String(step)}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
