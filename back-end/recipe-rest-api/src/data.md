-- First, create the recipes
INSERT INTO recipe (id, name, description, image_path, category) VALUES
(1, 'Classic Pancakes', 'Fluffy pancakes with maple syrup', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445', 'BREAKFAST'),
(2, 'Avocado Toast', 'Creamy avocado on toasted sourdough', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d', 'BREAKFAST'),
(3, 'Eggs Benedict', 'Poached eggs with hollandaise sauce', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7', 'BREAKFAST'),
(4, 'Fruit Smoothie Bowl', 'Refreshing blend topped with granola', 'https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2', 'BREAKFAST'),
(5, 'Caesar Salad', 'Fresh salad with homemade dressing', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9', 'LUNCH'),
(6, 'Caprese Sandwich', 'Italian-style sandwich with fresh mozzarella', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af', 'LUNCH'),
(7, 'Quinoa Buddha Bowl', 'Healthy bowl with roasted vegetables', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'LUNCH'),
(8, 'Asian Noodle Salad', 'Cold noodles with sesame dressing', 'https://images.unsplash.com/photo-1547928576-965be7f5d7ae', 'LUNCH'),
(9, 'Grilled Salmon', 'With lemon herb butter', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 'DINNER'),
(10, 'Beef Stir Fry', 'Quick and flavorful Asian-style stir fry', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', 'DINNER'),
(11, 'Chicken Parmesan', 'Classic Italian comfort food', 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8', 'DINNER'),
(12, 'Vegetable Lasagna', 'Layered pasta with ricotta and vegetables', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3', 'DINNER'),
(13, 'Hummus Platter', 'Homemade hummus with pita and vegetables', 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71', 'SNACK'),
(14, 'Trail Mix', 'Energy-packed nuts and dried fruits', 'https://images.unsplash.com/photo-1556855810-ac404aa91e85', 'SNACK'),
(15, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 'https://images.unsplash.com/photo-1602351447937-745cb720612f', 'DESSERT'),
(16, 'Apple Pie', 'Classic American dessert', 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2', 'DESSERT'),
(17, 'Tiramisu', 'Italian coffee-flavored dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', 'DESSERT'),
(18, 'Berry Cheesecake', 'Creamy cheesecake with fresh berries', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad', 'DESSERT'),
(19, 'Ice Cream Sundae', 'Classic dessert with multiple toppings', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'DESSERT'),
(20, 'Fruit Tart', 'Buttery pastry with fresh fruits', 'https://images.unsplash.com/photo-1488477181946-6428a0291777', 'DESSERT');

-- Then insert the ingredients with their recipe relationships
INSERT INTO ingredient (name, amount, unit_of_measurement, recipe_id) VALUES
-- Classic Pancakes
('Flour', 2, 'CUP', 1),
('Eggs', 2, 'WHOLE', 1),
('Milk', 1, 'CUP', 1),

-- Avocado Toast
('Avocado', 1, 'WHOLE', 2),
('Bread', 2, 'SLICE', 2),
('Cherry Tomatoes', 4, 'WHOLE', 2),

-- Eggs Benedict
('Eggs', 4, 'WHOLE', 3),
('English Muffins', 2, 'PIECE', 3),
('Ham', 2, 'SLICE', 3),

-- Fruit Smoothie Bowl
('Mixed Berries', 2, 'CUP', 4),
('Banana', 1, 'WHOLE', 4),
('Granola', 1, 'CUP', 4),

-- Caesar Salad
('Lettuce', 1, 'WHOLE', 5),
('Croutons', 1, 'CUP', 5),
('Parmesan', 1, 'CUP', 5),

-- Caprese Sandwich
('Ciabatta Bread', 1, 'PIECE', 6),
('Mozzarella', 1, 'CUP', 6),
('Tomatoes', 2, 'WHOLE', 6),

-- Quinoa Buddha Bowl
('Quinoa', 1, 'CUP', 7),
('Sweet Potato', 1, 'WHOLE', 7),
('Chickpeas', 1, 'CUP', 7),

-- Asian Noodle Salad
('Rice Noodles', 2, 'CUP', 8),
('Bell Peppers', 2, 'WHOLE', 8),
('Sesame Seeds', 1, 'TABLESPOON', 8),

-- Grilled Salmon
('Salmon Fillet', 2, 'PIECE', 9),
('Lemon', 1, 'WHOLE', 9),
('Fresh Herbs', 1, 'TABLESPOON', 9),

-- Beef Stir Fry
('Beef Strips', 2, 'POUND', 10),
('Mixed Vegetables', 3, 'CUP', 10),
('Rice', 2, 'CUP', 10),

-- Chicken Parmesan
('Chicken Breast', 2, 'PIECE', 11),
('Mozzarella', 1, 'CUP', 11),
('Tomato Sauce', 1, 'CUP', 11),

-- Vegetable Lasagna
('Lasagna Noodles', 1, 'PIECE', 12),
('Ricotta', 2, 'CUP', 12),
('Spinach', 2, 'CUP', 12),

-- Hummus Platter
('Chickpeas', 2, 'CUP', 13),
('Tahini', 1, 'TABLESPOON', 13),
('Pita Bread', 2, 'PIECE', 13),

-- Trail Mix
('Mixed Nuts', 2, 'CUP', 14),
('Dried Cranberries', 1, 'CUP', 14),
('Dark Chocolate', 1, 'CUP', 14),

-- Chocolate Lava Cake
('Dark Chocolate', 2, 'CUP', 15),
('Butter', 1, 'CUP', 15),
('Eggs', 2, 'WHOLE', 15),

-- Apple Pie
('Apples', 6, 'WHOLE', 16),
('Pie Crust', 2, 'PIECE', 16),
('Cinnamon', 1, 'TEASPOON', 16),

-- Tiramisu
('Ladyfingers', 2, 'PIECE', 17),
('Mascarpone', 2, 'CUP', 17),
('Coffee', 1, 'CUP', 17),

-- Berry Cheesecake
('Cream Cheese', 3, 'CUP', 18),
('Mixed Berries', 2, 'CUP', 18),
('Graham Crackers', 1, 'CUP', 18),

-- Ice Cream Sundae
('Vanilla Ice Cream', 2, 'CUP', 19),
('Hot Fudge', 1, 'CUP', 19),
('Whipped Cream', 1, 'CUP', 19),
('Cherry', 1, 'WHOLE', 19),

-- Fruit Tart
('Pastry Cream', 1, 'CUP', 20),
('Mixed Fruits', 2, 'CUP', 20),
('Tart Shell', 1, 'PIECE', 20);