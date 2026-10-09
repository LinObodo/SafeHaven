/*
  # Harden safety_plans UPDATE policy

  The original UPDATE policy restricted which rows a user could update
  (USING auth.uid() = user_id) but had no WITH CHECK clause, so it did not
  constrain what the row could be changed to (e.g. reassigning user_id).

  This migration replaces the UPDATE policy to add the matching
  WITH CHECK (auth.uid() = user_id).
*/

DROP POLICY IF EXISTS "Users can update own safety plan" ON safety_plans;

CREATE POLICY "Users can update own safety plan"
  ON safety_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
