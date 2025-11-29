-- BDE Dashboard Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text,
  phone text,
  industry text NOT NULL DEFAULT '',
  lead_source text NOT NULL DEFAULT 'direct',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'negotiating', 'won', 'lost')),
  estimated_value numeric NOT NULL DEFAULT 0,
  probability integer NOT NULL DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  notes text DEFAULT '',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL DEFAULT 'call' CHECK (activity_type IN ('call', 'email', 'meeting', 'demo', 'proposal')),
  title text NOT NULL,
  description text DEFAULT '',
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  completed boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create targets table
CREATE TABLE IF NOT EXISTS targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  month text NOT NULL,
  revenue_target numeric NOT NULL DEFAULT 0,
  leads_target integer NOT NULL DEFAULT 0,
  meetings_target integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all leads" ON leads;
DROP POLICY IF EXISTS "Users can create leads" ON leads;
DROP POLICY IF EXISTS "Users can update their leads" ON leads;
DROP POLICY IF EXISTS "Users can delete their leads" ON leads;
DROP POLICY IF EXISTS "Users can view all activities" ON activities;
DROP POLICY IF EXISTS "Users can create activities" ON activities;
DROP POLICY IF EXISTS "Users can update their activities" ON activities;
DROP POLICY IF EXISTS "Users can delete their activities" ON activities;
DROP POLICY IF EXISTS "Users can view their targets" ON targets;
DROP POLICY IF EXISTS "Users can create their targets" ON targets;
DROP POLICY IF EXISTS "Users can update their targets" ON targets;
DROP POLICY IF EXISTS "Users can delete their targets" ON targets;

-- Leads policies
CREATE POLICY "Users can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their leads"
  ON leads FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Activities policies
CREATE POLICY "Users can view all activities"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their activities"
  ON activities FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Targets policies
CREATE POLICY "Users can view their targets"
  ON targets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their targets"
  ON targets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their targets"
  ON targets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their targets"
  ON targets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON leads(created_by);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by);
CREATE INDEX IF NOT EXISTS idx_targets_user_id ON targets(user_id);
