-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL,
  language VARCHAR(10),
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  language_id UUID REFERENCES languages(id),
  level VARCHAR(50) NOT NULL,
  teacher_id UUID REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  student_id UUID REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dictionary table
CREATE TABLE IF NOT EXISTS dictionary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word VARCHAR(100) NOT NULL,
  translation VARCHAR(255) NOT NULL,
  part_of_speech VARCHAR(50) NOT NULL,
  examples TEXT[] DEFAULT '{}',
  language_id UUID REFERENCES languages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  file_url TEXT,
  file_size VARCHAR(20),
  language_id UUID REFERENCES languages(id),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_vocabulary table
CREATE TABLE IF NOT EXISTS user_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  word_id UUID REFERENCES dictionary(id),
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sentences table
CREATE TABLE IF NOT EXISTS user_sentences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  language_id UUID REFERENCES languages(id),
  sentence TEXT NOT NULL,
  translation TEXT NOT NULL,
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'Language Learning Platform', 'The name of the platform'),
('max_file_size', '50', 'Maximum file size for uploads in MB'),
('default_language', 'en', 'Default language for the platform interface'),
('maintenance_mode', 'false', 'Whether the platform is in maintenance mode');

-- Insert sample languages
INSERT INTO languages (name, code, status) VALUES
('English', 'en', 'active'),
('Spanish', 'es', 'active'),
('French', 'fr', 'active'),
('German', 'de', 'active'),
('Italian', 'it', 'active'),
('Japanese', 'ja', 'active'),
('Chinese', 'zh', 'active');

-- Insert sample users
INSERT INTO users (name, email, role, active) VALUES
('Admin User', 'admin@example.com', 'admin', true),
('Teacher User', 'teacher@example.com', 'teacher', true),
('Student User', 'student@example.com', 'student', true);

-- Enable realtime for all tables
alter publication supabase_realtime add table languages;
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table courses;
alter publication supabase_realtime add table course_enrollments;
alter publication supabase_realtime add table dictionary;
alter publication supabase_realtime add table materials;
alter publication supabase_realtime add table user_vocabulary;
alter publication supabase_realtime add table user_sentences;
alter publication supabase_realtime add table system_settings;