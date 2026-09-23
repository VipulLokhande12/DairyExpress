-- ─── DairyXpress Seed Data ─────────────────────────────────────
-- Idempotent: uses INSERT IGNORE so it only seeds on first run.
-- Passwords are BCrypt-hashed ("password123") — generated for demo use.

-- Admin user
INSERT IGNORE INTO users (id, email, password, name, phone, role, reward_points, created_at)
VALUES (1, 'admin@dairyxpress.farm', '$2a$10$yDMEIasjMcaUlbf1NG4rMen1oHSv61pvYdhy5wVHsl1SsWRWEfyTK', 'Admin', '18001234567', 'ADMIN', 0, NOW());

-- Demo customer
INSERT IGNORE INTO users (id, email, password, name, phone, role, reward_points, created_at)
VALUES (2, 'guest@dairyxpress.farm', '$2a$10$yDMEIasjMcaUlbf1NG4rMen1oHSv61pvYdhy5wVHsl1SsWRWEfyTK', 'Guest', '9876543210', 'CUSTOMER', 1240, NOW());

-- ─── Categories ───
INSERT IGNORE INTO categories (id, slug, name, icon, image, blurb) VALUES
(1, 'milk',    'Fresh Milk',       'Milk',          'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=800', 'A2, cow, skim & more'),
(2, 'paneer',  'Paneer',           'Cheese',         'https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hand-pressed, soft & fresh'),
(3, 'cheese',  'Cheese',           'Slice',          'https://images.pexels.com/photos/7368035/pexels-photo-7368035.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cheddar, mozzarella, feta'),
(4, 'butter',  'Butter & Cream',   'Sandwich',       'https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg?auto=compress&cs=tinysrgb&w=800', 'White butter, cultured cream'),
(5, 'ghee',    'Ghee',             'Droplet',        'https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg?auto=compress&cs=tinysrgb&w=800', 'Bilona method, golden pure'),
(6, 'yogurt',  'Curd & Yogurt',    'IceCreamCone',   'https://images.pexels.com/photos/10809146/pexels-photo-10809146.jpeg?auto=compress&cs=tinysrgb&w=800', 'Greek, set, flavored curd');

-- ─── Products ───
INSERT IGNORE INTO products (id, slug, name, category_id, price, old_price, image, gallery, rating, reviews, stock, delivery_mins, organic, badge, description, ingredients, benefits, nutrition, unit) VALUES
(1, 'a2-desi-cow-milk-1l', 'A2 Desi Cow Milk', 1, 89.00, 110.00,
  'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/244579/pexels-photo-244579.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.9, 1284, 42, 30, true, 'Bestseller',
  'Pure A2 milk from free-grazing Gir cows, untouched and unprocessed. Delivered in reusable glass bottles within hours of milking.',
  '["100% A2 cow milk"]',
  '["A2 beta-casein protein","Easier to digest","No A1 protein","Rich in omega-3"]',
  '[{"label":"Energy","value":"61 kcal"},{"label":"Protein","value":"3.4 g"},{"label":"Fat","value":"3.3 g"},{"label":"Calcium","value":"120 mg"}]',
  '1 L bottle'),

(2, 'fresh-paneer-200g', 'Fresh Hand-Pressed Paneer', 2, 119.00, 149.00,
  'https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/7368028/pexels-photo-7368028.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.8, 942, 28, 30, true, 'Organic',
  'Soft, creamy paneer pressed by hand from full-cream A2 milk. No preservatives, no starch — just milk and a touch of lemon.',
  '["Cow milk","Citric acid (lemon)"]',
  '["18% protein","No preservatives","Melts in mouth","Farm-made daily"]',
  '[{"label":"Energy","value":"265 kcal"},{"label":"Protein","value":"18 g"},{"label":"Fat","value":"20 g"},{"label":"Calcium","value":"208 mg"}]',
  '200 g pack'),

