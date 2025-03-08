-- Check if languages already exist before inserting
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'en') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'English', 'en', 'active', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'es') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'Spanish', 'es', 'active', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'fr') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'French', 'fr', 'active', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'de') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'German', 'de', 'active', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'ja') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'Japanese', 'ja', 'active', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'zh') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'Chinese', 'zh', 'active', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'it') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'Italian', 'it', 'active', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'ru') THEN
    INSERT INTO languages (id, name, code, status, created_at) VALUES
    (uuid_generate_v4(), 'Russian', 'ru', 'inactive', NOW());
  END IF;
END
$$;

-- Insert sample courses
INSERT INTO courses (id, title, description, language_id, level, status, teacher_id, created_at)
SELECT 
  uuid_generate_v4(), 'Spanish for Beginners', 'Learn the basics of Spanish language', 
  (SELECT id FROM languages WHERE code = 'es' LIMIT 1), 'Beginner', 'active', 
  (SELECT id FROM users WHERE role = 'teacher' LIMIT 1), NOW()
WHERE EXISTS (SELECT 1 FROM languages WHERE code = 'es')
AND EXISTS (SELECT 1 FROM users WHERE role = 'teacher');

INSERT INTO courses (id, title, description, language_id, level, status, teacher_id, created_at)
SELECT 
  uuid_generate_v4(), 'Intermediate French', 'Take your French to the next level', 
  (SELECT id FROM languages WHERE code = 'fr' LIMIT 1), 'Intermediate', 'active', 
  (SELECT id FROM users WHERE role = 'teacher' LIMIT 1), NOW()
WHERE EXISTS (SELECT 1 FROM languages WHERE code = 'fr')
AND EXISTS (SELECT 1 FROM users WHERE role = 'teacher');

INSERT INTO courses (id, title, description, language_id, level, status, teacher_id, created_at)
SELECT 
  uuid_generate_v4(), 'Business English', 'English for professional environments', 
  (SELECT id FROM languages WHERE code = 'en' LIMIT 1), 'Advanced', 'active', 
  (SELECT id FROM users WHERE role = 'teacher' LIMIT 1), NOW()
WHERE EXISTS (SELECT 1 FROM languages WHERE code = 'en')
AND EXISTS (SELECT 1 FROM users WHERE role = 'teacher');

-- Insert sample dictionary entries if languages exist
INSERT INTO dictionary (id, word, translation, part_of_speech, language_id, examples, created_at)
SELECT 
  uuid_generate_v4(), 'casa', 'house', 'noun', 
  (SELECT id FROM languages WHERE code = 'es' LIMIT 1), 
  ARRAY['La casa es grande', 'Voy a casa'], NOW()
WHERE EXISTS (SELECT 1 FROM languages WHERE code = 'es');

INSERT INTO dictionary (id, word, translation, part_of_speech, language_id, examples, created_at)
SELECT 
  uuid_generate_v4(), 'bonjour', 'hello', 'interjection', 
  (SELECT id FROM languages WHERE code = 'fr' LIMIT 1), 
  ARRAY['Bonjour, comment ça va?'], NOW()
WHERE EXISTS (SELECT 1 FROM languages WHERE code = 'fr');

INSERT INTO dictionary (id, word, translation, part_of_speech, language_id, examples, created_at)
SELECT 
  uuid_generate_v4(), 'schnell', 'fast', 'adjective', 
  (SELECT id FROM languages WHERE code = 'de' LIMIT 1), 
  ARRAY['Das Auto ist sehr schnell', 'Er läuft schnell'], NOW()
WHERE EXISTS (SELECT 1 FROM languages WHERE code = 'de');

-- Insert sample achievements
INSERT INTO achievements (id, title, description, icon, points_reward, max_progress, created_at) VALUES
(uuid_generate_v4(), 'First Steps', 'Complete your first lesson', 'trophy', 50, 1, NOW()),
(uuid_generate_v4(), 'Vocabulary Master', 'Learn 100 words', 'book', 100, 100, NOW()),
(uuid_generate_v4(), 'Conversation Starter', 'Complete 5 dialogue practices', 'message-square', 75, 5, NOW()),
(uuid_generate_v4(), 'Story Explorer', 'Read 10 stories', 'book-open', 120, 10, NOW());

