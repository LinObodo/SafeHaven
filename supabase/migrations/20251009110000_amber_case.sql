/*
  # NGO Case Management Foundation

  1. New Tables
    - `ngo_cases`
      - `id` (uuid, primary key)
      - `survivor_id` (uuid, references user_profiles, cascade delete)
      - `assigned_ngo` (uuid, references user_profiles, cascade delete)
      - `status` (text, CHECK: open | in_progress | resolved | closed)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - A case is visible/editable to EITHER the survivor OR the assigned NGO
      (auth.uid() = survivor_id OR auth.uid() = assigned_ngo)
    - WITH CHECK on insert/update so the acting user must be a party to the case

  3. Triggers
    - Reuse existing update_updated_at_column() for updated_at

  4. Indexes
    - Index on survivor_id and on assigned_ngo for per-party lookups
*/

CREATE TABLE IF NOT EXISTS ngo_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survivor_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_ngo uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ngo_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties can read own cases"
  ON ngo_cases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = survivor_id OR auth.uid() = assigned_ngo);

CREATE POLICY "Parties can create cases"
  ON ngo_cases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = survivor_id OR auth.uid() = assigned_ngo);

CREATE POLICY "Parties can update own cases"
  ON ngo_cases
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = survivor_id OR auth.uid() = assigned_ngo)
  WITH CHECK (auth.uid() = survivor_id OR auth.uid() = assigned_ngo);

CREATE POLICY "Parties can delete own cases"
  ON ngo_cases
  FOR DELETE
  TO authenticated
  USING (auth.uid() = survivor_id OR auth.uid() = assigned_ngo);

CREATE TRIGGER update_ngo_cases_updated_at
  BEFORE UPDATE ON ngo_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_ngo_cases_survivor_id ON ngo_cases(survivor_id);
CREATE INDEX IF NOT EXISTS idx_ngo_cases_assigned_ngo ON ngo_cases(assigned_ngo);
