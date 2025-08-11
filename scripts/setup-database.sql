-- Create database schema for GlobeTrotter
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  city VARCHAR(100),
  country VARCHAR(100),
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_image TEXT,
  total_budget DECIMAL(10,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  cost_index DECIMAL(5,2) DEFAULT 100,
  popularity_score INTEGER DEFAULT 0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_url TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS trip_stops (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  order_index INTEGER NOT NULL,
  budget DECIMAL(10,2) DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  cost DECIMAL(8,2),
  duration_hours INTEGER,
  rating DECIMAL(3,2),
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS trip_activities (
  id SERIAL PRIMARY KEY,
  trip_stop_id INTEGER REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id),
  scheduled_date DATE,
  scheduled_time TIME,
  cost DECIMAL(8,2),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS shared_trips (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  shared_by INTEGER REFERENCES users(id),
  share_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO cities (name, country, cost_index, popularity_score, image_url, description) VALUES
('Tokyo', 'Japan', 150, 95, '/tokyo-skyline-night.png', 'Modern metropolis with rich culture'),
('Paris', 'France', 140, 92, '/paris-eiffel-tower.png', 'City of lights and romance'),
('Bali', 'Indonesia', 80, 88, '/bali-temple.png', 'Tropical paradise with stunning temples'),
('Dubai', 'UAE', 160, 85, '/dubai-skyline.png', 'Luxury destination with modern architecture'),
('Santorini', 'Greece', 120, 90, '/santorini-sunset.png', 'Beautiful island with stunning sunsets'),
('Iceland', 'Iceland', 180, 87, '/iceland-northern-lights.png', 'Land of fire and ice');

INSERT INTO activities (city_id, name, description, category, cost, duration_hours, rating) VALUES
(1, 'Visit Senso-ji Temple', 'Ancient Buddhist temple in Asakusa', 'Cultural', 0, 2, 4.5),
(1, 'Tokyo Skytree Observatory', 'Panoramic city views from 634m tower', 'Sightseeing', 25, 2, 4.3),
(1, 'Tsukiji Fish Market Tour', 'Early morning tuna auction and sushi breakfast', 'Food', 45, 3, 4.7),
(2, 'Eiffel Tower Visit', 'Iconic iron tower with city views', 'Sightseeing', 30, 2, 4.4),
(2, 'Louvre Museum', 'World famous art museum', 'Cultural', 20, 4, 4.6),
(2, 'Seine River Cruise', 'Romantic boat tour along the Seine', 'Leisure', 35, 1, 4.2);