(3, 'farmhouse-cheddar-150g', 'Aged Farmhouse Cheddar', 3, 249.00, 299.00,
  'https://images.pexels.com/photos/7368035/pexels-photo-7368035.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/7368035/pexels-photo-7368035.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/7368022/pexels-photo-7368022.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.7, 514, 15, 45, false, 'New',
  'Naturally aged 60 days in our cellar. Sharp, nutty and crumbly with a golden rind. Perfect for boards and grating.',
  '["Cow milk","Rennet","Salt","Cultures"]',
  '["Aged 60 days","No additives","Rich sharp flavor","Grate or slice"]',
  '[{"label":"Energy","value":"402 kcal"},{"label":"Protein","value":"25 g"},{"label":"Fat","value":"33 g"},{"label":"Calcium","value":"721 mg"}]',
  '150 g block'),

(4, 'white-butter-250g', 'Cultured White Butter', 4, 159.00, 189.00,
  'https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.6, 388, 33, 30, true, null,
  'Churned from cultured cream for a tangy, aromatic butter. Unsalted — the way grandma made it.',
  '["Cultured cream"]',
  '["Naturally cultured","No added salt","Rich aroma","Spreadable"]',
  '[{"label":"Energy","value":"717 kcal"},{"label":"Protein","value":"0.9 g"},{"label":"Fat","value":"81 g"},{"label":"Calcium","value":"24 mg"}]',
  '250 g tub'),

(5, 'bilona-ghee-500ml', 'Bilona Method Ghee', 5, 649.00, 799.00,
  'https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.9, 2106, 19, 30, true, 'Bestseller',
  'Hand-churned bilona ghee from A2 cow milk. Slow-cooked to a golden, grainy texture with a rich aroma.',
  '["A2 cow milk butter"]',
  '["Bilona method","No preservatives","High smoke point","Rich in vitamins A, D, E, K"]',
  '[{"label":"Energy","value":"900 kcal"},{"label":"Protein","value":"0 g"},{"label":"Fat","value":"100 g"},{"label":"Calcium","value":"1 mg"}]',
  '500 ml jar'),

(6, 'greek-yogurt-400g', 'Strained Greek Yogurt', 6, 99.00, 129.00,
  'https://images.pexels.com/photos/10809146/pexels-photo-10809146.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/10809146/pexels-photo-10809146.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/4428345/pexels-photo-4428345.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.7, 731, 47, 30, true, null,
  'Thick, creamy Greek yogurt strained to remove whey. High protein, low sugar, live cultures.',
  '["Cow milk","Live cultures"]',
  '["10g protein per serving","Live probiotics","No added sugar","Strained thick"]',
  '[{"label":"Energy","value":"59 kcal"},{"label":"Protein","value":"10 g"},{"label":"Fat","value":"0.4 g"},{"label":"Calcium","value":"110 mg"}]',
  '400 g tub'),

(7, 'mozzarella-cheese-200g', 'Fresh Mozzarella', 3, 199.00, 239.00,
  'https://images.pexels.com/photos/7368022/pexels-photo-7368022.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/7368022/pexels-photo-7368022.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.5, 402, 22, 45, false, null,
  'Soft, milky mozzarella balls in brine. Melts beautifully on pizzas and caprese salads.',
  '["Cow milk","Rennet","Salt","Cultures"]',
  '["Fresh in brine","Perfect melt","Mild milky flavor","No starch"]',
  '[{"label":"Energy","value":"254 kcal"},{"label":"Protein","value":"18 g"},{"label":"Fat","value":"20 g"},{"label":"Calcium","value":"505 mg"}]',
  '200 g ball'),

(8, 'set-curd-1kg', 'Thick Set Curd', 6, 79.00, 95.00,
  'https://images.pexels.com/photos/4428345/pexels-photo-4428345.jpeg?auto=compress&cs=tinysrgb&w=800',
  '["https://images.pexels.com/photos/4428345/pexels-photo-4428345.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  4.6, 655, 51, 30, true, null,
  'Traditional set curd in an earthen pot. Firm, slightly tangy and perfectly set overnight.',
  '["Cow milk","Starter culture"]',
  '["Earthen pot set","Naturally probiotic","Firm texture","No additives"]',
  '[{"label":"Energy","value":"98 kcal"},{"label":"Protein","value":"4.3 g"},{"label":"Fat","value":"5 g"},{"label":"Calcium","value":"150 mg"}]',
  '1 kg pot');

