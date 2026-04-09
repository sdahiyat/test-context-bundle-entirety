-- ============================================================
-- NutriTrack Initial Schema Migration
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')) DEFAULT 'sedentary',
  goal_type TEXT CHECK (goal_type IN ('weight_loss', 'maintenance', 'muscle_gain')) DEFAULT 'maintenance',
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_protein_goal_g NUMERIC(6,2) DEFAULT 150,
  daily_carbs_goal_g NUMERIC(6,2) DEFAULT 250,
  daily_fat_goal_g NUMERIC(6,2) DEFAULT 65,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. FOODS TABLE
-- ============================================================
CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT UNIQUE,
  serving_size_g NUMERIC(8,2) NOT NULL DEFAULT 100,
  serving_description TEXT DEFAULT '100g',
  calories_per_serving NUMERIC(8,2) NOT NULL,
  protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fiber_g NUMERIC(8,2) DEFAULT 0,
  sugar_g NUMERIC(8,2) DEFAULT 0,
  sodium_mg NUMERIC(8,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. MEALS TABLE
-- ============================================================
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name TEXT,
  photo_url TEXT,
  ai_analysis JSONB,
  notes TEXT,
  total_calories NUMERIC(8,2) DEFAULT 0,
  total_protein_g NUMERIC(8,2) DEFAULT 0,
  total_carbs_g NUMERIC(8,2) DEFAULT 0,
  total_fat_g NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. MEAL_ITEMS TABLE
-- ============================================================
CREATE TABLE public.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  custom_food_name TEXT,
  quantity_g NUMERIC(8,2) NOT NULL,
  serving_multiplier NUMERIC(6,3) DEFAULT 1.0,
  calories NUMERIC(8,2) NOT NULL,
  protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fiber_g NUMERIC(8,2) DEFAULT 0,
  sugar_g NUMERIC(8,2) DEFAULT 0,
  sodium_mg NUMERIC(8,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. PROGRESS_LOGS TABLE
-- ============================================================
CREATE TABLE public.progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, logged_date)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_meals_user_date ON public.meals(user_id, logged_date);
CREATE INDEX idx_meal_items_meal_id ON public.meal_items(meal_id);
CREATE INDEX idx_progress_logs_user_date ON public.progress_logs(user_id, logged_date);
CREATE INDEX idx_foods_name ON public.foods USING gin(to_tsvector('english', name));
CREATE INDEX idx_foods_barcode ON public.foods(barcode) WHERE barcode IS NOT NULL;

-- ============================================================
-- TRIGGER FUNCTIONS
-- ============================================================

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to profiles, foods, meals
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_foods_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update meal totals when meal_items change
CREATE OR REPLACE FUNCTION public.update_meal_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_meal_id UUID;
BEGIN
  -- Determine which meal_id to update
  IF TG_OP = 'DELETE' THEN
    v_meal_id := OLD.meal_id;
  ELSE
    v_meal_id := NEW.meal_id;
  END IF;

  -- Recalculate and update the parent meal totals
  UPDATE public.meals
  SET
    total_calories  = COALESCE((SELECT SUM(calories)   FROM public.meal_items WHERE meal_id = v_meal_id), 0),
    total_protein_g = COALESCE((SELECT SUM(protein_g)  FROM public.meal_items WHERE meal_id = v_meal_id), 0),
    total_carbs_g   = COALESCE((SELECT SUM(carbs_g)    FROM public.meal_items WHERE meal_id = v_meal_id), 0),
    total_fat_g     = COALESCE((SELECT SUM(fat_g)      FROM public.meal_items WHERE meal_id = v_meal_id), 0),
    updated_at      = NOW()
  WHERE id = v_meal_id;

  RETURN NULL;
END;
$$;

CREATE TRIGGER on_meal_items_change
  AFTER INSERT OR UPDATE OR DELETE ON public.meal_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_meal_totals();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- FOODS POLICIES
-- ============================================================

-- Anyone (including anon) can read verified foods or their own custom foods
CREATE POLICY "foods_select_all"
  ON public.foods
  FOR SELECT
  USING (is_verified = TRUE OR created_by = auth.uid());

-- Authenticated users can insert new foods
CREATE POLICY "foods_insert_authenticated"
  ON public.foods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Users can only update their own unverified/custom foods
CREATE POLICY "foods_update_own"
  ON public.foods
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Users can only delete their own custom foods
CREATE POLICY "foods_delete_own"
  ON public.foods
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- ============================================================
-- MEALS POLICIES
-- ============================================================
CREATE POLICY "meals_select_own"
  ON public.meals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "meals_insert_own"
  ON public.meals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "meals_update_own"
  ON public.meals
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "meals_delete_own"
  ON public.meals
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- MEAL_ITEMS POLICIES
-- ============================================================
CREATE POLICY "meal_items_select_own"
  ON public.meal_items
  FOR SELECT
  TO authenticated
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_insert_own"
  ON public.meal_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_update_own"
  ON public.meal_items
  FOR UPDATE
  TO authenticated
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "meal_items_delete_own"
  ON public.meal_items
  FOR DELETE
  TO authenticated
  USING (
    meal_id IN (
      SELECT id FROM public.meals WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- PROGRESS_LOGS POLICIES
-- ============================================================
CREATE POLICY "progress_logs_select_own"
  ON public.progress_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "progress_logs_insert_own"
  ON public.progress_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_logs_update_own"
  ON public.progress_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_logs_delete_own"
  ON public.progress_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
