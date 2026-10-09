/*
  # Safety Plan Persistence

  1. New Tables
    - `safety_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles, unique - one plan per user)
      - `emergency_contacts` (jsonb array of { name, phone, relationship })
      - `safe_locations` (text array)
      - `important_documents` (text array)
      - `escape_routes` (text array)
      - `warning_signals` (text array)
      - `personal_items` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on safety_plans
    - Add policies for authenticated users to create/read/update/delete only
      their own plan (auth.uid() = user_id)

  3. Functions / Triggers
    - Reuse existing update_updated_at_column() for the updated_at timestamp

  4. Indexes
    - Unique constraint on user_id (enforces one plan per user and enables upsert)
*/

-- Create safety_plans table
CREATE TABLE IF NOT EXISTS safety_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  emergency_contacts jsonb DEFAULT '[]'::jsonb,
  safe_locations text[] DEFAULT '{}',
  important_documents text[] DEFAULT '{}',
  escape_routes text[] DEFAULT '{}',
  warning_signals text[] DEFAULT '{}',
  personal_items text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE safety_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for safety_plans
CREATE POLICY "Users can read own safety plan"
  ON safety_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own safety plan"
  ON safety_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own safety plan"
  ON safety_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own safety plan"
  ON safety_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reuse existing update_updated_at_column() trigger function
CREATE TRIGGER update_safety_plans_updated_at
  BEFORE UPDATE ON safety_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
