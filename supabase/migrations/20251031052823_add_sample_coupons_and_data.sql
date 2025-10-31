/*
  # Add Sample Coupons and Test Data

  Creates discount coupons for testing the ordering system.
*/

-- Add discount coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, valid_until, is_active)
VALUES
  ('SAVE20', 'percentage', 20, 15.00, 10.00, '2025-12-31 23:59:59', true),
  ('FIRST5', 'fixed', 5.00, 10.00, 5.00, '2025-12-31 23:59:59', true),
  ('WELCOME10', 'percentage', 10, 0.00, 5.00, '2025-12-31 23:59:59', true),
  ('BIG10', 'fixed', 10.00, 30.00, 10.00, '2025-12-31 23:59:59', true);