/*
  # Complete Authentication and Chat System Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `is_anonymous` (boolean)
      - `role` (text with check constraint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `title` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references chat_sessions)
      - `user_id` (uuid, references user_profiles)
      - `message` (text)
      - `is_user` (boolean)
      - `trigger_words` (text array)
      - `is_emergency` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for anonymous users where appropriate

  3. Functions
    - Trigger to create user profile on signup
    - Function to handle anonymous user creation
    - Function to update updated_at timestamp

  4. Indexes
    - Performance indexes for common queries
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  is_anonymous boolean DEFAULT false,
  role text DEFAULT 'victim' CHECK (role IN ('victim', 'ngo', 'emergency')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'New Chat Session',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_user boolean NOT NULL,
  trigger_words text[] DEFAULT '{}',
  is_emergency boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for chat_sessions
CREATE POLICY "Users can read own chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions"
  ON chat_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for chat_messages
CREATE POLICY "Users can read own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, is_anonymous)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'is_anonymous')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_emergency ON chat_messages(is_emergency);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_anonymous ON user_profiles(is_anonymous);