-- Seed common foods with nutritional data per 100g
INSERT INTO foods (name, brand, serving_size_g, calories_per_serving, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, is_verified)
VALUES
  -- Breakfast items
  ('Oatmeal (cooked)', NULL, 100, 71, 2.5, 12.0, 1.5, 1.7, 0.3, 49, TRUE),
  ('Egg (whole, large)', NULL, 100, 155, 13.0, 1.1, 11.0, 0.0, 1.1, 124, TRUE),
  ('Bacon (cooked)', NULL, 100, 541, 37.0, 1.4, 42.0, 0.0, 0.0, 1717, TRUE),
  ('White Toast Bread', NULL, 100, 265, 9.0, 49.0, 3.2, 2.7, 5.0, 491, TRUE),
  ('Whole Wheat Bread', NULL, 100, 247, 13.0, 41.0, 4.2, 6.0, 5.0, 400, TRUE),
  ('Greek Yogurt (plain)', NULL, 100, 59, 10.0, 3.6, 0.4, 0.0, 3.2, 36, TRUE),
  ('Banana', NULL, 100, 89, 1.1, 23.0, 0.3, 2.6, 12.0, 1, TRUE),
  ('Orange Juice', NULL, 100, 45, 0.7, 10.4, 0.2, 0.2, 8.4, 1, TRUE),
  ('Whole Milk', NULL, 100, 61, 3.2, 4.8, 3.3, 0.0, 5.0, 44, TRUE),
  ('Granola', NULL, 100, 471, 10.0, 64.0, 20.0, 5.0, 24.0, 32, TRUE),
  ('Avocado', NULL, 100, 160, 2.0, 9.0, 15.0, 7.0, 0.7, 7, TRUE),
  ('Blueberries', NULL, 100, 57, 0.7, 14.5, 0.3, 2.4, 10.0, 1, TRUE),
  ('Strawberries', NULL, 100, 32, 0.7, 7.7, 0.3, 2.0, 4.9, 1, TRUE),
  ('Skim Milk', NULL, 100, 34, 3.4, 5.0, 0.1, 0.0, 5.0, 42, TRUE),
  ('Butter', NULL, 100, 717, 0.9, 0.1, 81.0, 0.0, 0.1, 11, TRUE),

  -- Lunch items
  ('Chicken Breast (cooked)', NULL, 100, 165, 31.0, 0.0, 3.6, 0.0, 0.0, 74, TRUE),
  ('Tuna (canned in water)', NULL, 100, 116, 26.0, 0.0, 1.0, 0.0, 0.0, 347, TRUE),
  ('Brown Rice (cooked)', NULL, 100, 112, 2.6, 23.5, 0.9, 1.8, 0.0, 5, TRUE),
  ('White Rice (cooked)', NULL, 100, 130, 2.7, 28.2, 0.3, 0.4, 0.0, 1, TRUE),
  ('Pasta (cooked)', NULL, 100, 158, 5.8, 31.0, 0.9, 1.8, 0.6, 1, TRUE),
  ('Romaine Lettuce', NULL, 100, 17, 1.2, 3.3, 0.3, 2.1, 1.2, 8, TRUE),
  ('Tomato', NULL, 100, 18, 0.9, 3.9, 0.2, 1.2, 2.6, 5, TRUE),
  ('Cheddar Cheese', NULL, 100, 403, 25.0, 1.3, 33.0, 0.0, 0.5, 621, TRUE),
  ('Salmon (cooked)', NULL, 100, 208, 20.0, 0.0, 13.0, 0.0, 0.0, 59, TRUE),
  ('Turkey Breast (cooked)', NULL, 100, 135, 30.0, 0.0, 1.0, 0.0, 0.0, 68, TRUE),
  ('Cucumber', NULL, 100, 15, 0.7, 3.6, 0.1, 0.5, 1.7, 2, TRUE),
  ('Bell Pepper', NULL, 100, 31, 1.0, 6.0, 0.3, 2.1, 4.2, 4, TRUE),
  ('Spinach (raw)', NULL, 100, 23, 2.9, 3.6, 0.4, 2.2, 0.4, 79, TRUE),

  -- Dinner items
  ('Beef Steak (cooked)', NULL, 100, 271, 26.0, 0.0, 18.0, 0.0, 0.0, 58, TRUE),
  ('Broccoli (cooked)', NULL, 100, 35, 2.4, 7.2, 0.4, 3.3, 1.7, 41, TRUE),
  ('Sweet Potato (baked)', NULL, 100, 90, 2.0, 20.7, 0.1, 3.3, 6.5, 36, TRUE),
  ('Olive Oil', NULL, 100, 884, 0.0, 0.0, 100.0, 0.0, 0.0, 2, TRUE),
  ('Lentils (cooked)', NULL, 100, 116, 9.0, 20.0, 0.4, 7.9, 1.8, 2, TRUE),
  ('Quinoa (cooked)', NULL, 100, 120, 4.4, 21.3, 1.9, 2.8, 0.9, 7, TRUE),
  ('Tofu (firm)', NULL, 100, 76, 8.0, 1.9, 4.8, 0.3, 0.5, 7, TRUE),
  ('Shrimp (cooked)', NULL, 100, 99, 24.0, 0.2, 0.3, 0.0, 0.0, 111, TRUE),
  ('Ground Beef 85% lean (cooked)', NULL, 100, 215, 26.0, 0.0, 12.0, 0.0, 0.0, 76, TRUE),
  ('Pork Tenderloin (cooked)', NULL, 100, 143, 26.0, 0.0, 3.5, 0.0, 0.0, 62, TRUE),
  ('Asparagus (cooked)', NULL, 100, 22, 2.4, 4.1, 0.2, 2.0, 1.3, 2, TRUE),
  ('Cauliflower (cooked)', NULL, 100, 23, 1.8, 4.1, 0.5, 2.0, 1.4, 15, TRUE),
  ('Zucchini (cooked)', NULL, 100, 17, 1.1, 3.5, 0.2, 1.0, 1.7, 3, TRUE),
  ('Black Beans (cooked)', NULL, 100, 132, 8.9, 23.7, 0.5, 8.7, 0.3, 1, TRUE),

  -- Snack items
  ('Almonds', NULL, 100, 579, 21.0, 22.0, 50.0, 12.5, 4.4, 1, TRUE),
  ('Apple', NULL, 100, 52, 0.3, 13.8, 0.2, 2.4, 10.4, 1, TRUE),
  ('Peanut Butter', NULL, 100, 588, 25.0, 20.0, 50.0, 6.0, 9.0, 459, TRUE),
  ('Cottage Cheese (low-fat)', NULL, 100, 72, 12.4, 4.3, 1.0, 0.0, 4.1, 321, TRUE),
  ('Carrots (raw)', NULL, 100, 41, 0.9, 9.6, 0.2, 2.8, 4.7, 69, TRUE),
  ('Hummus', NULL, 100, 166, 7.9, 14.3, 9.6, 6.0, 0.3, 379, TRUE),
  ('Walnuts', NULL, 100, 654, 15.0, 14.0, 65.0, 6.7, 2.6, 2, TRUE),
  ('Protein Bar (generic)', NULL, 100, 376, 30.0, 40.0, 10.0, 5.0, 15.0, 200, TRUE),
  ('Rice Cakes', NULL, 100, 387, 7.3, 81.0, 2.8, 1.6, 0.1, 3, TRUE),
  ('Dark Chocolate (70%)', NULL, 100, 598, 7.8, 46.0, 43.0, 10.9, 24.0, 20, TRUE),
  ('String Cheese', NULL, 100, 296, 21.4, 3.1, 22.5, 0.0, 1.2, 614, TRUE),
  ('Celery', NULL, 100, 16, 0.7, 3.0, 0.2, 1.6, 1.3, 80, TRUE)

ON CONFLICT (id) DO NOTHING;
