# KARATE WKF COACH - Architecture

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Icons**: Lucide React
- **Package Manager**: npm

### Backend / Database
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for videos)
- **API**: Next.js API Routes + Supabase Client

### Deployment
- Vercel (frontend)
- Supabase (backend)

---

## Project Structure

```
coach/
├── app/                           # Next.js app directory
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home/Dashboard
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   └── signup/
│   ├── programs/                 # Training programs
│   │   └── [programId]/
│   ├── workouts/                 # Workouts & training
│   │   └── [workoutId]/
│   ├── exercises/                # Exercise library
│   ├── groups/                   # Training groups
│   ├── athletes/                 # Athletes management
│   ├── competitions/             # Competitions
│   ├── analytics/                # Analytics
│   └── api/                      # API routes
│
├── components/                    # Reusable components
│   ├── common/                   # Header, Nav, etc.
│   ├── programs/                 # Program-related components
│   ├── workouts/                 # Workout components
│   ├── exercises/                # Exercise components
│   └── forms/                    # Form components
│
├── lib/                          # Utilities & helpers
│   ├── supabase.ts              # Supabase client
│   ├── types.ts                 # Type definitions
│   ├── constants.ts             # Constants
│   └── utils.ts                 # Helper functions
│
├── store/                        # Zustand stores
│   ├── authStore.ts
│   ├── programStore.ts
│   └── workoutStore.ts
│
├── styles/                       # Global styles
│   └── globals.css
│
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Database Schema

### Core Tables

1. **users** - Coaches and athletes
2. **coaches** - Coach-specific info
3. **clubs** - Sports clubs
4. **groups** - Training groups
5. **athletes** - Athletes data
6. **athlete_groups** - Many-to-many: athletes in groups

### Training Structure

7. **training_stages** - 3 levels (Beginner, Intermediate, Advanced)
8. **training_programs** - Programs (one per stage per club/coach)
9. **training_years** - Years within programs
10. **training_periods** - Macrocycles (preparation, competitive, recovery)
11. **training_months** - Months
12. **training_weeks** - Weeks with schedule
13. **training_days** - Days with planned workouts

### Workouts & Exercises

14. **workouts** - Individual training sessions
15. **workout_blocks** - Blocks within workouts (warm-up, technique, etc.)
16. **workout_exercises** - Link: exercises in blocks
17. **exercises** - Exercise library
18. **exercise_categories** - Kumite, Kata, OFP, SFP, Tactics
19. **exercise_videos** - Videos for exercises

### Progress & Competitions

20. **athlete_programs** - Athlete assignments to programs
21. **athlete_progress** - Progress tracking
22. **competitions** - Competition events
23. **competition_athletes** - Participants
24. **competition_results** - Results & stats

### Templates & References

25. **workout_templates** - Reusable workout structures

---

## Data Flow

```
User Login
  ↓
Dashboard (Today's Workouts)
  ↓
Select Program
  ↓
View Year → Month → Week → Day
  ↓
View/Edit Workout
  ↓
Start Workout (Full Screen Mode)
  ↓
Execute Blocks → Exercises → Videos
  ↓
Complete & Add Notes
```

---

## Key Features by MVP Phase

### Phase 1 (MVP)
- ✅ Authentication
- ✅ Dashboard with today's workouts
- ✅ 3 Training Stages
- ✅ Programs, Years, Periods, Months, Weeks
- ✅ Workouts with blocks
- ✅ Exercise library
- ✅ Video support
- ✅ Full-screen workout mode
- ✅ Demo/Seed data

### Phase 2
- Groups management
- Athletes management
- Individual programs
- Calendar view
- Workout templates

### Phase 3
- Analytics & statistics
- Competitions management
- Video analysis
- Athlete progress tracking
- Advanced reporting

---

## Security

- Row Level Security (RLS) on Supabase
- Coaches can only see their own data
- Athletes can see data shared with them
- Encrypted password storage (Supabase Auth)
