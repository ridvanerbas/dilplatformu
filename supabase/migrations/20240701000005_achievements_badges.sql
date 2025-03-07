-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  points_reward INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table to track user progress
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table to track earned badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Add points and level columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Enable row level security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Achievements policies
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Achievements are insertable by admins" ON achievements;
CREATE POLICY "Achievements are insertable by admins"
  ON achievements FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Achievements are updatable by admins" ON achievements;
CREATE POLICY "Achievements are updatable by admins"
  ON achievements FOR UPDATE
  USING (auth.jwt()->>'role' = 'admin');

-- User achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "System can insert user achievements" ON user_achievements;
CREATE POLICY "System can insert user achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "System can update user achievements" ON user_achievements;
CREATE POLICY "System can update user achievements"
  ON user_achievements FOR UPDATE
  USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

-- Badges policies
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON badges;
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Badges are insertable by admins" ON badges;
CREATE POLICY "Badges are insertable by admins"
  ON badges FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Badges are updatable by admins" ON badges;
CREATE POLICY "Badges are updatable by admins"
  ON badges FOR UPDATE
  USING (auth.jwt()->>'role' = 'admin');

-- User badges policies
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "System can insert user badges" ON user_badges;
CREATE POLICY "System can insert user badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

-- Enable realtime for these tables
alter publication supabase_realtime add table achievements;
alter publication supabase_realtime add table user_achievements;
alter publication supabase_realtime add table badges;
alter publication supabase_realtime add table user_badges;
