# CareerOS — Full Implementation Guide

> **AI-Powered Job Acquisition Command Center**
>
> This document is a **complete blueprint** to transform the current frontend-only prototype into a fully working full-stack application. Copy this entire document as a single prompt into an AI coding agent (Lovable, Cursor, Bolt, etc.) and it will implement everything.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current State Analysis](#2-current-state-analysis)
3. [Architecture Design](#3-architecture-design)
4. [API Keys & Services Required](#4-api-keys--services-required)
5. [Backend Implementation](#5-backend-implementation)
6. [Database Schema](#6-database-schema)
7. [Frontend Refactoring](#7-frontend-refactoring)
8. [Feature-by-Feature Implementation](#8-feature-by-feature-implementation)
9. [Authentication & Security](#9-authentication--security)
10. [Deployment](#10-deployment)
11. [The Single Prompt](#11-the-single-prompt)
12. [Cost Estimation](#12-cost-estimation)

---

## 1. Project Overview

**CareerOS** is an AI-powered job search automation platform that uses multiple AI agents to:

- Parse and analyze CVs/resumes
- Scan job boards for matching roles
- Score and rank job matches against user profiles
- Generate tailored CV versions per job description
- Compose personalized outreach emails
- Prepare interview questions and strategies
- Track applications, analytics, and costs

**Current stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion + Recharts

**Target stack:** Same frontend + Supabase (Auth, DB, Storage, Edge Functions) OR Node.js/Express backend + PostgreSQL

---

## 2. Current State Analysis

### What Exists (Frontend Only — All Hardcoded)

| Page/Component | Current State | What's Needed |
|---|---|---|
| **Dashboard (Index.tsx)** | CV upload triggers a simulated 6-agent pipeline with fake delays | Real AI pipeline execution via backend |
| **CVUpload.tsx** | Accepts file but does nothing with it | Upload to storage, parse with AI, extract skills |
| **AgentWorkflow.tsx** | Simulated progress bars with `setInterval` timers | Real agent orchestration via backend jobs |
| **ActivityLog.tsx** | Hardcoded log templates per agent name | Real-time logs via WebSocket/SSE from backend |
| **StrategyCard.tsx** | Hardcoded values (Senior Backend Engineer, Berlin, 87%) | Dynamic from user profile + AI analysis |
| **Applications.tsx** | 8 hardcoded application objects in-memory | Database-backed CRUD with real status tracking |
| **CVVersions.tsx** | 6 hardcoded CV version cards | Generated CVs stored in DB + downloadable PDFs |
| **JobIntelligence.tsx** | 5 hardcoded insight cards | Real-time job market data from APIs |
| **Outreach.tsx** | 4 hardcoded email entries | Real email sending via Gmail/SendGrid API |
| **InterviewPrep.tsx** | 5 hardcoded section arrays | AI-generated questions per target company |
| **Analytics.tsx** | Hardcoded chart data + stats | Real metrics computed from DB |
| **ControlTower.tsx** | Local `useState` sliders/toggles that reset on reload | Persisted user settings in DB |
| **CommandBar.tsx** | Hardcoded execution plan, no real execution | Natural language → AI action planning → execution |
| **Settings.tsx** | Hardcoded dummy API keys with show/hide | Encrypted credential storage & validation |

### Key Gaps

1. **No backend** — Zero API calls, no server
2. **No database** — All data is hardcoded or ephemeral
3. **No authentication** — No user accounts
4. **No file storage** — CV upload reads file but discards it
5. **No AI integration** — Agent pipeline is purely visual simulation
6. **No real-time communication** — No WebSocket/SSE for live updates
7. **No email integration** — Outreach page is display-only

---

## 3. Architecture Design

### Recommended: Supabase + Edge Functions

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  Vite + TypeScript + Tailwind + shadcn/ui                │
│  React Query for data fetching & caching                 │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS / WSS
                         ▼
┌──────────────────────────────────────────────────────────┐
│                   SUPABASE PLATFORM                       │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Auth       │  │   Database   │  │   Storage       │  │
│  │  (GoTrue)    │  │ (PostgreSQL) │  │  (S3-compat)    │  │
│  └─────────────┘  └──────────────┘  └─────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Edge Functions (Deno)                   │  │
│  │  /api/parse-cv      → OpenAI for CV parsing          │  │
│  │  /api/scan-jobs      → Job board APIs                 │  │
│  │  /api/match-jobs     → AI scoring engine              │  │
│  │  /api/generate-cv    → Tailored CV generation         │  │
│  │  /api/send-outreach  → Email sending                  │  │
│  │  /api/interview-prep → Question generation            │  │
│  │  /api/command        → NL command → action plan       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           Realtime (WebSocket)                       │  │
│  │  Broadcast agent progress & activity logs            │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │  OpenAI    │ │ Job Board  │ │  Email     │
   │  API       │ │ APIs       │ │  Service   │
   │(GPT-4/4o)  │ │(LinkedIn,  │ │(Gmail API/ │
   │            │ │ Indeed,    │ │ SendGrid)  │
   │            │ │ Adzuna)    │ │            │
   └────────────┘ └────────────┘ └────────────┘
```

### Alternative: Self-Hosted Backend

If you prefer **not** to use Supabase, use:
- **Express.js / Fastify** with TypeScript
- **PostgreSQL** with Prisma ORM
- **Redis** for job queues (BullMQ)
- **Socket.io** for real-time updates
- **Multer** for file uploads
- **Passport.js** for auth

---

## 4. API Keys & Services Required

### Essential APIs (Must Have)

| Service | Purpose | Free Tier | Signup URL | Env Variable |
|---|---|---|---|---|
| **OpenAI** | CV parsing, CV generation, job matching, interview questions, command interpretation | $5 free credit (new accounts) | https://platform.openai.com/signup | `OPENAI_API_KEY` |
| **Supabase** | Auth, Database, Storage, Edge Functions, Realtime | 500MB DB, 1GB storage, 500K edge invocations/mo | https://supabase.com/dashboard | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

### Job Board APIs (Pick 1-2)

| Service | Purpose | Free Tier | Signup URL | Env Variable |
|---|---|---|---|---|
| **Adzuna API** | Job search across 16 countries | 250 calls/day free | https://developer.adzuna.com/ | `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` |
| **The Muse API** | Job listings + company profiles | Free (no key needed for basic) | https://www.themuse.com/developers/api/v2 | `MUSE_API_KEY` |
| **JSearch (RapidAPI)** | LinkedIn/Indeed/Glassdoor aggregator | 200 req/mo free | https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch | `RAPIDAPI_KEY` |
| **LinkedIn API** | Job postings (limited access) | Requires partner approval | https://developer.linkedin.com/ | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` |
| **SerpAPI** | Google Jobs scraping | 100 searches/mo free | https://serpapi.com/ | `SERP_API_KEY` |

### Email Services (Pick 1)

| Service | Purpose | Free Tier | Signup URL | Env Variable |
|---|---|---|---|---|
| **SendGrid** | Transactional email sending | 100 emails/day free forever | https://signup.sendgrid.com/ | `SENDGRID_API_KEY` |
| **Resend** | Modern email API | 3,000 emails/mo, 100/day free | https://resend.com/signup | `RESEND_API_KEY` |
| **Gmail API** | Send from user's own Gmail | Free (OAuth required) | https://console.cloud.google.com/ | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| **Mailgun** | Transactional email | 100 emails/day (sandbox) | https://signup.mailgun.com/ | `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` |

### Optional Enhancement APIs

| Service | Purpose | Free Tier | Signup URL | Env Variable |
|---|---|---|---|---|
| **Hunter.io** | Find HR email addresses | 25 searches/mo free | https://hunter.io/users/sign_up | `HUNTER_API_KEY` |
| **Clearbit** | Company enrichment data | 50 lookups/mo free | https://clearbit.com/ | `CLEARBIT_API_KEY` |
| **Glassdoor API** | Interview reviews + salary data | Requires partner access | https://www.glassdoor.com/developer/ | `GLASSDOOR_API_KEY` |
| **Abstract API** | Email verification | 100 verifications/mo free | https://www.abstractapi.com/ | `ABSTRACT_API_KEY` |
| **PDFShift** | HTML → PDF (for CV export) | 250 conversions/mo free | https://pdfshift.io/ | `PDFSHIFT_API_KEY` |
| **Anthropic Claude** | Alternative/better LLM for analysis | $5 free credit | https://console.anthropic.com/ | `ANTHROPIC_API_KEY` |

### Complete `.env` File Template

```env
# ============================================
# SUPABASE
# ============================================
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# ============================================
# AI / LLM
# ============================================
OPENAI_API_KEY=sk-proj-...
# Optional: ANTHROPIC_API_KEY=sk-ant-...

# ============================================
# JOB BOARD APIs (pick one or more)
# ============================================
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
# RAPIDAPI_KEY=your_rapidapi_key
# SERP_API_KEY=your_serp_key

# ============================================
# EMAIL SERVICE (pick one)
# ============================================
RESEND_API_KEY=re_...
# SENDGRID_API_KEY=SG....
# MAILGUN_API_KEY=key-...
# MAILGUN_DOMAIN=mg.yourdomain.com

# ============================================
# OPTIONAL ENRICHMENT
# ============================================
# HUNTER_API_KEY=your_hunter_key
# CLEARBIT_API_KEY=your_clearbit_key
# PDFSHIFT_API_KEY=your_pdfshift_key
```

---

## 5. Backend Implementation

### Option A: Supabase Edge Functions (Recommended)

Create the following Edge Functions in `supabase/functions/`:

#### 5.1 CV Parser — `supabase/functions/parse-cv/index.ts`

```typescript
// Accepts PDF/DOC upload, extracts text, uses OpenAI to parse structured data
// Input: FormData with CV file
// Output: { name, email, phone, skills[], experience[], education[], summary }
// Stores parsed data in `profiles` table
// Stores file in Supabase Storage bucket `cvs`
```

**OpenAI Prompt Strategy:**
```
You are a CV/resume parser. Extract the following structured data from this CV text:
- Full name
- Email, phone, location
- Professional summary (2-3 sentences)
- Skills (array of { skill, proficiency: 1-5, category })
- Experience (array of { company, role, dates, description, technologies[] })
- Education (array of { institution, degree, field, dates })
- Certifications (array)
- Languages (array)

Return as JSON. Be thorough and accurate.
```

#### 5.2 Job Scanner — `supabase/functions/scan-jobs/index.ts`

```typescript
// Calls Adzuna/SerpAPI to fetch jobs matching user criteria
// Input: { role, location, keywords[], remote?, salary_min? }
// Output: { jobs: [{ title, company, location, salary, url, description, posted_date }] }
// Caches results in `jobs` table to avoid duplicate API calls
```

#### 5.3 Matching Engine — `supabase/functions/match-jobs/index.ts`

```typescript
// Takes user profile + job listings, uses OpenAI to score matches
// Input: { profile_id, job_ids[] }
// Output: { matches: [{ job_id, score, reasons[], missing_skills[], cv_suggestions[] }] }
// Stores results in `job_matches` table
```

**OpenAI Prompt Strategy:**
```
You are a job matching engine. Given this candidate profile and job description,
score the match from 0-100 and provide:
- match_score: overall fit percentage
- skill_match: how well skills align
- experience_match: years and relevance
- missing_skills: what the candidate lacks
- cv_suggestions: what to emphasize in a tailored CV
- ats_keywords: important keywords to include
Return as JSON.
```

#### 5.4 CV Generator — `supabase/functions/generate-cv/index.ts`

```typescript
// Generates a tailored CV version for a specific job
// Input: { profile_id, job_id, match_id }
// Output: { cv_html, cv_markdown, ats_score, version_name }
// Stores in `cv_versions` table
```

#### 5.5 Outreach Composer — `supabase/functions/send-outreach/index.ts`

```typescript
// Generates and sends personalized outreach emails
// Input: { profile_id, job_id, match_id, recipient_email?, send: boolean }
// Output: { subject, body, status }
// Uses Resend/SendGrid API to actually send
// Tracks in `outreach_emails` table
```

#### 5.6 Interview Prep — `supabase/functions/interview-prep/index.ts`

```typescript
// Generates company-specific interview prep
// Input: { profile_id, company_name, role }
// Output: { company_questions[], behavioral[], technical[], star_responses[], negotiation }
// Stores in `interview_preps` table
```

#### 5.7 Command Interpreter — `supabase/functions/command/index.ts`

```typescript
// Natural language → structured action plan
// Input: { command: string, user_id }
// Output: { plan: { steps[], estimated_cost, estimated_time, risk_level } }
// Optionally auto-executes if approved
```

#### 5.8 Agent Orchestrator — `supabase/functions/run-pipeline/index.ts`

```typescript
// Orchestrates the full 6-agent pipeline
// Input: { profile_id, trigger: "cv_upload" | "manual" | "command" }
// Output: streams progress via Supabase Realtime
// Calls parse-cv → scan-jobs → match-jobs → generate-cv → send-outreach → interview-prep
```

### Option B: Express.js Backend

```
server/
├── src/
│   ├── index.ts                 # Express app entry
│   ├── config/
│   │   ├── database.ts          # Prisma client
│   │   ├── openai.ts            # OpenAI client
│   │   └── redis.ts             # BullMQ connection
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── cv.routes.ts
│   │   ├── jobs.routes.ts
│   │   ├── applications.routes.ts
│   │   ├── outreach.routes.ts
│   │   ├── interview.routes.ts
│   │   ├── analytics.routes.ts
│   │   ├── settings.routes.ts
│   │   └── command.routes.ts
│   ├── services/
│   │   ├── cv-parser.service.ts
│   │   ├── job-scanner.service.ts
│   │   ├── matching-engine.service.ts
│   │   ├── cv-generator.service.ts
│   │   ├── outreach.service.ts
│   │   ├── interview-prep.service.ts
│   │   └── pipeline-orchestrator.service.ts
│   ├── workers/
│   │   └── pipeline.worker.ts   # BullMQ worker for async pipeline
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── rateLimit.middleware.ts
│   └── utils/
│       ├── encryption.ts        # Encrypt/decrypt API keys
│       └── cost-tracker.ts      # Track OpenAI token usage
├── prisma/
│   └── schema.prisma
├── package.json
└── tsconfig.json
```

---

## 6. Database Schema

### Supabase/PostgreSQL Tables

```sql
-- ============================================
-- USERS & AUTH (Supabase Auth handles this)
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  target_role TEXT,
  target_location TEXT,
  weekly_target INTEGER DEFAULT 25,
  summary TEXT,
  raw_cv_text TEXT,
  skills JSONB DEFAULT '[]',         -- [{skill, proficiency, category}]
  experience JSONB DEFAULT '[]',     -- [{company, role, dates, description, technologies}]
  education JSONB DEFAULT '[]',      -- [{institution, degree, field, dates}]
  certifications JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CV STORAGE
-- ============================================

CREATE TABLE cv_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,           -- Supabase Storage path
  file_size INTEGER,
  mime_type TEXT,
  parsed_data JSONB,                 -- Structured parsed output
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cv_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id),
  version_name TEXT NOT NULL,        -- e.g., "v3.4-supa"
  target_company TEXT,
  cv_content_md TEXT,                -- Markdown content
  cv_content_html TEXT,              -- HTML for PDF generation
  ats_score INTEGER,
  skill_alignment INTEGER,
  keywords_added JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOBS & MATCHING
-- ============================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  external_id TEXT,                  -- ID from job board API
  source TEXT,                       -- 'adzuna', 'linkedin', 'manual'
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  currency TEXT DEFAULT 'EUR',
  description TEXT,
  url TEXT,
  remote BOOLEAN DEFAULT FALSE,
  posted_date DATE,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(external_id, source)
);

CREATE TABLE job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,      -- 0-100
  skill_match INTEGER,
  experience_match INTEGER,
  reasons JSONB DEFAULT '[]',
  missing_skills JSONB DEFAULT '[]',
  cv_suggestions JSONB DEFAULT '[]',
  ats_keywords JSONB DEFAULT '[]',
  matched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPLICATIONS
-- ============================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id),
  cv_version_id UUID REFERENCES cv_versions(id),
  match_id UUID REFERENCES job_matches(id),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  match_score INTEGER,
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'interview', 'rejected', 'follow-up', 'offer', 'accepted')),
  confidence INTEGER,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact TIMESTAMPTZ,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OUTREACH
-- ============================================

CREATE TABLE outreach_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  company TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'opened', 'replied', 'bounced')),
  opens INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  follow_up_date DATE,
  email_provider_id TEXT,            -- SendGrid/Resend message ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INTERVIEW PREP
-- ============================================

CREATE TABLE interview_preps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  company_questions JSONB DEFAULT '[]',
  behavioral_questions JSONB DEFAULT '[]',
  technical_challenges JSONB DEFAULT '[]',
  star_responses JSONB DEFAULT '[]',
  negotiation_strategy JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENT PIPELINE
-- ============================================

CREATE TABLE pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trigger TEXT NOT NULL,             -- 'cv_upload', 'manual', 'command', 'scheduled'
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'failed')),
  current_agent INTEGER DEFAULT 0,
  total_agents INTEGER DEFAULT 6,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,4) DEFAULT 0,
  total_time_ms INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error TEXT
);

CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_run_id UUID REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  agent_index INTEGER NOT NULL,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  task TEXT,
  reasoning TEXT,
  tools_used JSONB DEFAULT '[]',
  confidence INTEGER,
  next_action TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0,
  duration_ms INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- SETTINGS
-- ============================================

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  api_budget_daily DECIMAL(10,2) DEFAULT 20.00,
  email_limit_daily INTEGER DEFAULT 15,
  personalization_depth TEXT DEFAULT 'high' CHECK (personalization_depth IN ('low', 'medium', 'high')),
  ats_strictness INTEGER DEFAULT 70,
  human_approval_required BOOLEAN DEFAULT TRUE,
  risk_tolerance TEXT DEFAULT 'balanced' CHECK (risk_tolerance IN ('safe', 'balanced', 'aggressive')),
  -- Encrypted API keys (user-provided overrides)
  encrypted_linkedin_key TEXT,
  encrypted_jobboard_key TEXT,
  encrypted_email_key TEXT,
  encrypted_llm_key TEXT,
  encrypted_emailfinder_key TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS / COST TRACKING
-- ============================================

CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  applications_sent INTEGER DEFAULT 0,
  interviews_received INTEGER DEFAULT 0,
  responses_received INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  api_cost DECIMAL(10,4) DEFAULT 0,
  UNIQUE(user_id, date)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_preps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: users can only access their own data
CREATE POLICY "Users can view own data" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON profiles FOR UPDATE USING (auth.uid() = id);
-- (Repeat similar policies for all tables with user_id column)
```

---

## 7. Frontend Refactoring

### 7.1 Install Additional Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 7.2 Supabase Client Setup

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 7.3 Auth Context

Create `src/contexts/AuthContext.tsx` — wrap app with auth provider, redirect unauthenticated users to login page.

### 7.4 API Service Layer

Create `src/services/` directory:

```
src/services/
├── api.ts              # Base fetch wrapper with auth headers
├── cv.service.ts       # uploadCV(), getVersions(), downloadPDF()
├── jobs.service.ts     # scanJobs(), getMatches()
├── applications.service.ts  # CRUD operations
├── outreach.service.ts      # sendEmail(), getStatus()
├── interview.service.ts     # generatePrep(), getPrepById()
├── analytics.service.ts     # getDailyStats(), getAgentPerf()
├── settings.service.ts      # getSettings(), updateSettings(), saveApiKeys()
├── pipeline.service.ts      # startPipeline(), getPipelineStatus()
└── command.service.ts       # executeCommand()
```

### 7.5 React Query Integration

Each page replaces hardcoded data with React Query hooks:

```typescript
// Example: src/hooks/useApplications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApplications, updateApplication } from '@/services/applications.service'

export function useApplications(filter?: string) {
  return useQuery({
    queryKey: ['applications', filter],
    queryFn: () => getApplications(filter),
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}
```

### 7.6 Real-Time Pipeline Updates

Use Supabase Realtime to subscribe to `agent_logs` and `pipeline_runs` tables:

```typescript
// In AgentWorkflow.tsx
useEffect(() => {
  const channel = supabase
    .channel('pipeline-updates')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'agent_logs',
      filter: `pipeline_run_id=eq.${runId}`
    }, (payload) => {
      // Update agent status in real-time
      updateAgentFromLog(payload.new)
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [runId])
```

---

## 8. Feature-by-Feature Implementation

### 8.1 CV Upload & Parsing (Dashboard)

**Flow:**
1. User drops CV file → `CVUpload.tsx`
2. Frontend uploads file to Supabase Storage bucket `cvs/`
3. Frontend calls Edge Function `/parse-cv` with file path
4. Edge Function downloads file, extracts text (use `pdf-parse` for PDF)
5. Sends text to OpenAI GPT-4o with structured extraction prompt
6. Saves parsed profile to `profiles` table
7. Returns structured data to frontend
8. Frontend auto-triggers pipeline

**Key Code Changes:**
- `CVUpload.tsx`: Add `supabase.storage.from('cvs').upload()` call
- Create `src/services/cv.service.ts` with `parseCV()` function

### 8.2 Agent Pipeline (Dashboard)

**Flow:**
1. Pipeline starts → creates `pipeline_runs` row
2. Each agent runs sequentially via Edge Functions
3. Each agent creates/updates `agent_logs` row
4. Frontend subscribes to Realtime changes on `agent_logs`
5. Progress bars update from real data instead of fake timers
6. On completion, all generated data is in the respective tables

**Key Code Changes:**
- `AgentWorkflow.tsx`: Replace `setInterval` simulation with Supabase Realtime subscription
- `ActivityLog.tsx`: Subscribe to `agent_logs` table inserts

### 8.3 Applications Tracking

**Flow:**
1. Applications created automatically by Outreach Agent
2. Users can also manually add applications
3. Status updates via dropdown (sent → interview → offer)
4. Last contact timestamp auto-updates

**Key Code Changes:**
- `Applications.tsx`: Replace hardcoded `data` array with `useQuery` hook
- Add CRUD operations (create, update status, delete)
- Add real-time updates via Supabase Realtime

### 8.4 CV Versions

**Flow:**
1. Personalization Agent generates tailored CVs during pipeline
2. Each version stored with ATS score, skill alignment, keywords
3. "Download PDF" button generates PDF via PDFShift API or client-side `html2pdf`
4. Users can edit/refine versions

**Key Code Changes:**
- `CVVersions.tsx`: Fetch from `cv_versions` table
- Add PDF download using generated HTML content
- Add edit/refine functionality with AI assist

### 8.5 Job Intelligence

**Flow:**
1. Background cron or manual trigger calls Adzuna/SerpAPI
2. OpenAI analyzes trends from aggregated data
3. Insights stored in `job_insights` table
4. Frontend fetches and displays cards

**Key Code Changes:**
- `JobIntelligence.tsx`: Replace hardcoded insights with API data
- Add refresh button to trigger new scan
- Add filters (location, role, time range)

### 8.6 Outreach Automation

**Flow:**
1. Outreach Agent composes emails during pipeline
2. Emails stored as drafts in `outreach_emails`
3. If `human_approval_required` is ON → user reviews and approves
4. If OFF → auto-sends via Resend/SendGrid
5. Webhook tracks opens/clicks/bounces (SendGrid webhooks)
6. Follow-up emails auto-queued based on `follow_up_date`

**Key Code Changes:**
- `Outreach.tsx`: Fetch from `outreach_emails` table
- Add "Approve & Send" / "Edit" buttons
- Add email tracking via webhooks

### 8.7 Interview Prep

**Flow:**
1. Interview Prep Agent generates content during pipeline
2. Company-specific questions via OpenAI (with company context scraped from website)
3. STAR responses refined iteratively
4. Negotiation data from salary APIs

**Key Code Changes:**
- `InterviewPrep.tsx`: Fetch from `interview_preps` table
- Add interactive practice mode (AI as interviewer via streaming)
- "Start Practice Session" button opens a chat interface

### 8.8 Analytics

**Flow:**
1. `daily_analytics` table updated by triggers whenever applications/emails are created
2. Agent performance computed from `agent_logs` aggregations
3. Cost tracking from `pipeline_runs` cost column

**Key Code Changes:**
- `Analytics.tsx`: Replace hardcoded data with real queries
- Add date range selector
- Charts populate from real data

### 8.9 Control Tower

**Flow:**
1. Settings read from `user_settings` table on mount
2. Changes saved on toggle/slider change (debounced)
3. Real-time cost from `daily_analytics` for today

**Key Code Changes:**
- `ControlTower.tsx`: Load/save settings via `useSettings()` hook
- Real cost tracking from DB

### 8.10 Command Bar

**Flow:**
1. User types natural language command
2. Frontend sends to `/command` Edge Function
3. OpenAI interprets command → structured action plan
4. Plan displayed for user approval
5. On approval → orchestrator executes each step
6. Real-time updates via Realtime

**Key Code Changes:**
- `CommandBar.tsx`: Replace hardcoded `examplePlan` with real API call
- "Approve & Execute" triggers real pipeline
- "Modify" allows editing plan before execution

### 8.11 Settings

**Flow:**
1. API keys encrypted with AES-256 before storing in DB
2. Decrypted on server-side only when needed
3. Validate keys by making a test API call on save
4. CRUD for settings

**Key Code Changes:**
- `Settings.tsx`: Connect to `user_settings` table
- "Save Credentials" actually persists encrypted keys
- Add validation feedback (green check = valid key)

---

## 9. Authentication & Security

### Auth Implementation

```typescript
// src/pages/Login.tsx
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md glass rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gradient mb-6">CareerOS</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']}
          theme="dark"
        />
      </div>
    </div>
  )
}
```

### Security Checklist

- [x] Row-Level Security (RLS) on all tables
- [x] API keys encrypted at rest (AES-256-GCM)
- [x] Rate limiting on Edge Functions
- [x] CORS configured for frontend domain only
- [x] Environment variables for all secrets
- [x] Input validation with Zod schemas
- [x] SQL injection prevention (Supabase parameterized queries)
- [x] XSS prevention (React auto-escapes)
- [x] CSRF protection (Supabase handles via JWT)

---

## 10. Deployment

### Frontend (Vercel / Netlify)

```bash
# Build
npm run build

# Deploy to Vercel
npx vercel --prod

# Or Netlify
npx netlify deploy --prod --dir=dist
```

### Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Init project
supabase init

# Link to remote project
supabase link --project-ref your-project-ref

# Push database schema
supabase db push

# Deploy Edge Functions
supabase functions deploy parse-cv
supabase functions deploy scan-jobs
supabase functions deploy match-jobs
supabase functions deploy generate-cv
supabase functions deploy send-outreach
supabase functions deploy interview-prep
supabase functions deploy command
supabase functions deploy run-pipeline

# Set secrets
supabase secrets set OPENAI_API_KEY=sk-proj-...
supabase secrets set ADZUNA_APP_ID=...
supabase secrets set ADZUNA_APP_KEY=...
supabase secrets set RESEND_API_KEY=re_...
```

### Self-Hosted Alternative (Express Backend)

```bash
# Deploy backend to Railway/Render/Fly.io
# Deploy frontend to Vercel/Netlify
# Database: Neon.tech / Supabase / Railway Postgres
```

---

## 11. The Single Prompt

> **Copy everything below this line and paste it into your AI coding agent (Cursor, Lovable, etc.) to implement the entire backend and refactor the frontend.**

---

```
I have an existing React + TypeScript + Vite + Tailwind + shadcn/ui frontend project called "CareerOS" — an AI-powered job acquisition command center. Currently ALL data is hardcoded with no backend. I need you to implement a full working backend and refactor the frontend to use real data.

## What to implement:

### 1. SUPABASE SETUP
- Initialize Supabase client in `src/lib/supabase.ts`
- Use env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- Install: @supabase/supabase-js, @supabase/auth-ui-react, @supabase/auth-ui-shared

### 2. DATABASE (Create these tables with RLS policies):
- `profiles` — user profile with parsed CV data (skills JSONB, experience JSONB, education JSONB)
- `cv_uploads` — uploaded CV files metadata
- `cv_versions` — AI-generated tailored CV versions (ats_score, skill_alignment, content)
- `jobs` — job listings from APIs (title, company, location, salary, description, source)
- `job_matches` — AI match scores (match_score, reasons, missing_skills, ats_keywords)
- `applications` — tracked applications (status: draft/sent/interview/rejected/follow-up/offer)
- `outreach_emails` — email campaigns (status: draft/sent/opened/replied/bounced, opens count)
- `interview_preps` — AI-generated prep (company_questions, behavioral, technical, star_responses, negotiation)
- `pipeline_runs` — agent pipeline execution tracking
- `agent_logs` — individual agent execution logs (task, reasoning, tools, confidence)
- `user_settings` — control tower settings + encrypted API keys
- `daily_analytics` — daily stats aggregation
All tables must have user_id FK, RLS enabled, policy: users can only CRUD their own rows.

### 3. AUTH
- Add login page at `/login` with Supabase Auth UI (Google + GitHub providers, dark theme)
- Create AuthContext provider wrapping the app
- Protected routes: redirect to /login if not authenticated
- Auto-create profile row on first signup

### 4. SUPABASE EDGE FUNCTIONS (Create 8 functions):

**a) parse-cv**: Accept PDF upload, extract text (pdf-parse), send to OpenAI GPT-4o with prompt: "Extract structured CV data: name, email, skills[], experience[], education[], summary. Return JSON." Save parsed data to profiles table, file to Storage bucket.

**b) scan-jobs**: Call Adzuna API (ADZUNA_APP_ID, ADZUNA_APP_KEY env vars) to search jobs. Input: {role, location, keywords}. Cache results in jobs table. Fallback: if no API key, generate mock jobs via OpenAI.

**c) match-jobs**: Take profile + jobs, use OpenAI to score each match 0-100 with reasons, missing_skills, cv_suggestions. Store in job_matches table.

**d) generate-cv**: Take profile + job description, use OpenAI to create a tailored CV version in markdown + HTML. Compute ATS score. Store in cv_versions table.

**e) send-outreach**: Compose personalized email via OpenAI. If RESEND_API_KEY exists, actually send via Resend API. Track in outreach_emails table. Auto-schedule follow-up.

**f) interview-prep**: Generate company-specific questions, behavioral STAR scenarios, technical challenges, and negotiation strategy via OpenAI. Store in interview_preps table.

**g) command**: Accept natural language command string, use OpenAI to parse into structured action plan with steps, estimated cost, and risk level. Return plan for user approval.

**h) run-pipeline**: Orchestrate all agents sequentially. Create pipeline_run row, then call parse-cv → scan-jobs → match-jobs → generate-cv → send-outreach → interview-prep. Update agent_logs rows for each step. Use Supabase Realtime to broadcast progress.

### 5. FRONTEND REFACTORING

**Service layer** — Create `src/services/` with typed functions for every API call using supabase client.

**React Query hooks** — Create `src/hooks/` with useQuery/useMutation hooks for each entity.

**Page changes:**
- `Index.tsx (Dashboard)`: CVUpload uploads to Storage + triggers parse-cv Edge Function, then run-pipeline. AgentWorkflow subscribes to Supabase Realtime on agent_logs table for live progress. ActivityLog renders real agent_logs.
- `Applications.tsx`: Fetch from applications table with useQuery. Real CRUD. Status filter works on real data.
- `CVVersions.tsx`: Fetch from cv_versions table. "Download PDF" generates PDF from stored HTML using window.print() or html2canvas.
- `JobIntelligence.tsx`: Fetch insights from a view/function that aggregates job market data. Add "Refresh" button to trigger scan-jobs.
- `Outreach.tsx`: Fetch from outreach_emails table. Add "Send" / "Approve" buttons. Show real open tracking.
- `InterviewPrep.tsx`: Fetch from interview_preps table. "Start Practice Session" opens chat-style AI practice.
- `Analytics.tsx`: Compute stats from daily_analytics + agent_logs tables. Charts use real data.
- `ControlTower.tsx`: Load/save from user_settings table. Real cost from daily_analytics.
- `CommandBar.tsx`: Call /command Edge Function on submit. Display real plan. "Execute" triggers run-pipeline.
- `Settings.tsx`: Save encrypted API keys to user_settings. Validate keys on save. Show green checkmark for valid.
- `StrategyCard.tsx`: Display data from profiles table (target_role, target_location, etc.).

### 6. REALTIME
- Subscribe to `agent_logs` INSERT events in AgentWorkflow component
- Subscribe to `pipeline_runs` UPDATE events for overall progress
- Subscribe to `outreach_emails` UPDATE events for open tracking

### 7. STORAGE
- Create Supabase Storage bucket `cvs` (private, 10MB max, PDF/DOC/DOCX only)
- Upload CV files there, store path in cv_uploads table

### 8. ENV VARS NEEDED
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (frontend)
OPENAI_API_KEY, ADZUNA_APP_ID, ADZUNA_APP_KEY, RESEND_API_KEY (Edge Functions secrets)

### IMPORTANT RULES:
- Keep existing UI design, styling, and animations intact
- Use TypeScript throughout with proper types
- Use React Query (already installed as @tanstack/react-query) for all data fetching
- Validate all inputs with Zod (already installed)
- Handle loading/error states in all components
- Add toast notifications for success/error using the existing sonner setup
- Keep the glass morphism dark theme styling
- If an external API key is missing, gracefully degrade (show placeholder data + prompt to add key in Settings)
```

---

## 12. Cost Estimation

### Development Time

| Component | Estimated Time |
|---|---|
| Supabase setup + schema | 2-3 hours |
| Auth implementation | 1-2 hours |
| 8 Edge Functions | 8-12 hours |
| Frontend refactoring | 6-8 hours |
| Real-time integration | 2-3 hours |
| Testing & debugging | 4-6 hours |
| **Total** | **23-34 hours** |

### Monthly Running Costs (Solo User)

| Service | Free Tier | Over Free Tier |
|---|---|---|
| Supabase | $0 (generous free tier) | $25/mo Pro |
| OpenAI GPT-4o | ~$5-15/mo (depends on usage) | Pay per token |
| Adzuna API | $0 (250 calls/day) | Contact sales |
| Resend | $0 (3K emails/mo) | $20/mo |
| Vercel hosting | $0 (hobby) | $20/mo Pro |
| **Total (free tiers)** | **$5-15/mo** (OpenAI only) | |

### Token Cost Breakdown Per Pipeline Run

| Agent | Input Tokens | Output Tokens | Estimated Cost |
|---|---|---|---|
| CV Parser | ~3,000 | ~1,500 | $0.02 |
| Job Scanner | ~500 | ~200 | API call cost |
| Matching Engine (per job) | ~2,000 | ~500 | $0.01/job |
| CV Generator (per job) | ~3,000 | ~2,000 | $0.03/version |
| Outreach Composer | ~1,500 | ~800 | $0.01/email |
| Interview Prep | ~2,000 | ~3,000 | $0.03 |
| **Total (8 jobs)** | | | **~$0.40-0.60** |

---

## Quick Start Checklist

1. [ ] Create Supabase project at https://supabase.com/dashboard
2. [ ] Get OpenAI API key at https://platform.openai.com
3. [ ] Get Adzuna API credentials at https://developer.adzuna.com
4. [ ] Get Resend API key at https://resend.com
5. [ ] Create `.env` file with all keys (use template above)
6. [ ] Run the SQL schema in Supabase SQL Editor
7. [ ] Create Storage bucket `cvs` in Supabase Dashboard
8. [ ] Deploy Edge Functions with `supabase functions deploy`
9. [ ] Set Edge Function secrets with `supabase secrets set`
10. [ ] Run `npm install` to add Supabase packages
11. [ ] Use "The Single Prompt" (Section 11) to implement everything
12. [ ] Test: Upload a real CV and watch the pipeline run

---

*This document was generated for the CareerOS project. Last updated: February 2026.*
