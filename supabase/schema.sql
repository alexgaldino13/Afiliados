-- Create a table for user profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'affiliate',
  niche TEXT,
  brand_voice TEXT,
  amazon_id TEXT,
  hotmart_id TEXT,
  kiwify_id TEXT,
  tiktok_id TEXT,
  affiliate_configs JSONB DEFAULT '{}'::jsonb
);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a table for products (Radar)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  price DECIMAL(10,2),
  commission TEXT,
  image_url TEXT,
  description TEXT,
  platform TEXT, -- e.g., 'Hotmart', 'Amazon'
  external_id TEXT, -- ID in the original platform
  affiliate_link TEXT,
  status TEXT DEFAULT 'pending'
);

-- Trigger for products
CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create a table for campaigns (Approved items / Content creation)
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE SET NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  copy_aida JSONB,
  business_dna JSONB,
  status TEXT DEFAULT 'draft', -- 'draft', 'processing', 'ready', 'failed'
  scheduled_at TIMESTAMP WITH TIME ZONE,
  error_log TEXT,
  progress INTEGER DEFAULT 0
);

-- Trigger for campaigns
CREATE TRIGGER set_updated_at_campaigns
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create a table for multi-modal assets
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campaign_id UUID REFERENCES campaigns ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'image', 'video', 'audio'
  url TEXT NOT NULL,
  prompt TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create a table for tracking clicks
CREATE TABLE clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campaign_id UUID REFERENCES campaigns ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Create a table for tracking conversions
CREATE TABLE conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campaign_id UUID REFERENCES campaigns ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  external_id TEXT -- Transaction ID from platform
);

-- Create a table for products discovered by the Scout agent (Global)
CREATE TABLE scouted_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  price DECIMAL(10,2),
  commission TEXT,
  image_url TEXT,
  description TEXT,
  platform TEXT,
  external_id TEXT UNIQUE,
  affiliate_link_template TEXT,
  category TEXT,
  score FLOAT DEFAULT 0.0, -- Hotness score or similar
  raw_data JSONB DEFAULT '{}'::jsonb
);

-- Trigger for scouted_products
CREATE TRIGGER set_updated_at_scouted_products
  BEFORE UPDATE ON scouted_products
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- 1. Tabela para Histórico de Chat com IA (Memória Contextual)
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  context_type TEXT, -- 'campaign', 'product', 'general'
  context_id UUID, -- ID da campanha ou produto relacionado
  agent_type TEXT -- 'scout', 'copywriter', 'strategist'
);

-- 2. Tabela para Recomendações do Scout (Oportunidades)
CREATE TABLE scout_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id UUID REFERENCES scouted_products ON DELETE CASCADE,
  match_reason TEXT,
  match_score FLOAT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  UNIQUE(user_id, product_id)
);

-- 3. Tabela de Notificações
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'new_product', 'conversion', 'system'
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouted_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for Products (Radar)
CREATE POLICY "Users can manage their own products" ON products FOR ALL USING (auth.uid() = user_id);

-- Policies for Campaigns
CREATE POLICY "Users can manage their own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- Policies for Assets
CREATE POLICY "Users can view assets of their campaigns" ON assets FOR SELECT
  USING (EXISTS (SELECT 1 FROM campaigns WHERE id = assets.campaign_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert assets into their campaigns" ON assets FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM campaigns WHERE id = campaign_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete their own assets" ON assets FOR DELETE
  USING (EXISTS (SELECT 1 FROM campaigns WHERE id = assets.campaign_id AND user_id = auth.uid()));

-- Policies for Clicks
CREATE POLICY "Users can view clicks of their campaigns" ON clicks FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert clicks" ON clicks FOR INSERT
  WITH CHECK (true);

-- Policies for Conversions
CREATE POLICY "Users can view their own conversions" ON conversions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own conversions" ON conversions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for Scouted Products
CREATE POLICY "Everyone can view scouted products" ON scouted_products FOR SELECT
  USING (true);

-- Policies for Chat
CREATE POLICY "Users can manage their own chat messages" ON chat_messages FOR ALL USING (auth.uid() = user_id);

-- Policies for Recommendations
CREATE POLICY "Users can view their own recommendations" ON scout_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own recommendations" ON scout_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Policies for Notifications
CREATE POLICY "Users can manage their own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Performance Indices
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_product_id ON campaigns(product_id);
CREATE INDEX idx_assets_campaign_id ON assets(campaign_id);
CREATE INDEX idx_clicks_campaign_id ON clicks(campaign_id);
CREATE INDEX idx_conversions_campaign_id ON conversions(campaign_id);
CREATE INDEX idx_scouted_products_category ON scouted_products(category);
CREATE INDEX idx_chat_messages_user_context ON chat_messages(user_id, context_id);
CREATE INDEX idx_scout_recommendations_user ON scout_recommendations(user_id, status);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = false;

-- Tabela para Base de Conhecimento Propriétaria (Cursos do Usuário)
CREATE TABLE knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- O conteúdo do curso/estratégia
  source_url TEXT,
  tags TEXT[], -- ['internacional', 'google_ads', 'copywriting']
  vector_embedding VECTOR(1536) -- Para busca semântica futura
);

-- Create a table for social media posting schedule
CREATE TABLE posting_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'tiktok', 'instagram', 'youtube'
  scheduled_date DATE NOT NULL,
  content_hook TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'posted'
  viral_potential INTEGER DEFAULT 0
);

-- Performance Index
CREATE INDEX idx_posting_schedule_user_date ON posting_schedule(user_id, scheduled_date);