-- Expanded catalogue (25 products total)
INSERT IGNORE INTO products (id, slug, name, category_id, price, old_price, image, gallery, rating, reviews, stock, delivery_mins, organic, badge, description, ingredients, benefits, nutrition, unit) VALUES
(9,'buffalo-milk-1l','Fresh Buffalo Milk',1,95,110,'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg','["https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg"]',4.7,186,35,30,true,'Popular','Rich full-cream buffalo milk delivered fresh.','["Buffalo milk"]','["High calcium","Full cream"]','[]','1 L bottle'),
(10,'toned-cow-milk-1l','Toned Cow Milk',1,62,70,'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg','["https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg"]',4.5,142,50,30,false,null,'Light everyday milk with balanced nutrition.','["Cow milk"]','["Everyday nutrition","Low fat"]','[]','1 L pouch'),
(11,'lactose-free-milk-1l','Lactose Free Milk',1,115,129,'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg','["https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg"]',4.6,98,24,30,false,'New','Easy-to-digest lactose-free dairy milk.','["Cow milk","Lactase enzyme"]','["Easy digestion"]','[]','1 L carton'),
(12,'malai-paneer-500g','Malai Paneer',2,269,299,'https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg','["https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg"]',4.8,211,22,30,true,'Bestseller','Extra-soft paneer made from full-cream milk.','["Cow milk"]','["Soft texture","High protein"]','[]','500 g pack'),
(13,'low-fat-paneer-200g','Low Fat Paneer',2,129,149,'https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg','["https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg"]',4.5,84,31,30,false,null,'Protein-rich paneer with reduced fat.','["Toned milk"]','["High protein","Reduced fat"]','[]','200 g pack'),
(14,'paneer-cubes-250g','Ready Paneer Cubes',2,149,169,'https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg','["https://images.pexels.com/photos/29631461/pexels-photo-29631461.jpeg"]',4.6,116,27,30,false,'Convenient','Fresh pre-cut paneer cubes ready to cook.','["Cow milk"]','["Ready to cook"]','[]','250 g pack'),
(15,'cheese-slices-200g','Classic Cheese Slices',3,179,205,'https://images.pexels.com/photos/7368035/pexels-photo-7368035.jpeg','["https://images.pexels.com/photos/7368035/pexels-photo-7368035.jpeg"]',4.4,132,38,30,false,null,'Creamy cheese slices for sandwiches and burgers.','["Milk","Cultures"]','["Easy melt"]','[]','200 g pack'),
(16,'pizza-mozzarella-500g','Pizza Mozzarella',3,349,399,'https://images.pexels.com/photos/7368022/pexels-photo-7368022.jpeg','["https://images.pexels.com/photos/7368022/pexels-photo-7368022.jpeg"]',4.8,267,20,45,false,'Popular','Stretchy mozzarella made for perfect pizzas.','["Cow milk"]','["Perfect stretch","Easy melt"]','[]','500 g block'),
(17,'feta-cheese-200g','Farmhouse Feta',3,289,329,'https://images.pexels.com/photos/7368035/pexels-photo-7368035.jpeg','["https://images.pexels.com/photos/7368035/pexels-photo-7368035.jpeg"]',4.5,73,16,45,false,'New','Tangy crumbly feta for salads and bowls.','["Cow milk","Salt","Cultures"]','["Naturally cultured"]','[]','200 g pack'),
(18,'salted-butter-500g','Salted Table Butter',4,279,310,'https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg','["https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg"]',4.7,190,40,30,false,null,'Creamy salted butter for everyday spreading.','["Cream","Salt"]','["Creamy","Spreadable"]','[]','500 g pack'),
(19,'unsalted-butter-200g','Unsalted Baking Butter',4,149,170,'https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg','["https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg"]',4.6,102,29,30,false,null,'Pure unsalted butter ideal for baking.','["Cream"]','["Baking ready"]','[]','200 g pack'),
(20,'fresh-cream-250ml','Fresh Dairy Cream',4,99,115,'https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg','["https://images.pexels.com/photos/8064204/pexels-photo-8064204.jpeg"]',4.5,88,34,30,false,null,'Smooth fresh cream for desserts and curries.','["Milk cream"]','["Rich texture"]','[]','250 ml pack'),
(21,'cow-ghee-1l','Pure Cow Ghee',5,899,999,'https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg','["https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg"]',4.9,354,18,30,true,'Bestseller','Aromatic pure cow ghee slow cooked traditionally.','["Cow milk butter"]','["Traditional recipe"]','[]','1 L jar'),
(22,'buffalo-ghee-500ml','Buffalo Milk Ghee',5,599,675,'https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg','["https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg"]',4.7,123,21,30,true,null,'Rich granular ghee made from buffalo milk.','["Buffalo milk butter"]','["Rich aroma"]','[]','500 ml jar'),
(23,'probiotic-curd-400g','Probiotic Curd',6,69,79,'https://images.pexels.com/photos/4428345/pexels-photo-4428345.jpeg','["https://images.pexels.com/photos/4428345/pexels-photo-4428345.jpeg"]',4.6,175,45,30,false,'Healthy','Creamy curd with active probiotic cultures.','["Cow milk","Cultures"]','["Active probiotics"]','[]','400 g cup'),
(24,'mango-yogurt-100g','Mango Yogurt',6,45,55,'https://images.pexels.com/photos/10809146/pexels-photo-10809146.jpeg','["https://images.pexels.com/photos/10809146/pexels-photo-10809146.jpeg"]',4.5,91,52,30,false,null,'Creamy yogurt blended with real mango.','["Milk","Mango","Cultures"]','["Real fruit"]','[]','100 g cup'),
(25,'blueberry-greek-yogurt-150g','Blueberry Greek Yogurt',6,79,89,'https://images.pexels.com/photos/10809146/pexels-photo-10809146.jpeg','["https://images.pexels.com/photos/10809146/pexels-photo-10809146.jpeg"]',4.7,128,37,30,false,'New','High-protein Greek yogurt with blueberry.','["Milk","Blueberry","Cultures"]','["High protein","Real fruit"]','[]','150 g cup');