-- Insert sample badges
INSERT INTO badges (id, name, description, image_url, created_at) VALUES
(uuid_generate_v4(), 'Early Bird', 'Awarded for joining the platform in its first month', '🌅', NOW()),
(uuid_generate_v4(), 'Perfect Week', 'Practice every day for a week', '🔥', NOW()),
(uuid_generate_v4(), 'Quiz Master', 'Score 100% on 5 quizzes', '🧠', NOW()),
(uuid_generate_v4(), 'Social Learner', 'Participate in the community forum', '💬', NOW());

-- Insert sample system settings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key = 'site_name') THEN
    INSERT INTO system_settings (id, setting_key, setting_value, description, created_at) VALUES
    (uuid_generate_v4(), 'site_name', 'Language Learning Platform', 'The name of the platform', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key = 'max_file_size') THEN
    INSERT INTO system_settings (id, setting_key, setting_value, description, created_at) VALUES
    (uuid_generate_v4(), 'max_file_size', '50', 'Maximum file size for uploads in MB', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key = 'default_language') THEN
    INSERT INTO system_settings (id, setting_key, setting_value, description, created_at) VALUES
    (uuid_generate_v4(), 'default_language', 'en', 'Default interface language', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key = 'maintenance_mode') THEN
    INSERT INTO system_settings (id, setting_key, setting_value, description, created_at) VALUES
    (uuid_generate_v4(), 'maintenance_mode', 'false', 'Whether the site is in maintenance mode', NOW());
  END IF;
END
$$;

-- Create forum_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample forum categories
INSERT INTO forum_categories (id, name, slug, description, order_index, created_at)
SELECT 
  uuid_generate_v4(), 'General Discussion', 'general-discussion', 'General topics about language learning', 1, NOW()
WHERE NOT EXISTS (SELECT 1 FROM forum_categories WHERE slug = 'general-discussion');

INSERT INTO forum_categories (id, name, slug, description, order_index, created_at)
SELECT 
  uuid_generate_v4(), 'Language Exchange', 'language-exchange', 'Find partners for language exchange', 2, NOW()
WHERE NOT EXISTS (SELECT 1 FROM forum_categories WHERE slug = 'language-exchange');

-- Create forum_topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memberships table if it doesn't exist
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  features JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample membership plans
INSERT INTO memberships (id, name, description, price, duration_days, features, status, created_at)
SELECT 
  uuid_generate_v4(), 'Free', 'Basic access to the platform', 0.00, 365, 
  '{"course_access": true, "vocabulary_limit": 100, "sentence_limit": 50, "listening_room": false, "practice_modules": false, "private_lessons_discount": 0}'::jsonb, 
  'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM memberships WHERE name = 'Free');

INSERT INTO memberships (id, name, description, price, duration_days, features, status, created_at)
SELECT 
  uuid_generate_v4(), 'Premium', 'Enhanced learning experience with all features', 9.99, 30, 
  '{"course_access": true, "vocabulary_limit": 1000, "sentence_limit": 500, "listening_room": true, "practice_modules": true, "private_lessons_discount": 10}'::jsonb, 
  'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM memberships WHERE name = 'Premium');

-- Create user_memberships table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'completed',
  reference_type VARCHAR(50),
  reference_id UUID,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sentences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_sentences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sentence TEXT NOT NULL,
  translation TEXT NOT NULL,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_vocabulary table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES dictionary(id) ON DELETE CASCADE,
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- Create teacher_schedule table if it doesn't exist
CREATE TABLE IF NOT EXISTS teacher_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create private_lessons table if it doesn't exist
CREATE TABLE IF NOT EXISTS private_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for these tables
alter publication supabase_realtime add table forum_categories;
alter publication supabase_realtime add table forum_topics;
alter publication supabase_realtime add table forum_posts;
alter publication supabase_realtime add table memberships;
alter publication supabase_realtime add table user_memberships;
alter publication supabase_realtime add table payments;
alter publication supabase_realtime add table user_sentences;
alter publication supabase_realtime add table user_vocabulary;
alter publication supabase_realtime add table teacher_schedule;
alter publication supabase_realtime add table private_lessons;
