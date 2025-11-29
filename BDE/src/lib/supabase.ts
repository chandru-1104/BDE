import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id: string;
  company_name: string;
  contact_person: string;
  email?: string;
  phone?: string;
  industry: string;
  lead_source: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'won' | 'lost';
  estimated_value: number;
  probability: number;
  expected_close_date?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  lead_id?: string;
  activity_type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal';
  title: string;
  description?: string;
  scheduled_at: string;
  completed: boolean;
  created_by: string;
  created_at: string;
}

export interface Target {
  id: string;
  user_id: string;
  month: string;
  revenue_target: number;
  leads_target: number;
  meetings_target: number;
  created_at: string;
}
