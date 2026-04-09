// Barrel export for @/lib/supabase
// Allows: import { supabase, createClient } from '@/lib/supabase'
//         import { Profile, Meal, ... }     from '@/lib/supabase'

export { createClient, supabase } from './client';
export { createClient as createServerClient } from './server';
export { updateSession } from './middleware';
export type {
  Database,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Food,
  FoodInsert,
  FoodUpdate,
  Meal,
  MealInsert,
  MealUpdate,
  MealItem,
  MealItemInsert,
  MealItemUpdate,
  ProgressLog,
  ProgressLogInsert,
  ProgressLogUpdate,
} from './types';
