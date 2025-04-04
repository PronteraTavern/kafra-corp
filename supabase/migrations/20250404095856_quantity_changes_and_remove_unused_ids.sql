-- Add created_at to => places_to_visit, check_list
ALTER TABLE places_to_visit 
	ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE check_list 
	ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Change shopping_items.quantity field to VARCHAR
ALTER TABLE shopping_items 
	ALTER COLUMN quantity TYPE VARCHAR(30);

-- Remove unused id from -> trip_members, accommodation_suggestion_rating, places_to_visit_rating
ALTER TABLE trip_members
	DROP COLUMN id;

ALTER TABLE accommodation_suggestion_rating
	DROP COLUMN id;

ALTER TABLE places_to_visit_rating
	DROP COLUMN id;