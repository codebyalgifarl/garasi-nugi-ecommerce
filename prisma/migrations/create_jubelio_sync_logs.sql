CREATE TABLE IF NOT EXISTS public.jubelio_sync_logs (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type    VARCHAR(50)  NOT NULL,
  status       VARCHAR(20)  NOT NULL,
  reference_id VARCHAR(150),
  message      TEXT,
  raw_payload  JSONB,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
