import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in environments where import.meta.env might be undefined
const getEnv = (key: string, fallback: string) => {
  let value = fallback;
  
  try {
    // 1. Check Vite's import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      value = import.meta.env[key];
    }
  } catch (e) {
    // ignore
  }

  return value;
};

// Vercel/Vite usually requires VITE_ prefix for client-side variables
const SUPABASE_URL = getEnv('VITE_SUPABASE_URL', "https://rxeoufnyjohjsmvszzcs.supabase.co");
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZW91Zm55am9oanNtdnN6emNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjcyODAsImV4cCI6MjA4Mzg0MzI4MH0.Vn9u2WHPbIRpWxDUdEkICfecwSKWXglxAIqk1_weB7I");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('StayinUBUD: Supabase URL or Key is missing. Check your Vercel Environment Variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);