/*
  # Create Sample Restaurants

  Creates restaurant profiles for the signed-up restaurant owner accounts.
  This allows restaurant owners to see their dashboard when they log in.
*/

-- Create restaurant for gurus kitchen (e06ae356-9b4c-4633-a935-847bf2778c13)
INSERT INTO restaurants (owner_id, name, description, address, phone, cuisine_type, rating, is_active)
VALUES (
  'e06ae356-9b4c-4633-a935-847bf2778c13',
  'Gurus Kitchen',
  'Authentic Indian cuisine with traditional recipes',
  '123 Spice Road, Downtown',
  '+1-555-0001',
  'Indian',
  4.5,
  true
);

-- Create restaurant for example restaurant account (17780176-80f7-4b6a-9c98-b9c602850b7c)
INSERT INTO restaurants (owner_id, name, description, address, phone, cuisine_type, rating, is_active)
VALUES (
  '17780176-80f7-4b6a-9c98-b9c602850b7c',
  'Pizza Palace',
  'Authentic Italian pizzas and pastas',
  '456 Oak Avenue, Midtown',
  '+1-555-0002',
  'Italian',
  4.3,
  true
);