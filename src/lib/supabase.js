import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* ── snake_case ↔ camelCase helpers ────────────────────────── */
function snakeToCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}
function camelToSnake(s) {
  return s.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
}

export function mapRow(obj) {
  if (!obj) return null
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [snakeToCamel(k), v])
  )
}
export function mapRows(arr) {
  return (arr || []).map(mapRow)
}
export function toDb(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [camelToSnake(k), v])
  )
}
