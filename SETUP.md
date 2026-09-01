# KARATE WKF COACH - Setup Guide

## 🔧 Complete Setup Instructions

This guide walks you through setting up the KARATE WKF COACH application from scratch.

## Option 1: Quick Start (Demo Mode) ⚡

If you just want to see the app working immediately:

```bash
npm install
npm run dev
```

The app will run with demo data and won't require Supabase setup.

**Access at**: http://localhost:3000

---

## Option 2: Full Setup with Supabase 🗄️

For persistent data storage and authentication, follow these steps:

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the project to be initialized (2-5 minutes)

### Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy:
   - `Project URL` (e.g., `https://xxxxx.supabase.co`)
   - `anon public` key

### Step 3: Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content of `migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run**

Wait for the query to complete. You should see all tables created successfully.

### Step 5: Seed Initial Data

1. Create another new SQL query
2. Copy the content of `migrations/002_seed_data.sql`
3. Paste and run

This creates training stages and exercise categories.

### Step 6: Enable Row Level Security (RLS)

For security, enable RLS on tables (optional but recommended):

```sql
-- Run in SQL Editor
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Coach can only see their own data
CREATE POLICY "Coaches can view own data" ON coaches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view own programs" ON training_programs
  FOR SELECT USING (coach_id IN (
    SELECT id FROM coaches WHERE user_id = auth.uid()
  ));
```

### Step 7: Install Dependencies & Run

```bash
npm install
npm run dev
```

The app is now fully configured and will use your Supabase database!

---

## 📝 Database Tables Overview

### Core Tables Created:

**Users & Coaches**
- `auth.users` - Supabase auth table (automatic)
- `coaches` - Coach profiles

**Training Structure**
- `training_stages` - 3 levels (Beginner, Intermediate, Advanced)
- `training_programs` - Programs
- `training_years` - Years
- `training_periods` - Periods (preparation, competitive, recovery)
- `training_months` - Months
- `training_weeks` - Weeks
- `training_days` - Days

**Exercises**
- `exercise_categories` - 6 categories
- `exercises` - Exercise library
- `exercise_videos` - Video references
- `workout_blocks` - Block types

**Workouts**
- `workouts` - Training sessions
- `workout_exercises` - Exercise assignments

**Future Tables** (for Phase 2 & 3)
- `groups` - Training groups
- `athletes` - Athletes
- `competitions` - Competitions
- `athlete_progress` - Progress tracking

---

## 🔐 Authentication Setup

### Create Your First Coach Account

1. Start the app: `npm run dev`
2. Navigate to http://localhost:3000
3. Look for "Sign Up" button (implementation in progress)
4. Create account with email and password
5. The system will automatically create your coach profile

**Note**: First version doesn't have auth UI yet. This will be in Phase 2.

---

## 📹 Video Storage Setup

To enable video uploads for exercises:

### Enable Supabase Storage

1. Go to **Storage** in Supabase dashboard
2. Create new bucket called `exercise-videos`
3. Make it public (for video playback)
4. Configure CORS:

```bash
curl -X POST 'https://[project-ref].supabase.co/storage/v1/buckets' \
  -H 'authorization: Bearer [your-anon-key]' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "exercise-videos",
    "public": true
  }'
```

---

## 🧪 Testing the Setup

### Verify Database Connection

In `.env.local`, add this temporary variable to enable debug logging:

```env
DEBUG=supabase:*
```

### Test Queries

Run this in your browser console:

```javascript
// Test if Supabase is connected
import { supabase } from '@/lib/supabase'
const { data, error } = await supabase
  .from('training_stages')
  .select('*')

console.log('Stages:', data)
console.log('Error:', error)
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Import in Vercel
# Go to vercel.com → Import Project → Select your repo

# 3. Add Environment Variables
# In Vercel dashboard → Settings → Environment Variables
# Add:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Deploy
git push origin main
```

Vercel will automatically deploy your app!

---

## 🐛 Troubleshooting

### Issue: "Supabase credentials not configured"

**Solution**: Check `.env.local` exists and has correct credentials:
```bash
cat .env.local
```

The app will still work in demo mode if not configured.

### Issue: Database connection error

```bash
# 1. Verify credentials
echo $NEXT_PUBLIC_SUPABASE_URL

# 2. Check network access
curl https://your-project.supabase.co

# 3. Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: "Tables don't exist"

Make sure you ran the SQL migration:
1. Go to Supabase SQL Editor
2. Run `001_initial_schema.sql`
3. Run `002_seed_data.sql`

### Issue: Tailwind styles not showing

```bash
npm run build
```

### Issue: Can't upload videos

1. Check Storage bucket `exercise-videos` exists
2. Verify bucket is public
3. Check CORS configuration

---

## 📊 Database Backup

### Export Database

```bash
# From Supabase dashboard → Backups → Download
# Or use pg_dump:
pg_dump --no-owner \
  'postgresql://user:password@host:5432/postgres' \
  > backup.sql
```

### Import Backup

```bash
psql 'postgresql://user:password@host:5432/postgres' < backup.sql
```

---

## 🔄 Updating the App

### Pull Latest Changes

```bash
git pull origin main
npm install
npm run dev
```

### Migration Scripts

If new migrations exist in `migrations/`:

1. Run them in Supabase SQL Editor
2. They're backward compatible

---

## 📚 Next Steps

After setup is complete:

1. Create your coach account
2. Create a training program
3. Add exercises
4. Build your first training plan
5. Invite other coaches (Phase 2)
6. Add your athletes (Phase 2)

---

## 💡 Tips

- **Demo Mode**: App works without Supabase. Great for testing!
- **Local Development**: Use Supabase for persistent data during dev
- **Performance**: Supabase is free tier friendly for small clubs
- **Scaling**: Easy migration to self-hosted PostgreSQL if needed

---

## 📞 Support

If you encounter issues:

1. Check this SETUP.md
2. Review README.md
3. Check Supabase docs: https://supabase.com/docs
4. Check Next.js docs: https://nextjs.org/docs

---

**Ready to go? Run `npm run dev` and start training!** 🥋
