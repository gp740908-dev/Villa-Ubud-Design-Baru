import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rxeoufnyjohjsmvszzcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZW91Zm55am9oanNtdnN6emNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjcyODAsImV4cCI6MjA4Mzg0MzI4MH0.Vn9u2WHPbIRpWxDUdEkICfecwSKWXglxAIqk1_weB7I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
