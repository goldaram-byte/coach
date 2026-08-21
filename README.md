# KARATE WKF COACH

**Professional karate training management system for WKF coaches**

A comprehensive platform for planning, tracking, and optimizing karate training programs. Designed specifically for WKF karate coaches to manage training stages, create workout plans, track athlete progress, and maintain organized exercise libraries.

## 🎯 Features (MVP)

### Core Functionality
- ✅ **Dashboard** - Daily workout overview and quick statistics
- ✅ **Training Programs** - 3-level structure (Beginner, Intermediate, Advanced)
- ✅ **Hierarchical Planning** - Year → Period → Month → Week → Day → Workout
- ✅ **Exercise Library** - Comprehensive exercise database with categories
- ✅ **Workout Management** - Create and organize training blocks and exercises
- ✅ **Groups Management** - Organize athletes into training groups
- ✅ **Responsive Design** - Mobile, tablet, and desktop support

### Future Features (Phase 2 & 3)
- Athletes management and profiles
- Individual training programs
- Competition calendar and tracking
- Progress analytics and reporting
- Video management and storage
- Advanced workout templates

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Lucide React** - Icon library

### Backend
- **Supabase** - PostgreSQL database + authentication
- **Next.js API Routes** - Serverless backend
- **Supabase Storage** - Video file storage

## 📋 Project Structure

```
coach/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard
│   ├── programs/                # Training programs
│   ├── workouts/                # Workouts management
│   ├── exercises/               # Exercise library
│   ├── groups/                  # Training groups
│   └── analytics/               # Analytics dashboard
│
├── components/
│   ├── common/                  # Header, Navigation
│   ├── programs/                # Program components
│   └── workouts/                # Workout components
│
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript types
│   ├── constants.ts            # App constants
│   └── utils.ts                # Utility functions
│
├── store/                       # Zustand stores
├── styles/                      # Global CSS
├── migrations/                  # Database migrations
└── public/                      # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd coach
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create `.env.local` file in the root directory:

```env
# Supabase (get from https://app.supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note:** If Supabase is not accessible, the app will run in **demo mode** with mock data.

4. **Setup Database** (Optional - for full functionality)

In Supabase dashboard:
1. Create new project
2. Go to SQL Editor
3. Copy content from `migrations/001_initial_schema.sql`
4. Run the SQL to create tables

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 Database Schema

The application uses PostgreSQL with the following core tables:

### Training Structure
- `training_stages` - 3 preparation levels
- `training_programs` - Program templates
- `training_years` - Years within programs
- `training_periods` - Macrocycles (preparation, competitive, recovery)
- `training_months` - Monthly plans
- `training_weeks` - Weekly schedules
- `training_days` - Daily training days

### Workouts & Exercises
- `workouts` - Individual training sessions
- `workout_blocks` - Blocks within workouts (warm-up, technique, etc.)
- `workout_exercises` - Link exercises to blocks
- `exercises` - Exercise library
- `exercise_categories` - 6 categories (Kumite, Kata, OFP, SFP, Tactics, Psychology)
- `exercise_videos` - Video references

### Management
- `coaches` - Coach profiles
- `groups` - Training groups
- `athletes` - Athlete profiles
- `competitions` - Competition events
- `athlete_progress` - Progress tracking

## 📱 Demo Data

The app comes with demo data pre-loaded:
- 3 training programs (Beginner, Intermediate, Advanced)
- 12+ exercises across all categories
- 3 training groups
- Sample weekly and monthly schedules

**Note:** To use persistent data, connect a Supabase database.

## 🎨 UI/UX Design

### Design Principles
- **Minimalism** - Clean, distraction-free interface
- **Sports-First** - Optimized for coaches during training
- **Responsive** - Works seamlessly on phone, tablet, desktop
- **Accessible** - High contrast, readable typography

### Color System
- **Green (#10b981)** - Beginner level
- **Amber (#f59e0b)** - Intermediate level  
- **Red (#ef4444)** - Advanced level

### Supporting UI Utility Classes
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.card` - Card container
- `.badge` - Status badges
- `.input-base` - Form input

## 📊 Data Flow

```
User Login
    ↓
Dashboard (Today's Workouts)
    ↓
Select Program
    ↓
View: Year → Period → Month → Week → Day
    ↓
View/Edit Workout
    ↓
Start Workout (Full-Screen Mode)
    ↓
Execute Blocks → Exercises → Videos
    ↓
Complete & Add Notes
```

## 🔐 Security

- **Row Level Security (RLS)** - Coaches see only their data
- **Supabase Auth** - Secure authentication
- **Type Safety** - Full TypeScript coverage
- **API Routes** - Serverless backend isolation

## 📦 Build & Deploy

### Build for production
```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel settings
4. Deploy

```bash
# Or deploy directly
vercel
```

## 🗂️ Navigation

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/` | Daily overview, quick stats |
| Programs | `/programs` | Manage training programs |
| Program Details | `/programs/[id]` | Hierarchical plan view |
| Workouts | `/workouts` | List and manage workouts |
| Exercises | `/exercises` | Exercise library |
| Groups | `/groups` | Manage training groups |
| Analytics | `/analytics` | Statistics and progress |

## 🎯 MVP Priorities

### Phase 1 (MVP) - Complete ✅
- [x] Authentication setup
- [x] Dashboard with today's workouts
- [x] 3 Training Stages
- [x] Program hierarchy (Year→Period→Month→Week→Day)
- [x] Workout creation and management
- [x] Exercise library
- [x] Groups management
- [x] Basic analytics
- [x] Responsive mobile UI

### Phase 2 (Future)
- [ ] Athletes management
- [ ] Individual programs
- [ ] Workout templates
- [ ] Video storage and playback
- [ ] Full-screen workout mode with timer

### Phase 3 (Future)
- [ ] Advanced analytics
- [ ] Competition management
- [ ] Video analysis tools
- [ ] Progress graphs
- [ ] Export/reports

## 🤝 Contributing

This is a professional sports application. Before contributing:
1. Ensure changes follow the existing code structure
2. Maintain type safety with TypeScript
3. Test responsive design on mobile
4. Follow Tailwind CSS naming conventions

## 📝 Notes

- **Demo Mode**: If Supabase is not configured, app displays demo data
- **No External CDNs**: All styling is self-contained (Tailwind + local fonts)
- **Offline Ready**: Can be installed as PWA for offline access
- **Dark Mode**: Full dark mode support via Tailwind dark mode

## 🆘 Troubleshooting

### Supabase not connecting
```
Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
App will run in demo mode if not configured
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

### Styling issues
```bash
# Rebuild Tailwind
npm run build
```

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Created as a professional sports training management system for WKF karate coaches.

---

**Made with 🥋 for karate coaches**
