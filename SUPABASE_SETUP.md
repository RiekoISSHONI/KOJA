# Supabase Setup Guide

This guide will help you set up Supabase for cloud sync and partner sharing in the Cycle Tracker app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose a name and set a secure database password
4. Select a region close to your users
5. Click "Create new project" and wait for it to be ready

## 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon public** key (the longer one)

## 3. Set Up Environment Variables

### For Local Development

Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Settings > Environment Variables**
3. Add these variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
4. Redeploy your app

## 4. Set Up the Database

Go to the **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Enable Row Level Security
-- Create profiles table (for storing user info)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cycle_settings table
CREATE TABLE IF NOT EXISTS cycle_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  last_period_start DATE,
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  share_code VARCHAR(6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cycle_notes table
CREATE TABLE IF NOT EXISTS cycle_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create cycle_shares table (for partner sharing)
CREATE TABLE IF NOT EXISTS cycle_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_with UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id, shared_with)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cycle_settings_user ON cycle_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_cycle_settings_share_code ON cycle_settings(share_code);
CREATE INDEX IF NOT EXISTS idx_cycle_notes_user ON cycle_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_cycle_shares_owner ON cycle_shares(owner_id);
CREATE INDEX IF NOT EXISTS idx_cycle_shares_shared_with ON cycle_shares(shared_with);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_shares ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of people who shared with them"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT owner_id FROM cycle_shares
      WHERE shared_with = auth.uid() AND status = 'accepted'
    )
  );

-- Cycle settings policies
CREATE POLICY "Users can view their own settings"
  ON cycle_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON cycle_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON cycle_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view settings of people who shared with them"
  ON cycle_settings FOR SELECT
  USING (
    user_id IN (
      SELECT owner_id FROM cycle_shares
      WHERE shared_with = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Anyone can lookup share codes"
  ON cycle_settings FOR SELECT
  USING (share_code IS NOT NULL);

-- Cycle notes policies
CREATE POLICY "Users can view their own notes"
  ON cycle_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON cycle_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON cycle_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON cycle_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view notes of people who shared with them"
  ON cycle_notes FOR SELECT
  USING (
    user_id IN (
      SELECT owner_id FROM cycle_shares
      WHERE shared_with = auth.uid() AND status = 'accepted'
    )
  );

-- Cycle shares policies
CREATE POLICY "Users can view shares they own"
  ON cycle_shares FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can view shares with them"
  ON cycle_shares FOR SELECT
  USING (auth.uid() = shared_with);

CREATE POLICY "Users can create shares for themselves"
  ON cycle_shares FOR INSERT
  WITH CHECK (auth.uid() = shared_with);

CREATE POLICY "Owners can update their shares"
  ON cycle_shares FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete shares they're part of"
  ON cycle_shares FOR DELETE
  USING (auth.uid() = owner_id OR auth.uid() = shared_with);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## 5. Configure Authentication

1. In Supabase, go to **Authentication > Providers**
2. Email is enabled by default
3. (Optional) Enable other providers like Google, Apple, etc.

### Configure Email Templates (Optional)

Go to **Authentication > Email Templates** to customize:
- Confirmation email
- Magic link email
- Password reset email

### Configure Site URL

Go to **Authentication > URL Configuration** and set:
- **Site URL**: Your production URL (e.g., `https://your-app.vercel.app`)
- **Redirect URLs**: Add your production URL and localhost for development

## 6. Test Your Setup

1. Start your local development server: `npm run dev`
2. Click the user icon to sign up
3. Check your email for confirmation
4. Sign in and verify data syncs to the cloud

## Features

Once set up, you'll have:

- **Cloud Sync**: Your cycle data syncs across all devices
- **Partner Sharing**: Generate a code to share your cycle with your partner
- **Real-time Updates**: Changes sync automatically
- **Offline Support**: Still works offline, syncs when back online

## Troubleshooting

### "Cloud sync not configured"
- Make sure your `.env` file has the correct Supabase URL and key
- Restart your dev server after adding environment variables

### "Invalid share code"
- Make sure the code is exactly 6 characters
- Codes are case-insensitive
- The owner must have generated a share code first

### Email not arriving
- Check spam folder
- Verify email settings in Supabase Authentication
- Make sure Site URL is configured correctly
