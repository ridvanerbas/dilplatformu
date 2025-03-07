-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  language TEXT,
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  language_id UUID REFERENCES languages(id),
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  description TEXT,
  teacher_id UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dictionary table
CREATE TABLE IF NOT EXISTS dictionary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  language_id UUID REFERENCES languages(id),
  translation TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  examples TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('audio', 'image', 'document', 'video')),
  language_id UUID REFERENCES languages(id),
  uploaded_by UUID REFERENCES users(id),
  file_url TEXT,
  file_size TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  student_id UUID REFERENCES users(id),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(course_id, student_id)
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for users
INSERT INTO users (name, email, role, language, active, last_login)
VALUES
  ('Admin User', 'admin@example.com', 'admin', 'English', TRUE, NOW()),
  ('Teacher User', 'teacher@example.com', 'teacher', 'Spanish', TRUE, NOW()),
  ('Student User', 'student@example.com', 'student', 'English', TRUE, NOW()),
  ('John Doe', 'john.doe@example.com', 'student', 'English', TRUE, NOW() - INTERVAL '2 days'),
  ('Jane Smith', 'jane.smith@example.com', 'teacher', 'French', TRUE, NOW() - INTERVAL '1 day'),
  ('Robert Johnson', 'robert.johnson@example.com', 'admin', 'English', TRUE, NOW() - INTERVAL '3 days'),
  ('Emily Davis', 'emily.davis@example.com', 'student', 'German', FALSE, NOW() - INTERVAL '15 days'),
  ('Michael Wilson', 'michael.wilson@example.com', 'teacher', 'Japanese', TRUE, NOW() - INTERVAL '2 days');

-- Insert sample data for languages
INSERT INTO languages (name, code, status)
VALUES
  ('English', 'en', 'active'),
  ('Spanish', 'es', 'active'),
  ('French', 'fr', 'active'),
  ('German', 'de', 'active'),
  ('Japanese', 'ja', 'inactive'),
  ('Chinese', 'zh', 'active'),
  ('Italian', 'it', 'active'),
  ('Russian', 'ru', 'inactive');

-- Insert sample data for courses
INSERT INTO courses (title, language_id, level, description, teacher_id, status)
VALUES
  ('Spanish for Beginners', (SELECT id FROM languages WHERE code = 'es'), 'Beginner', 'A comprehensive introduction to Spanish language and culture.', (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'active'),
  ('Intermediate French', (SELECT id FROM languages WHERE code = 'fr'), 'Intermediate', 'Build upon your French language skills with advanced vocabulary and grammar.', (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'active'),
  ('Japanese for Business', (SELECT id FROM languages WHERE code = 'ja'), 'Advanced', 'Learn business Japanese for professional environments.', (SELECT id FROM users WHERE email = 'michael.wilson@example.com'), 'draft');

-- Insert sample data for dictionary
INSERT INTO dictionary (word, language_id, translation, part_of_speech, examples)
VALUES
  ('casa', (SELECT id FROM languages WHERE code = 'es'), 'house', 'noun', ARRAY['Mi casa es grande', 'Vamos a mi casa']),
  ('bonjour', (SELECT id FROM languages WHERE code = 'fr'), 'hello', 'interjection', ARRAY['Bonjour, comment ça va?']),
  ('schnell', (SELECT id FROM languages WHERE code = 'de'), 'fast', 'adjective', ARRAY['Das Auto ist sehr schnell']);

-- Insert sample data for materials
INSERT INTO materials (title, type, language_id, uploaded_by, file_url, file_size, description)
VALUES
  ('Spanish Pronunciation Guide', 'audio', (SELECT id FROM languages WHERE code = 'es'), (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'https://example.com/audio/spanish-pronunciation.mp3', '4.2 MB', 'A guide to Spanish pronunciation for beginners'),
  ('French Vocabulary Flashcards', 'image', (SELECT id FROM languages WHERE code = 'fr'), (SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'https://example.com/images/french-flashcards.zip', '2.8 MB', 'Visual flashcards for French vocabulary'),
  ('German Grammar Guide', 'document', (SELECT id FROM languages WHERE code = 'de'), (SELECT id FROM users WHERE email = 'teacher@example.com'), 'https://example.com/docs/german-grammar.pdf', '1.5 MB', 'Comprehensive guide to German grammar rules'),
  ('Japanese Conversation Practice', 'video', (SELECT id FROM languages WHERE code = 'ja'), (SELECT id FROM users WHERE email = 'michael.wilson@example.com'), 'https://example.com/videos/japanese-conversation.mp4', '28.5 MB', 'Video lessons for Japanese conversation practice');

-- Insert sample data for course_enrollments
INSERT INTO course_enrollments (course_id, student_id, status)
VALUES
  ((SELECT id FROM courses WHERE title = 'Spanish for Beginners'), (SELECT id FROM users WHERE email = 'student@example.com'), 'active'),
  ((SELECT id FROM courses WHERE title = 'Intermediate French'), (SELECT id FROM users WHERE email = 'john.doe@example.com'), 'active'),
  ((SELECT id FROM courses WHERE title = 'Spanish for Beginners'), (SELECT id FROM users WHERE email = 'emily.davis@example.com'), 'dropped');

-- Insert sample data for system_settings
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES
  ('site_name', 'Language Learning Platform', 'The name of the platform'),
  ('max_file_size', '50', 'Maximum file size in MB for uploads'),
  ('default_language', 'en', 'Default language for the platform'),
  ('maintenance_mode', 'false', 'Whether the platform is in maintenance mode');

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
DROP POLICY IF EXISTS "Admins can see all users" ON users;
CREATE POLICY "Admins can see all users"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Teachers can see students" ON users;
CREATE POLICY "Teachers can see students"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'teacher' AND role = 'student');

DROP POLICY IF EXISTS "Users can see themselves" ON users;
CREATE POLICY "Users can see themselves"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Enable realtime
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table languages;
alter publication supabase_realtime add table courses;
alter publication supabase_realtime add table dictionary;
alter publication supabase_realtime add table materials;
alter publication supabase_realtime add table course_enrollments;
alter publication supabase_realtime add table system_settings;
