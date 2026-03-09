// export const initialUsers = [
//   { email: 'admin@qmedix.com', password: 'password123', role: 'admin', name: 'System Admin' }
// ];

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
