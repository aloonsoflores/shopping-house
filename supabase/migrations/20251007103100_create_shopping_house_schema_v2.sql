/*
  # Shopping House Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `houses` - Household/groups for shared lists
    - `house_members` - Junction table for users in houses
    - `items` - Shopping list items
  
  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own data
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  language text DEFAULT 'es',
  notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Houses table
CREATE TABLE IF NOT EXISTS houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- House members table
CREATE TABLE IF NOT EXISTS house_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(house_id, user_id)
);

ALTER TABLE house_members ENABLE ROW LEVEL SECURITY;

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity integer DEFAULT 1,
  bought boolean DEFAULT false,
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  bought_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Houses policies
CREATE POLICY "Users can view houses they are members of"
  ON houses FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT house_id FROM house_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create houses"
  ON houses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "House members can update their houses"
  ON houses FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT house_id FROM house_members
      WHERE user_id = auth.uid()
    )
  );

-- House members policies
CREATE POLICY "Users can view members of their houses"
  ON house_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    house_id IN (
      SELECT house_id FROM house_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join houses"
  ON house_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave houses"
  ON house_members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Items policies
CREATE POLICY "House members can view items"
  ON items FOR SELECT
  TO authenticated
  USING (
    house_id IN (
      SELECT house_id FROM house_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "House members can add items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (
    house_id IN (
      SELECT house_id FROM house_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "House members can update items"
  ON items FOR UPDATE
  TO authenticated
  USING (
    house_id IN (
      SELECT house_id FROM house_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "House members can delete items"
  ON items FOR DELETE
  TO authenticated
  USING (
    house_id IN (
      SELECT house_id FROM house_members
      WHERE user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_house_members_house_id ON house_members(house_id);
CREATE INDEX IF NOT EXISTS idx_house_members_user_id ON house_members(user_id);
CREATE INDEX IF NOT EXISTS idx_items_house_id ON items(house_id);
CREATE INDEX IF NOT EXISTS idx_items_bought ON items(bought);
