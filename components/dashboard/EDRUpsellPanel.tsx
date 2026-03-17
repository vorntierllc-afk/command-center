'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Props {
  userId: string
  chargebackRate: number
  disputeCount: number
  dismissedAt?: string | null
  dismissed?: boolean
}

export default function EDRUpsellPanel({ userId, chargebackRate, disputeCount, dismissedAt, dismissed }: Props) {
  const shouldShow = (chargebackRate > 0.8 || disputeCount > 2) &&
    !(dismissed && dismissedAt && (Date.now() - new Date(dismissedAt).getTime()) < 48 * 60 * 60 * 1000)

  const [visible, setVisible] = useState(shouldShow)

  async function handleDismiss() {
    setVisible(false)
    const supabase = createClient()
    await supabase.from('merchants').update({
      dismissed_edr_upsell: true,
      edr_dismissed_at: new Date().toISOString()
    }).eq('user_id', userId)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed right-0 top-20 z-50 w-80 bg-gray-900 text-white rounded-l-2xl shadow-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h3 className="font-bold text-white text-sm">Protect Your MID</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-300 text-lg leading-none transition"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            Get alerted the moment a dispute is filed — before it becomes a chargeback.
          </p>

          <div className="space-y-2 mb-4">
            {[
              'Real-time dispute alerts',
              '24–72hr response window',
              'Covers 95% of Visa + Mastercard disputes',
              'Prevents up to 57% of chargebacks',
            ].map(benefit => (
              <div key={benefit} className="flex items-center gap-2">
                <span className="text-green-400 font-bold text-xs flex-shrink-0">✓</span>
                <span className="text-gray-300 text-xs">{benefit}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-xs italic mb-5">
            &ldquo;Merchants using dispute alerts reduce chargebacks by up to 57%&rdquo;
          </p>

          <div className="space-y-2">
            <Link
              href="/pricing"
              className="block w-full bg-white text-gray-900 text-center py-2.5 rounded-full text-xs font-semibold hover:bg-gray-100 transition"
            >
              Activate — $49/mo
            </Link>
            <button
              onClick={handleDismiss}
              className="w-full text-gray-500 hover:text-gray-300 text-xs py-1 transition"
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
