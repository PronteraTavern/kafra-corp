SET search_path TO public;

-- Users Table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
	first_name varchar(255) NULL,
	last_name varchar(255) NULL,
	avatar varchar(255) NULL,
	password_hash text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    deleted_at timestamp DEFAULT NULL

);

-- Optionally, add a trigger to automatically update the `updated_at` column when a row is updated
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create trigger set_updated_at before
update
    on
    public.users for each row execute function update_updated_at();

CREATE TYPE trip_status AS ENUM ('Planning', 'Booked', 'Cancelled', 'Concluded');

-- Trips Table
CREATE TABLE trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status trip_status NOT NULL DEFAULT 'Planning', -- Using the enum above
    trip_owner UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles for a user within a trip
CREATE TYPE trip_role AS ENUM ('Member', 'Admin');

-- Trip Members (Many-to-Many Relationship)
CREATE TABLE trip_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES trips(id),
    user_id UUID REFERENCES users(id),
    role trip_role NOT NULL DEFAULT 'Member', -- Using the enum above
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp DEFAULT NULL,
    UNIQUE (trip_id, user_id)
);

-- House Suggestions Table
CREATE TABLE accommodation_sugestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES trips(id),
    suggested_by UUID REFERENCES users(id), -- Person who added it
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    url TEXT NOT NULL, -- Using TEXT instead of VARCHAR due to airbnb long urls
    cover_image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- House Votes Table
CREATE TABLE accommodation_suggestion_rating (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    house_id UUID REFERENCES accommodation_sugestions(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT, -- Any comment
    vote INT CHECK (vote BETWEEN 0 AND 5), -- Ensure vote is between 0 and 5, 
    positive VARCHAR[] DEFAULT '{}', -- Array of VARCHARs
    negative VARCHAR[] DEFAULT '{}', -- Array of VARCHARs
    UNIQUE (house_id, user_id)
);


-- Buying List Table (Items Needed for a Trip)
CREATE TABLE shopping_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES trips(id),
    suggested_by UUID REFERENCES users(id), -- Person who added it
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    bought BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

CREATE TABLE check_list (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES trips(id),
    name VARCHAR(255) NOT NULL,
    assignee UUID REFERENCES users(id),
    done BOOLEAN DEFAULT FALSE -- Task status
);

CREATE TABLE places_to_visit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES trips(id),
    suggested_by UUID REFERENCES users(id), -- Person who added it
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    url TEXT NOT NULL, -- Using TEXT instead of VARCHAR due to google long urls
    cover_image TEXT NOT NULL
);


CREATE TABLE places_to_visit_rating (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    place_id UUID REFERENCES places_to_visit(id),
    user_id UUID REFERENCES users(id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT, -- Any comment
    vote INT CHECK (vote BETWEEN 0 AND 5), -- Ensure vote is between 0 and 5, 
    UNIQUE (place_id, user_id)
);