-- Complete the 28-item catalogue (8 original products + 20 additions).
INSERT IGNORE INTO products (id, slug, name, category_id, price, old_price, image, gallery, rating, reviews, stock, delivery_mins, organic, badge, description, ingredients, benefits, nutrition, unit) VALUES
(26,'a2-cow-milk-500ml','A2 Cow Milk Mini',1,49,55,'/products/milk.png','["/products/milk.png"]',4.7,76,58,30,true,'New','A convenient half-litre bottle of fresh A2 cow milk.','["100% A2 cow milk"]','["A2 protein","Convenient size","Farm fresh"]','[]','500 ml bottle'),
(27,'smoked-cheddar-200g','Smoked Cheddar',3,329,369,'/products/cheese.png','["/products/cheese.png"]',4.8,64,14,45,false,'Artisan','Mature cheddar gently smoked for a deep, savoury finish.','["Cow milk","Rennet","Cultures","Salt"]','["Naturally smoked","Aged flavour","Excellent for cheese boards"]','[]','200 g block'),
(28,'mishti-doi-200g','Traditional Mishti Doi',6,75,85,'/products/yogurt.png','["/products/yogurt.png"]',4.8,109,32,30,false,'Traditional','Slow-set Bengali sweet yogurt with a delicate caramel note.','["Cow milk","Cane sugar","Cultures"]','["Traditional recipe","Slow set","No artificial colour"]','[]','200 g clay cup');

-- Keep product imagery local, stable, and visually consistent across API and fallback data.
UPDATE products SET image='/products/milk.png', gallery='["/products/milk.png"]' WHERE category_id=1;
UPDATE products SET image='/products/paneer.png', gallery='["/products/paneer.png"]' WHERE category_id=2;
UPDATE products SET image='/products/cheese.png', gallery='["/products/cheese.png"]' WHERE category_id=3;
UPDATE products SET image='/products/butter-cream.png', gallery='["/products/butter-cream.png"]' WHERE category_id=4;
UPDATE products SET image='/products/ghee.png', gallery='["/products/ghee.png"]' WHERE category_id=5;
UPDATE products SET image='/products/yogurt.png', gallery='["/products/yogurt.png"]' WHERE category_id=6;
