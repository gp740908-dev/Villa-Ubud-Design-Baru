import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in environments where import.meta.env might be undefined
const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || fallback;
    }
  } catch (e) {
    // ignore errors
  }
  return fallback;
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL', "https://rxeoufnyjohjsmvszzcs.supabase.co");
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZW91Zm55am9oanNtdnN6emNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjcyODAsImV4cCI6MjA4Mzg0MzI4MH0.Vn9u2WHPbIRpWxDUdEkICfecwSKWXglxAIqk1_weB7I");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or Key is missing.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);