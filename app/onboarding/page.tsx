'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import ProcessorCredentialsForm from '@/components/onboarding/ProcessorCredentialsForm'

type StepId = 1 | 2 | 3 | 4 | 5 | '5a' | '5b' | 6

interface OnboardingData {
  businessType?: string
  industry?: string
  volume?: string
  disputeRate?: string
  processor?: string
  credentials?: Record<string, string>
}

interface AnalysisResult {
  chargeback_rate?: number
  total_transactions?: number
  biggest_threat?: string
  summary?: string
}

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current ? 'bg-[#0A0A0A] w-6' : i === current ? 'bg-[#0A0A0A] w-4' : 'bg-[#E5E7EB] w-4'
        }`} />
      ))}
    </div>
  )
}

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

const INDUSTRIES = [
  { icon: '💊', label: 'Nutraceuticals & Supplements', value: 'supplements' },
  { icon: '✈️', label: 'Travel & Hospitality', value: 'travel' },
  { icon: '🎮', label: 'Gaming & Digital Goods', value: 'gaming' },
  { icon: '💻', label: 'SaaS & Software', value: 'saas' },
  { icon: '🔞', label: 'Adult Content', value: 'adult' },
  { icon: '🔫', label: 'Firearms & Ammunition', value: 'firearms' },
  { icon: '₿', label: 'Crypto & Digital Assets', value: 'crypto' },
  { icon: '🛒', label: 'E-commerce (General)', value: 'ecommerce' },
  { icon: '🏥', label: 'Health & Wellness', value: 'health' },
  { icon: '❓', label: 'Other', value: 'other' },
]

const VOLUMES = [
  { label: 'Under $10,000/mo', value: 'under_10k' },
  { label: '$10,000 – $50,000/mo', value: '10k_50k' },
  { label: '$50,000 – $200,000/mo', value: '50k_200k' },
  { label: '$200,000 – $500,000/mo', value: '200k_500k' },
  { label: '$500,000 – $1,000,000/mo', value: '500k_1m' },
  { label: 'Over $1,000,000/mo', value: 'over_1m' },
]

const DISPUTE_RATES = [
  { icon: '🟢', label: "Under 0.5% — I'm in good shape", value: 'under_0.5' },
  { icon: '🟡', label: '0.5% – 1.0% — Getting close to thresholds', value: '0.5_1.0' },
  { icon: '🔴', label: '1.0% – 2.0% — My processor has warned me', value: '1.0_2.0' },
  { icon: '🚨', label: "Over 2.0% — I'm at serious risk", value: 'over_2.0' },
  { icon: '❓', label: "I don't know my dispute rate", value: 'unknown' },
]

const PROCESSOR_FIELDS: Record<string, { key: string; placeholder: string; label: string; isPassword?: boolean }[]> = {
  Stripe: [
    { key: 'secretKey', placeholder: 'sk_live_...', label: 'Secret Key', isPassword: true },
    { key: 'publishableKey', placeholder: 'pk_live_...', label: 'Publishable Key' },
  ],
  'Checkout.com': [
    { key: 'secretKey', placeholder: 'sk_...', label: 'Secret Key', isPassword: true },
    { key: 'channelId', placeholder: 'pro_...', label: 'Processing Channel ID' },
  ],
  Adyen: [
    { key: 'apiKey', placeholder: 'AQE...', label: 'API Key', isPassword: true },
    { key: 'merchantAccount', placeholder: 'YourMerchantAccount', label: 'Merchant Account' },
    { key: 'clientKey', placeholder: 'test_...', label: 'Client Key' },
  ],
  MXMerchant: [
    { key: 'apiKey', placeholder: 'Your API Key', label: 'API Key', isPassword: true },
    { key: 'merchantId', placeholder: 'Your Merchant ID', label: 'Merchant ID' },
  ],
  'Authorize.net': [
    { key: 'loginId', placeholder: 'API Login ID', label: 'API Login ID' },
    { key: 'transactionKey', placeholder: 'Transaction Key', label: 'Transaction Key', isPassword: true },
  ],
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<StepId>(1)
  const [data, setData] = useState<OnboardingData>({})
  const [selectedProcessor, setSelectedProcessor] = useState('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<File[]>([])
  const [analyzeStepIdx, setAnalyzeStepIdx] = useState(-1)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncResult, setSyncResult] = useState<{ transactions_synced?: number; chargeback_rate?: number; total_volume?: number } | null>(null)

  const stepIndex = step === 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : step === 4 ? 3 : 4

  const isApiFlow = step === '5a' || (data.credentials !== undefined)
  const analyzeSteps = isApiFlow
    ? ['Validating your processor credentials...', `Connecting to ${selectedProcessor}...`, 'Pulling your transaction history...', 'Scoring transactions with risk engine...', 'Identifying dispute patterns...', 'Generating your risk profile...', 'Analysis complete.']
    : ['Uploading your statements securely...', 'Extracting transaction data...', 'Running AI analysis on your statements...', 'Calculating your chargeback rate...', 'Identifying high-risk patterns...', 'Generating your first report...', 'Analysis complete.']

  function pick(key: keyof OnboardingData, value: string, next: StepId) {
    setData(d => ({ ...d, [key]: value }))
    setStep(next)
  }

  async function skipOnboarding() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('merchants').update({ onboard_method: 'skipped', onboarding_data: data }).eq('user_id', user.id)
    }
    router.push('/dashboard')
  }

  async function runAnalysis(method: 'api' | 'upload') {
    setStep(6)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('merchants').update({
      onboard_method: method,
      onboarding_data: data,
      status: 'analyzing'
    }).eq('user_id', user.id)

    const stepsToAnimate = method === 'api'
      ? ['Validating your processor credentials...', `Connecting to ${selectedProcessor}...`, 'Pulling your transaction history...', 'Scoring transactions with risk engine...', 'Identifying dispute patterns...', 'Generating your risk profile...', 'Analysis complete.']
      : ['Uploading your statements securely...', 'Extracting transaction data...', 'Running AI analysis on your statements...', 'Calculating your chargeback rate...', 'Identifying high-risk patterns...', 'Generating your first report...', 'Analysis complete.']

    for (let i = 0; i < stepsToAnimate.length - 1; i++) {
      setAnalyzeStepIdx(i)
      await new Promise(r => setTimeout(r, i === 0 ? 800 : 900))
    }

    let result: AnalysisResult = {}
    try {
      if (method === 'api') {
        const res = await fetch('/api/processor/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ processor: selectedProcessor, credentials })
        })
        const json = await res.json()
        result = json.analysis || {}
      } else {
        const formData = new FormData()
        files.forEach(f => formData.append('files', f))
        const res = await fetch('/api/statements/analyze', { method: 'POST', body: formData })
        const json = await res.json()
        result = json.analysis || {}
      }
    } catch (e) {
      console.error('Analysis error', e)
    }

    setAnalyzeStepIdx(stepsToAnimate.length - 1)
    await new Promise(r => setTimeout(r, 600))
    setAnalysisResult(result)
    setAnalysisDone(true)
  }

  async function handleProcessorConnect(processor: string, processorCredentials: Record<string, string>) {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/processor/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processor, credentials: processorCredentials })
    })
    const apiData = await res.json()
    if (apiData.success) {
      setSyncResult(apiData)
      setSelectedProcessor(processor)
      setCredentials(processorCredentials)
      setData(d => ({ ...d, processor, credentials: processorCredentials }))
      runAnalysis('api')
    } else {
      setError(apiData.error || 'Connection failed')
    }
    setLoading(false)
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">I&apos;m a...</h1>
            <p className="text-gray-500 text-sm mb-8">Tell us about yourself so we can set up your risk profile correctly.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏪', label: 'Solo merchant', value: 'solo' },
                { icon: '🏢', label: 'Business owner', value: 'business' },
                { icon: '🔗', label: 'ISO / Reseller', value: 'iso' },
                { icon: '🏦', label: 'Payment facilitator', value: 'payfac' },
              ].map(opt => (
                <button key={opt.value} onClick={() => pick('businessType', opt.value, 2)}
                  className="flex flex-col items-start p-7 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#0A0A0A] hover:shadow-md transition text-left">
                  <span className="text-2xl mb-3">{opt.icon}</span>
                  <span className="font-semibold text-[#0A0A0A]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">What&apos;s your industry?</h1>
            <p className="text-gray-500 text-sm mb-6">We calibrate risk thresholds based on your vertical.</p>
            <div className="space-y-2">
              {INDUSTRIES.map(opt => (
                <button key={opt.value} onClick={() => pick('industry', opt.value, 3)}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0A0A0A] hover:shadow-sm transition text-left h-14">
                  <span className="text-xl w-8 flex-shrink-0">{opt.icon}</span>
                  <span className="font-medium text-[#0A0A0A] flex-1">{opt.label}</span>
                  <span className="text-gray-300 text-sm">→</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">What&apos;s your monthly volume?</h1>
            <p className="text-gray-500 text-sm mb-6">This sets your baseline risk thresholds and dispute rate benchmarks.</p>
            <div className="space-y-2">
              {VOLUMES.map(opt => (
                <button key={opt.value} onClick={() => pick('volume', opt.value, 4)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0A0A0A] hover:shadow-sm transition h-14">
                  <span className="font-medium text-[#0A0A0A]">{opt.label}</span>
                  <span className="text-gray-300 text-sm">→</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">What&apos;s your current dispute rate?</h1>
            <p className="text-gray-500 text-sm mb-6">Be honest — this is private and helps us understand your starting point.</p>
            <div className="space-y-2">
              {DISPUTE_RATES.map(opt => (
                <button key={opt.value} onClick={() => pick('disputeRate', opt.value, 5)}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0A0A0A] hover:shadow-sm transition text-left h-14">
                  <span className="text-lg w-7 flex-shrink-0">{opt.icon}</span>
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
            <p className="text-gray-500 text-sm mb-8">Choose how to bring your transaction data into HighRiskIntel.</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setStep('5a')}
                className="flex flex-col p-6 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#0A0A0A] hover:shadow-md transition text-left">
                <span className="text-2xl mb-3">⚡</span>
                <span className="font-semibold text-[#0A0A0A] mb-2">Connect Processor API</span>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">Get live data instantly. We validate your keys and sync your last 90 days.</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['Real-time', '5 min setup', 'Most accurate'].map(t => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#0A0A0A]">Connect API →</span>
              </button>
              <button onClick={() => setStep('5b')}
                className="flex flex-col p-6 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#0A0A0A] hover:shadow-md transition text-left">
                <span className="text-2xl mb-3">📄</span>
                <span className="font-semibold text-[#0A0A0A] mb-2">Upload Statements</span>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">Upload 2–3 months of processing and bank statements. AI-powered analysis.</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['PDF & CSV', 'No API needed', 'AI-powered'].map(t => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#0A0A0A]">Upload files →</span>
              </button>
            </div>
            <button onClick={skipOnboarding} className="text-sm text-gray-400 hover:text-gray-600 transition mx-auto block">
              Skip for now →
            </button>
          </div>
        )

      case '5a':
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Select your processor.</h1>
            <p className="text-gray-500 text-sm mb-6">We&apos;ll validate your credentials and pull your transaction history.</p>
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
            <ProcessorCredentialsForm
              onConnect={handleProcessorConnect}
              loading={loading}
            />
          </div>
        )

      case '5b':
        return (
          <div className="w-full max-w-[560px] mx-auto">
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Upload your statements.</h1>
            <p className="text-gray-500 text-sm mb-6">Upload 2–3 months of processing and bank statements. PDF or CSV. Up to 6 files.</p>

            <label
              className="block border-2 border-dashed border-[#E5E7EB] rounded-2xl p-10 text-center cursor-pointer hover:border-[#0A0A0A] transition mb-4"
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)].slice(0, 6)) }}>
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.csv" className="hidden"
                onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || [])].slice(0, 6))} />
              <div className="flex justify-center gap-3 mb-3 text-2xl">📄 📊 🗂️</div>
              <p className="text-gray-500 text-sm font-medium">Drop files here or click to browse</p>
              <p className="text-gray-400 text-xs mt-1">PDF and CSV accepted · Up to 6 files · Max 10MB each</p>
            </label>

            {files.length > 0 && (
              <div className="space-y-2 mb-4">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 text-lg">{f.name.endsWith('.csv') ? '📊' : '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0A0A0A] truncate">{f.name}</p>
                      <p className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-500 transition text-sm">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: '💳', title: 'Processing Statements', desc: 'Monthly statements from your processor' },
                { icon: '🏦', title: 'Bank Statements', desc: '2–3 months of business bank statements' },
                { icon: '📋', title: 'Dispute Reports', desc: 'Any chargeback reports (optional)' },
              ].map(c => (
                <div key={c.title} className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl block mb-2">{c.icon}</span>
                  <p className="text-xs font-semibold text-[#0A0A0A] mb-1">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => runAnalysis('upload')}
              disabled={files.length === 0}
              className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-40">
              Analyze my statements →
            </button>
          </div>
        )

      case 6:
        return (
          <div className="w-full max-w-[400px] mx-auto text-center">
            <div className={`w-16 h-16 rounded-full border-2 mx-auto mb-8 flex items-center justify-center transition-colors ${
              analysisDone ? 'border-[#16A34A] bg-green-50' : 'border-[#0A0A0A] animate-pulse'
            }`}>
              <span className="text-2xl">{analysisDone ? '✓' : '⚡'}</span>
            </div>

            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">
              {analyzeStepIdx < 2 ? 'Analyzing your data...' : analyzeStepIdx < 4 ? 'Building your risk profile...' : analysisDone ? 'Your dashboard is ready.' : 'Almost ready...'}
            </h1>

            <div className="space-y-4 text-left my-8">
              {analyzeSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                    analyzeStepIdx > i ? 'bg-[#16A34A] text-white' : analyzeStepIdx === i ? 'bg-[#0A0A0A] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {analyzeStepIdx > i ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm ${analyzeStepIdx > i ? 'text-[#16A34A]' : analyzeStepIdx === i ? 'text-[#0A0A0A] font-medium' : 'text-gray-400'}`}>{s}</span>
                  {analyzeStepIdx === i && !analysisDone && (
                    <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin ml-auto flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mb-8">
              <div className="bg-[#0A0A0A] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${analyzeStepIdx < 0 ? 0 : ((analyzeStepIdx + 1) / analyzeSteps.length) * 100}%` }} />
            </div>

            {analysisDone && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {analysisResult && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Chargeback rate</p>
                      <p className="font-bold text-[#0A0A0A]">
                        {analysisResult.chargeback_rate != null ? `${(analysisResult.chargeback_rate * 100).toFixed(2)}%` : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Transactions</p>
                      <p className="font-bold text-[#0A0A0A]">{analysisResult.total_transactions ?? 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 col-span-1">
                      <p className="text-xs text-gray-400 mb-1">Top risk</p>
                      <p className="font-bold text-[#0A0A0A] text-xs truncate">{analysisResult.biggest_threat ?? 'See dashboard'}</p>
                    </div>
                  </div>
                )}
                <button onClick={() => router.push('/dashboard')}
                  className="w-full bg-[#0A0A0A] text-white rounded-full py-3 text-sm font-semibold hover:bg-gray-900 transition">
                  View my dashboard →
                </button>
              </motion.div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const backMap: Partial<Record<StepId, StepId>> = { 2: 1, 3: 2, 4: 3, 5: 4, '5a': 5, '5b': 5 }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#0A0A0A] rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          <span className="font-semibold text-[#0A0A0A]">HighRiskIntel</span>
        </div>
        {step !== 6 && step !== 1 && (
          <button onClick={() => setStep(backMap[step] ?? 1)}
            className="text-sm text-gray-400 hover:text-[#0A0A0A] transition flex items-center gap-1">
            ← Back
          </button>
        )}
      </div>

      {step !== 6 && (
        <div className="py-5 flex justify-center">
          <ProgressDots current={stepIndex} />
        </div>
      )}

      <div className="flex-1 flex items-start justify-center px-4 py-8 pb-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={String(step)} variants={variants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }} className="w-full">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
