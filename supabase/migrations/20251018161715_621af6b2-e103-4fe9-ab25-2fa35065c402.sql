-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE camera_status AS ENUM ('online', 'offline', 'recording', 'error');
CREATE TYPE event_type AS ENUM ('motion', 'face_detected', 'face_matched', 'face_unknown', 'object_detected');
CREATE TYPE alert_method AS ENUM ('webhook', 'email', 'line', 'mqtt');

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Cameras table
CREATE TABLE public.cameras (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  rtsp_url TEXT NOT NULL,
  status camera_status DEFAULT 'offline',
  last_seen TIMESTAMPTZ,
  detection_config JSONB DEFAULT '{"motion_threshold": 0.5, "confidence_threshold": 0.8}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cameras"
  ON public.cameras FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cameras"
  ON public.cameras FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cameras"
  ON public.cameras FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cameras"
  ON public.cameras FOR DELETE
  USING (auth.uid() = user_id);

-- Enrolled faces table
CREATE TABLE public.enrolled_faces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  embedding JSONB NOT NULL,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.enrolled_faces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrolled faces"
  ON public.enrolled_faces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrolled faces"
  ON public.enrolled_faces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrolled faces"
  ON public.enrolled_faces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own enrolled faces"
  ON public.enrolled_faces FOR DELETE
  USING (auth.uid() = user_id);

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  camera_id UUID REFERENCES public.cameras(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type event_type NOT NULL,
  confidence DECIMAL(5,4),
  details JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  video_url TEXT,
  face_id UUID REFERENCES public.enrolled_faces(id) ON DELETE SET NULL,
  bbox JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Alert configs table
CREATE TABLE public.alert_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  camera_id UUID REFERENCES public.cameras(id) ON DELETE CASCADE,
  method alert_method NOT NULL,
  endpoint TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alert_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alert configs"
  ON public.alert_configs FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_cameras_user_id ON public.cameras(user_id);
CREATE INDEX idx_cameras_status ON public.cameras(status);
CREATE INDEX idx_events_camera_id ON public.events(camera_id);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX idx_events_event_type ON public.events(event_type);
CREATE INDEX idx_enrolled_faces_user_id ON public.enrolled_faces(user_id);

-- Enable realtime for events table
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cameras;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_cameras_updated_at BEFORE UPDATE ON public.cameras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrolled_faces_updated_at BEFORE UPDATE ON public.enrolled_faces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_configs_updated_at BEFORE UPDATE ON public.alert_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();