<div align="center">

# 🎨 InternHUB — Frontend

### React 19 + Vite · AI-Powered Internship Skill Matching Platform

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)](https://vite.dev)
[![React Router](https://img.shields.io/badge/React%20Router-v7-red?logo=reactrouter)](https://reactrouter.com)
[![Axios](https://img.shields.io/badge/Axios-1.x-blue)](https://axios-http.com)
[![Groq](https://img.shields.io/badge/Groq-llama3--8b-orange)](https://groq.com)

</div>

---

## 📁 Project Structure

```
frontend/
├── public/                      ← Static assets (favicon)
├── src/
│   ├── assets/                  ← Images / SVGs
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx           ← Sticky navbar with glassmorphism scroll effect
│   │   │   └── Navbar.css
│   │   └── student/
│   │       ├── InternshipCard.jsx   ← Match score badge, skill tags, apply button
│   │       ├── InternshipCard.css
│   │       ├── FilterSidebar.jsx    ← Domain, location, stipend, match % sliders
│   │       ├── FilterSidebar.css
│   │       ├── InternshipModal.jsx  ← Detail panel; triggers SkillAssessment on apply ★
│   │       ├── InternshipModal.css
│   │       ├── SkillAssessment.jsx  ← NEW: full-screen AI quiz overlay ★
│   │       └── SkillAssessment.css  ← NEW: premium assessment styles ★
│   ├── context/
│   │   └── AuthContext.jsx      ← JWT state, login/logout, role helpers
│   ├── pages/
│   │   ├── LandingPage.jsx      ← Marketing landing (7 sections + footer)
│   │   ├── LandingPage.css
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx            ← Split-screen login
│   │   │   ├── RegisterStudentPage.jsx  ← 2-step student registration
│   │   │   ├── RegisterRecruiterPage.jsx
│   │   │   └── AuthPages.css
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx     ← Match results + Top 3 + filters ★
│   │   │   ├── StudentDashboard.css
│   │   │   ├── ProfileSetup.jsx         ← Completion ring, skills, resume
│   │   │   ├── ProfileSetup.css
│   │   │   ├── MyApplications.jsx
│   │   │   └── MyApplications.css
│   │   └── recruiter/
│   │       ├── RecruiterDashboard.jsx   ← Post/manage internships
│   │       ├── RecruiterDashboard.css
│   │       ├── PostInternship.jsx       ← 3-section internship form
│   │       ├── PostInternship.css
│   │       ├── ViewApplicants.jsx       ← Applicants ranked by assessment score ★
│   │       └── ViewApplicants.css       ← Assessment score badge styles ★
│   ├── services/
│   │   ├── api.js               ← Axios base with JWT interceptor + 401 redirect
│   │   ├── authService.js       ← Login, register API calls
│   │   ├── studentService.js    ← Profile, matches, apply (with score) ★
│   │   ├── recruiterService.js  ← Post, list, delete, view applicants
│   │   └── groqService.js       ← NEW: Groq API utility for MCQ generation ★
│   ├── App.jsx                  ← Router setup + ProtectedRoute / PublicOnlyRoute
│   ├── main.jsx                 ← React DOM entry point
│   └── index.css                ← Global design system (tokens, buttons, cards...)
├── index.html                   ← HTML entry with SEO meta tags
├── vite.config.js
├── .env                         ← VITE_API_URL + VITE_GROQ_API_KEY ★
├── .gitignore
└── README.md
```

> ★ = modified or added as part of the AI Skill Assessment feature

---

## ⚡ Getting Started

### Prerequisites

- Node.js **18+** (`node -v`)
- npm **9+** (`npm -v`)
- Backend running at `http://localhost:8080` (see `../backend/README.md`)
- **Groq API Key** — free at [console.groq.com](https://console.groq.com) → API Keys

### Install & Run

```bash
# Install dependencies
npm install
```

Add your Groq API key to `.env`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

```bash
# Start development server
npm run dev
```

→ Opens at **http://localhost:5173**

> 💡 Without a valid `VITE_GROQ_API_KEY`, the assessment overlay will show an error screen. The student can cancel and the modal closes — no other functionality is affected.

### Stopping the Application

Press `Ctrl + C` in its terminal window. To forcefully kill port 5173:

```powershell
# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -Force
```

*(Or: `npx kill-port 5173`)*

### Build for Production

```bash
npm run build       # Outputs to dist/
npm run preview     # Preview production build locally
```

---

## 🌐 Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Login | Public (redirects if logged in) |
| `/register/student` | Student Registration (2-step) | Public |
| `/register/recruiter` | Recruiter Registration | Public |
| `/student/dashboard` | Match Dashboard | `STUDENT` only |
| `/student/profile` | Profile View | `STUDENT` only |
| `/student/profile/edit` | Profile Setup/Edit | `STUDENT` only |
| `/student/applications` | My Applications | `STUDENT` only |
| `/recruiter/dashboard` | Recruiter Dashboard | `RECRUITER` only |
| `/recruiter/post` | Post Internship | `RECRUITER` only |
| `/recruiter/applicants/:id` | View Applicants (ranked by score) | `RECRUITER` only |

---

## 🧠 AI Skill Assessment — `SkillAssessment.jsx`

The `SkillAssessment` component is a full-screen overlay with three distinct phases:

| Phase | What Happens |
|-------|-------------|
| **Loading** | Floating brain animation while Groq generates 15 MCQs (~3–5s) |
| **Quiz** | One question at a time. Dot navigator, 10:00 countdown timer (turns red at <60s), progress bar |
| **Submitting** | Spinner while score is sent to backend with the application |

**Timer behaviour:** At `00:00`, the quiz auto-submits with whatever answers have been selected.

**Score calculation:** Done client-side by comparing each selected option letter against `correctAnswer` from the Groq response.

### `groqService.js` — Groq API Utility

```js
generateAssessmentQuestions(requiredSkills, role, companyName)
  // → Promise<Array<{ question, options: string[], correctAnswer: string }>>
```

- Model: `llama3-8b-8192`
- Temperature: `0.4` (balanced creativity/accuracy)
- System prompt enforces **strict JSON-only output** — no markdown, no preamble
- Automatically strips accidental code fences from the response

---

## 🔐 Authentication Flow

```
Login / Register
      ↓
  AuthContext.login(response)
      ↓
  localStorage: token + user
      ↓
  api.js interceptor adds
  "Authorization: Bearer <token>"
  to every request
      ↓
  401 → auto logout + redirect /login
```

---

## 🎨 Design System

Defined in [`src/index.css`](./src/index.css) using CSS variables.

```css
/* 60% — Dominant Backgrounds */
--color-white:     #FFFFFF
--color-bg-soft:   #FFF7ED

/* 30% — Text & Structure */
--color-text-primary:    #111827
--color-text-secondary:  #6B7280
--color-border:          #E5E7EB

/* 10% — Accent / CTA */
--color-orange:       #F97316
--color-orange-dark:  #EA580C
--color-orange-light: #FFEDD5
```

**Typography:** Plus Jakarta Sans (Google Fonts)

### Available CSS Utilities

| Class | Description |
|-------|-------------|
| `.btn-primary` | Orange filled button |
| `.btn-outline` | Border button |
| `.btn-outline-orange` | Orange border + text |
| `.card` | White card with hover lift |
| `.badge-orange/green/blue/gray` | Colored badge chips |
| `.form-input`, `.form-select` | Styled inputs |
| `.animate-fadeInUp`, `.animate-float` | Keyframe animations |
| `.skeleton` | Loading shimmer effect |

---

## 📦 Dependencies

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^7.x",
  "axios": "^1.x",
  "react-hot-toast": "^2.x",
  "lucide-react": "^1.x"
}
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Spring Boot backend base URL |
| `VITE_GROQ_API_KEY` | *(required)* | Groq API key for AI assessment generation |

Edit [`.env`](./.env) to configure both variables. Get a free Groq key at **[console.groq.com](https://console.groq.com)**.
