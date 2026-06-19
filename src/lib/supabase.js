import { createClient } from '@supabase/supabase-js'

// 클린 빌드에서도 동작하도록 fallback 하드코딩 (anon key는 공개 가능 키)
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://hcmgdztsgjvzcyxyayaj.supabase.co'

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU4ODcsImV4cCI6MjA4NzAxMTg4N30.gznaPzY1l8qDAPsEyYNR9KS7f7VqS3xaw-_2HTSwSZw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
