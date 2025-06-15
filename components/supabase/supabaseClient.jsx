// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xgeflbfcefzgemkumzzh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZWZsYmZjZWZ6Z2Vta3VtenpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODM4NTEsImV4cCI6MjA2MjU1OTg1MX0.G-x57ZDYfGLj8J8N_UQCglkETaxJqIWPZ_tAhCCzcSI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);