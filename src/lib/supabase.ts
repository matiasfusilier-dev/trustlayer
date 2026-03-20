import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://llrdjgcswlllxvwemalp.supabase.co'
const supabaseAnonKey = 'sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)