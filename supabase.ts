import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Pon aquí tus valores o usa variables de entorno
const SUPABASE_URL = 'https://oztbgutxbxgkrcirrqfh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dGJndXR4Ynhna3JjaXJycWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDU3MTQsImV4cCI6MjA3NDc4MTcxNH0.w-v2_noilSo8pyvuHRFdoxqp_8bq3sEv8s9L5x2p-4o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
