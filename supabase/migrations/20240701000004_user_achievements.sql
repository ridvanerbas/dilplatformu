-- Create user_achievements table to track user progress and achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  achievement_type VARCHAR(50) NOT NULL,
  achievement_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_streaks table to track daily login streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add achievement_points field to user_points table
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS achievement_points INTEGER DEFAULT 0;

-- Create achievement_rules table to define achievement criteria
CREATE TABLE IF NOT EXISTS achievement_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  achievement_type VARCHAR(50) NOT NULL,
  required_value INTEGER NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 0,
  badge_id UUID REFERENCES badges(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample achievement rules
INSERT INTO achievement_rules (name, description, achievement_type, required_value, points_reward) VALUES
('First Login', 'Log in to the platform for the first time', 'login_count', 1, 10),
('Regular Learner', 'Log in for 7 consecutive days', 'login_streak', 7, 50),
('Dedicated Learner', 'Log in for 30 consecutive days', 'login_streak', 30, 200),
('Vocabulary Builder', 'Add 10 words to your vocabulary', 'vocabulary_count', 10, 20),
('Vocabulary Master', 'Add 100 words to your vocabulary', 'vocabulary_count', 100, 100),
('Sentence Collector', 'Add 10 sentences to your collection', 'sentence_count', 10, 20),
('Sentence Expert', 'Add 100 sentences to your collection', 'sentence_count', 100, 100),
('Course Starter', 'Enroll in your first course', 'course_enrollment_count', 1, 20),
('Course Enthusiast', 'Enroll in 5 different courses', 'course_enrollment_count', 5, 50),
('Lesson Completer', 'Complete your first lesson', 'lesson_completion_count', 1, 10),
('Lesson Master', 'Complete 50 lessons', 'lesson_completion_count', 50, 200),
('Quiz Taker', 'Complete your first quiz', 'quiz_completion_count', 1, 10),
('Quiz Master', 'Complete 20 quizzes with a score of 80% or higher', 'quiz_high_score_count', 20, 100),
('Forum Contributor', 'Create your first forum post', 'forum_post_count', 1, 10),
('Forum Expert', 'Create 50 forum posts', 'forum_post_count', 50, 100),
('Helper', 'Answer 10 questions in the forum', 'forum_answer_count', 10, 50),
('Premium Member', 'Subscribe to a premium membership plan', 'premium_membership', 1, 100);

-- Enable realtime for new tables
alter publication supabase_realtime add table user_achievements;
alter publication supabase_realtime add table user_streaks;
alter publication supabase_realtime add table achievement_rules;