/*
  # Add Sample Dishes with Correct IDs

  Adds dishes to restaurants using the correct IDs from the database.
*/

-- Add dishes for Gurus Kitchen (3b0121b9-24b8-4c11-9113-d533ba1e5584)
INSERT INTO dishes (restaurant_id, name, description, price, category, is_available)
VALUES
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Butter Chicken', 'Tender chicken in creamy tomato butter sauce', 13.99, 'Curries', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Paneer Tikka Masala', 'Cottage cheese in aromatic tomato gravy', 12.99, 'Curries', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Lamb Rogan Josh', 'Tender lamb in spiced tomato sauce', 14.99, 'Curries', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Dal Makhani', 'Black lentils in creamy sauce', 9.99, 'Curries', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Tandoori Chicken', 'Marinated and grilled chicken', 11.99, 'Tandoori', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Naan Bread', 'Traditional Indian bread', 2.99, 'Breads', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Biryani Rice', 'Fragrant basmati rice with spices', 10.99, 'Rice', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Samosa', 'Crispy pastry with potato filling', 4.99, 'Appetizers', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Raita', 'Yogurt with cucumber and herbs', 2.99, 'Sides', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Gulab Jamun', 'Sweet milk dumplings in syrup', 4.99, 'Desserts', true),
  ('3b0121b9-24b8-4c11-9113-d533ba1e5584', 'Mango Lassi', 'Traditional yogurt-based drink', 3.99, 'Drinks', true);

-- Add dishes for Pizza Palace (6bc1c5da-6117-462d-9f02-29794ffd58a0)
INSERT INTO dishes (restaurant_id, name, description, price, category, is_available)
VALUES
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Margherita Pizza', 'Tomato sauce, mozzarella, basil', 12.99, 'Pizza', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Pepperoni Pizza', 'Tomato sauce, mozzarella, pepperoni', 14.99, 'Pizza', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Veggie Supreme', 'Bell peppers, mushrooms, olives, onions', 13.99, 'Pizza', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Meat Lovers', 'Pepperoni, sausage, bacon, ham', 16.99, 'Pizza', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Spaghetti Carbonara', 'Pasta with bacon, egg, parmesan', 13.99, 'Pasta', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Penne Arrabbiata', 'Spicy tomato sauce with garlic', 12.99, 'Pasta', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Fettuccine Alfredo', 'Creamy parmesan sauce', 14.99, 'Pasta', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Caesar Salad', 'Romaine, croutons, parmesan, caesar dressing', 8.99, 'Salads', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Caprese Salad', 'Mozzarella, tomatoes, basil', 9.99, 'Salads', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Tiramisu', 'Coffee-flavored Italian dessert', 6.99, 'Desserts', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Panna Cotta', 'Creamy Italian custard', 5.99, 'Desserts', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'Coca Cola', 'Classic soft drink', 2.99, 'Drinks', true),
  ('6bc1c5da-6117-462d-9f02-29794ffd58a0', 'San Pellegrino', 'Sparkling water', 3.99, 'Drinks', true);