-- Create users_profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  goal_type TEXT CHECK (goal_type IN ('weight_loss', 'maintenance', 'muscle_gain')),
  target_calories INTEGER,
  target_protein_g INTEGER,
  target_carbs_g INTEGER,
  target_fat_g INTEGER,
  activity_level TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Create foods table
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  brand TEXT,
  serving_size_g NUMERIC NOT NULL DEFAULT 100,
  calories_per_serving NUMERIC NOT NULL,
  protein_g NUMERIC NOT NULL DEFAULT 0,
  carbs_g NUMERIC NOT NULL DEFAULT 0,
  fat_g NUMERIC NOT NULL DEFAULT 0,
  fiber_g NUMERIC DEFAULT 0,
  sugar_g NUMERIC DEFAULT 0,
  sodium_mg NUMERIC DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id)
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  total_calories NUMERIC DEFAULT 0,
  total_protein_g NUMERIC DEFAULT 0,
  total_carbs_g NUMERIC DEFAULT 0,
  total_fat_g NUMERIC DEFAULT 0
);

-- Create meal_items table
CREATE TABLE IF NOT EXISTS meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id),
  quantity_g NUMERIC NOT NULL,
  calories NUMERIC NOT NULL,
  protein_g NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  fat_g NUMERIC NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;

-- users_profile policies
CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  USING (id = auth.uid());

-- foods policies (readable by all authenticated users)
CREATE POLICY "Authenticated users can read foods"
  ON foods FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own foods"
  ON foods FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own foods"
  ON foods FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- meals policies
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  USING (user_id = auth.uid());

-- meal_items policies (access via meal ownership)
CREATE POLICY "Users can view own meal items"
  ON meal_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own meal items"
  ON meal_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own meal items"
  ON meal_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own meal items"
  ON meal_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meals_user_logged ON meals(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal ON meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_foods_name_trgm ON foods USING GIN (to_tsvector('english', name));
