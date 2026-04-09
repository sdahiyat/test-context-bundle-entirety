-- Self-contained migration: creates the foods table if it doesn't exist,
-- then seeds it with ~50 common foods. Safe to run after or before the
-- initial schema migration (ON CONFLICT DO NOTHING makes it idempotent).

CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  serving_size NUMERIC NOT NULL,
  serving_unit TEXT NOT NULL,
  calories_per_serving NUMERIC NOT NULL,
  protein_per_serving NUMERIC NOT NULL,
  carbs_per_serving NUMERIC NOT NULL,
  fat_per_serving NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'protein', 'dairy', 'grain', 'fruit', 'vegetable',
    'nut', 'fat', 'legume', 'snack', 'beverage'
  )),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

INSERT INTO foods (name, serving_size, serving_unit, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, category)
VALUES
  -- Proteins
  ('Chicken Breast',     100,  'g',     165,  31.0,  0.0,  3.6,  'protein'),
  ('Salmon',             100,  'g',     208,  20.0,  0.0,  13.0, 'protein'),
  ('Eggs',               50,   'g',     70,   6.0,   0.5,  5.0,  'protein'),
  ('Tuna Canned',        100,  'g',     116,  26.0,  0.0,  0.8,  'protein'),
  ('Turkey Breast',      100,  'g',     135,  30.0,  0.0,  1.0,  'protein'),
  ('Ground Beef 80/20',  100,  'g',     254,  17.0,  0.0,  20.0, 'protein'),
  ('Tilapia',            100,  'g',     96,   20.1,  0.0,  1.7,  'protein'),
  ('Shrimp',             100,  'g',     99,   24.0,  0.2,  0.3,  'protein'),
  ('Pork Tenderloin',    100,  'g',     143,  26.0,  0.0,  3.5,  'protein'),
  ('Tofu Firm',          100,  'g',     76,   8.0,   1.9,  4.8,  'protein'),

  -- Dairy
  ('Greek Yogurt',       100,  'g',     59,   10.0,  3.6,  0.4,  'dairy'),
  ('Whole Milk',         240,  'ml',    149,  8.0,   12.0, 8.0,  'dairy'),
  ('Cheddar Cheese',     28,   'g',     113,  7.0,   0.4,  9.0,  'dairy'),
  ('Cottage Cheese',     100,  'g',     98,   11.0,  3.4,  4.3,  'dairy'),
  ('Mozzarella',         28,   'g',     85,   6.0,   1.0,  6.0,  'dairy'),
  ('Skim Milk',          240,  'ml',    83,   8.0,   12.0, 0.2,  'dairy'),
  ('Butter',             14,   'g',     102,  0.1,   0.0,  11.5, 'dairy'),
  ('Plain Yogurt',       100,  'g',     61,   3.5,   4.7,  3.3,  'dairy'),

  -- Grains
  ('Brown Rice',         100,  'g',     112,  2.6,   24.0, 0.9,  'grain'),
  ('White Rice',         100,  'g',     130,  2.7,   28.0, 0.3,  'grain'),
  ('Oatmeal',            100,  'g',     71,   2.5,   12.0, 1.5,  'grain'),
  ('Whole Wheat Bread',  30,   'slice', 81,   4.0,   14.0, 1.0,  'grain'),
  ('Quinoa',             100,  'g',     120,  4.4,   22.0, 1.9,  'grain'),
  ('Whole Wheat Pasta',  100,  'g',     124,  5.0,   26.0, 0.5,  'grain'),
  ('White Pasta',        100,  'g',     131,  5.0,   25.0, 1.1,  'grain'),
  ('Tortilla Flour',     45,   'g',     146,  4.0,   25.0, 3.5,  'grain'),
  ('Bagel',              105,  'g',     270,  11.0,  53.0, 1.5,  'grain'),
  ('Granola',            45,   'g',     200,  4.0,   33.0, 6.0,  'grain'),

  -- Fruits
  ('Banana',             118,  'g',     105,  1.3,   27.0, 0.4,  'fruit'),
  ('Apple',              182,  'g',     95,   0.5,   25.0, 0.3,  'fruit'),
  ('Blueberries',        100,  'g',     57,   0.7,   14.0, 0.3,  'fruit'),
  ('Strawberries',       100,  'g',     32,   0.7,   8.0,  0.3,  'fruit'),
  ('Orange',             131,  'g',     62,   1.2,   15.0, 0.2,  'fruit'),
  ('Mango',              100,  'g',     60,   0.8,   15.0, 0.4,  'fruit'),
  ('Grapes',             100,  'g',     69,   0.6,   18.0, 0.2,  'fruit'),
  ('Watermelon',         100,  'g',     30,   0.6,   8.0,  0.2,  'fruit'),

  -- Vegetables
  ('Broccoli',           100,  'g',     34,   2.8,   7.0,  0.4,  'vegetable'),
  ('Spinach',            100,  'g',     23,   2.9,   3.6,  0.4,  'vegetable'),
  ('Sweet Potato',       100,  'g',     86,   1.6,   20.0, 0.1,  'vegetable'),
  ('Avocado',            100,  'g',     160,  2.0,   9.0,  15.0, 'vegetable'),
  ('Carrots',            100,  'g',     41,   0.9,   10.0, 0.2,  'vegetable'),
  ('Kale',               100,  'g',     49,   4.3,   9.0,  0.9,  'vegetable'),
  ('Bell Pepper',        100,  'g',     31,   1.0,   6.0,  0.3,  'vegetable'),

  -- Nuts & Seeds
  ('Almonds',            28,   'g',     164,  6.0,   6.0,  14.0, 'nut'),
  ('Peanut Butter',      32,   'tbsp',  188,  8.0,   6.0,  16.0, 'nut'),
  ('Walnuts',            28,   'g',     185,  4.3,   3.9,  18.5, 'nut'),
  ('Chia Seeds',         28,   'g',     138,  4.7,   12.0, 8.7,  'nut'),
  ('Sunflower Seeds',    28,   'g',     164,  5.5,   6.5,  14.0, 'nut'),

  -- Legumes
  ('Lentils',            100,  'g',     116,  9.0,   20.0, 0.4,  'legume'),
  ('Black Beans',        100,  'g',     132,  8.9,   24.0, 0.5,  'legume'),
  ('Chickpeas',          100,  'g',     164,  8.9,   27.0, 2.6,  'legume'),
  ('Edamame',            100,  'g',     122,  11.0,  10.0, 5.2,  'legume'),

  -- Fats & Oils
  ('Olive Oil',          14,   'g',     119,  0.0,   0.0,  14.0, 'fat'),
  ('Coconut Oil',        14,   'g',     121,  0.0,   0.0,  13.5, 'fat'),

  -- Snacks
  ('Protein Bar',        60,   'g',     230,  20.0,  25.0, 7.0,  'snack'),
  ('Rice Cakes',         18,   'g',     70,   1.5,   15.0, 0.5,  'snack'),
  ('Dark Chocolate',     28,   'g',     170,  2.0,   13.0, 12.0, 'snack'),
  ('Popcorn Air-Popped', 28,   'g',     110,  3.6,   22.0, 1.3,  'snack'),
  ('Mixed Nuts',         28,   'g',     173,  5.0,   6.0,  15.0, 'snack'),

  -- Beverages
  ('Orange Juice',       240,  'ml',    112,  1.7,   26.0, 0.5,  'beverage'),
  ('Whole Milk Latte',   240,  'ml',    150,  8.0,   15.0, 6.0,  'beverage'),
  ('Green Tea',          240,  'ml',    2,    0.0,   0.0,  0.0,  'beverage'),
  ('Whey Protein Shake', 240,  'ml',    120,  24.0,  3.0,  2.0,  'beverage'),
  ('Coconut Water',      240,  'ml',    46,   1.7,   9.0,  0.5,  'beverage')

ON CONFLICT (name) DO NOTHING;
