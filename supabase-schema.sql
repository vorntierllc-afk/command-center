-- HighRiskIntel Complete Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ─── TABLES ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.merchants (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name        TEXT,
  status               TEXT NOT NULL DEFAULT 'onboarding',
  -- chargeback_rate stored as FRACTION (0.0184 = 1.84%) NOT percentage
  chargeback_rate      NUMERIC DEFAULT 0,
  total_volume         NUMERIC DEFAULT 0,
  avg_ticket           NUMERIC DEFAULT 0,
  mid_risk_level       TEXT DEFAULT 'unknown',
  ai_analysis          JSONB,
  biggest_threat       TEXT,
  recommended_actions  TEXT[],
  top_risk_factors     TEXT[],
  onboard_method       TEXT,
  processor            TEXT,
  plan                 TEXT DEFAULT 'free',
  subscription_status  TEXT DEFAULT 'inactive',
  dismissed_edr_upsell BOOLEAN DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id  UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tx_id        TEXT,
  amount       NUMERIC NOT NULL,
  currency     TEXT DEFAULT 'USD',
  country      TEXT,
  email        TEXT,
  disputed     BOOLEAN DEFAULT false,
  refunded     BOOLEAN DEFAULT false,
  blocked      BOOLEAN DEFAULT false,
  risk_score   INTEGER DEFAULT 0,
  risk_signals TEXT[],
  status       TEXT DEFAULT 'active',
  card_network TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.alerts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type           TEXT NOT NULL,  -- 'critical' | 'warning' | 'info'
  message        TEXT NOT NULL,
  ai_explanation TEXT,
  read           BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL,  -- 'user' | 'assistant'
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.statement_uploads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name  TEXT NOT NULL,
  file_url   TEXT,
  file_type  TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.widget_feedback (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_id  TEXT NOT NULL,
  helpful    BOOLEAN,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, widget_id)
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────

ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statement_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_feedback ENABLE ROW LEVEL SECURITY;

-- merchants
CREATE POLICY "merchants_select" ON public.merchants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "merchants_insert" ON public.merchants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "merchants_update" ON public.merchants FOR UPDATE USING (auth.uid() = user_id);

-- transactions (users see their own merchant's transactions)
CREATE POLICY "transactions_select" ON public.transactions FOR SELECT USING (
  merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid())
);
CREATE POLICY "transactions_insert" ON public.transactions FOR INSERT WITH CHECK (
  merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid())
);
CREATE POLICY "transactions_update" ON public.transactions FOR UPDATE USING (
  merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid())
);

-- alerts
CREATE POLICY "alerts_select" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "alerts_insert" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alerts_update" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

-- Service role bypass for alerts (for server-side alert generation)
CREATE POLICY "alerts_service_insert" ON public.alerts FOR INSERT TO service_role WITH CHECK (true);

-- chat_history
CREATE POLICY "chat_select" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chat_insert" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- statement_uploads
CREATE POLICY "uploads_select" ON public.statement_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "uploads_insert" ON public.statement_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- widget_feedback
CREATE POLICY "feedback_all" ON public.widget_feedback FOR ALL USING (auth.uid() = user_id);

-- ─── AUTO-CREATE MERCHANT ON SIGNUP TRIGGER ──────────────────────────────────
-- This creates a merchant record automatically when a user signs up,
-- even before email confirmation, bypassing RLS issues.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.merchants (user_id, business_name, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Business'),
    'onboarding'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('statements', 'statements', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "statements_upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
CREATE POLICY "statements_select" ON storage.objects FOR SELECT USING (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
