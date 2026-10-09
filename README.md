# LifePilot AI — Everyday Life Problem Solver & Smart Task Planner

> **HackNowa Global Hackathon 2026 Submission**  
> **Theme:** AI for Everyday Life — Build an AI-powered solution that solves a practical problem faced by individuals or communities.

---

## 1. Problem Statement
Every day, individuals, students, professionals, and community leaders face overwhelming tasks and responsibilities:
- An upcoming exam with only 10 days to study and no clear structure
- Piles of household chores and disorganization leading to cognitive overload
- Rising monthly expenses with impulsive spending and lack of a practical budget
- Jam-packed, chaotic daily schedules triggering burnout
- Job interviews requiring structured prep under tight deadlines
- Community cleanliness drives needing coordinated volunteer execution
- Prioritization paralysis: having many tasks and not knowing which one to tackle first

Traditional tools either act as passive to-do lists (which require users to already know how to break down complex problems) or generic chatbots (which return high-level motivational text or fluff without structured execution).

---

## 2. The Solution: LifePilot AI
**LifePilot AI** acts as a practical everyday co-pilot that turns natural-language problems into structured, actionable game plans with measurable execution:

```
USER'S REAL-LIFE PROBLEM
         ↓
AI UNDERSTANDS THE PROBLEM (Root Diagnostic)
         ↓
AI IDENTIFIES HIGH-LEVERAGE PRIORITIES (80/20 Rule)
         ↓
AI CREATES A PRACTICAL ACTION PLAN (Steps, Time, Deadlines)
         ↓
USER CONVERTS PLAN INTO SMART TASKS
         ↓
DASHBOARD TRACKS PROGRESS DYNAMICALLY
```

Rather than a conversational gimmick, LifePilot AI is an end-to-end everyday productivity and problem-solving product.

---

## 3. Key Features

1. **AI Everyday Problem Solver**:
   - Large natural-language input for any daily challenge.
   - Categorized across 8 everyday domains: *Study, Work, Personal, Finance, Health & Fitness, Household, Community, Other*.
   - Direct, realistic, structured solutions without generic platitudes.
   - Generates:
     - Diagnostic understanding of the friction points
     - Top 3 high-leverage strategic priorities
     - Step-by-step action plan with clear verb titles, descriptions, priorities, time estimates, and deadlines
     - Suggested timeline breakdown
     - Pragmatic pro tips
     - Preempted obstacles and concrete countermeasures
     - Immediate micro-action (3-5 minutes) to break inertia right now.

2. **Smart Task Planner**:
   - One-click "Convert Plan to Tasks" or add individual steps.
   - Interactive checklist with status toggles (Pending, In Progress, Completed).
   - Priority badges (High, Medium, Low), estimated execution times, suggested deadlines, and category tags.
   - Quick custom task creation.
   - Status and category filtering.

3. **Dynamic Daily Dashboard**:
   - Real-time statistics: Total Tasks, Completed Tasks, Pending Tasks, High Priority Tasks.
   - Dynamic progress percentage bar.
   - "Next Up" priority focus card for immediate action.
   - Category breakdown visualizing effort across life areas.

4. **Interactive AI Follow-up & Refinement**:
   - Full context-aware follow-up assistance.
   - One-click prompt chips: *"Make this plan easier", "Reduce this to 3 steps", "Give me a one-day version", "What should I do first?", "I completed the first task. What next?"*
   - Automatic ability to sync revised steps directly into the Task Planner.

5. **Local Storage Persistence**:
   - Automatically saves tasks, current action plan, previous plans history, follow-up messages, and theme preferences in the browser.
   - Data persists across page refreshes.

6. **Quick Help & Everyday Presets**:
   - Instant clickable real-world scenarios for rapid testing and demonstration.

7. **Responsive & Modern Design**:
   - Clean, professional typography with Plus Jakarta Sans.
   - Accessible contrast, clean unboxed metadata with subtle typographic separators.
   - Light and Dark mode support.
   - Fluid responsive layout for mobile, tablet, and desktop.

---

## 4. How AI is Used
LifePilot AI leverages Google's **Gemini 3.8 Flash** model via the official `@google/genai` TypeScript SDK:
- **Server-Side Security**: All Gemini calls run on the secure Node.js/Express backend. The `GEMINI_API_KEY` is never exposed to the client.
- **Strict Structured JSON Schema**: The backend utilizes Gemini's `responseSchema` with type-safe properties ensuring consistent, parseable outputs without Markdown hallucinations or formatting errors.
- **Domain-Tailored System Prompting**: Instructs the model to avoid platitudes and prioritize cognitive de-escalation, time estimation realism, and friction preemption.

---

## 5. Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, tsx
- **AI SDK**: `@google/genai` (Gemini 3.8 Flash)
- **Storage**: Browser `localStorage` with automated state synchronization

---

## 6. Architecture

```
┌────────────────────────────────────────────────────────┐
│                   LifePilot AI Web App                 │
│  React 19 SPA · Tailwind CSS · TypeScript · Lucide    │
│  (Navbar, Problem Solver, Plan View, Tasks, Dashboard) │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST (JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express Backend                      │
│             (/api/solve, /api/follow-up)               │
└───────────────────────────┬────────────────────────────┘
                            │ @google/genai SDK
                            │ model: gemini-3.8-flash
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Google Gemini API                    │
│   (Diagnostic Reasoning, Task Synthesis, Schema Mode)  │
└────────────────────────────────────────────────────────┘
```

---

## 7. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="your_gemini_api_key_here"

# PORT: Server port (defaults to 3000)
PORT=3000
```

---

## 8. Setup & How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository and navigate to the project directory
npm install
```

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with Vite middleware mounted.

### Production Build
```bash
npm run build
npm start
```

---

## 9. API Endpoints

### 1. `POST /api/solve`
Analyzes an everyday problem and returns a structured action plan.

**Request Body:**
```json
{
  "problem": "I have an exam in 10 days and don't know how to organize my study.",
  "category": "Study"
}
```

**Response Body:**
```json
{
  "id": "plan-1727334400",
  "problem": "I have an exam in 10 days...",
  "category": "Study",
  "createdAt": "2026-09-26T00:00:00.000Z",
  "problemUnderstanding": "...",
  "keyPriorities": ["...", "...", "..."],
  "actionSteps": [
    {
      "id": "step-1",
      "name": "Audit syllabus weightage",
      "description": "...",
      "priority": "High",
      "estimatedTime": "25 mins",
      "suggestedDeadline": "Today"
    }
  ],
  "suggestedTimeline": "...",
  "usefulTips": ["..."],
  "potentialObstacles": [
    {
      "obstacle": "...",
      "solution": "..."
    }
  ],
  "simpleNextAction": "Open past papers and list the 3 topics with highest marks.",
  "summary": "..."
}
```

### 2. `POST /api/follow-up`
Maintains conversation memory and adjusts the plan based on follow-up questions.

**Request Body:**
```json
{
  "problem": "...",
  "category": "Study",
  "plan": { ... },
  "messages": [
    { "role": "user", "content": "Reduce this to 3 steps." }
  ],
  "question": "Reduce this to 3 steps."
}
```

### 3. `GET /api/health`
Health check verifying server status and API key configuration.

---

## 10. Verification & Complete User Flow
1. **Open the website**: View the hero problem solver, categories, and quick examples.
2. **Enter an everyday problem or pick a preset**: E.g., *"I have an exam in 10 days and don't know how to organize my study."*
3. **Select a category**: Choose *Study*.
4. **Generate an AI solution**: Click *"Solve My Problem"*.
5. **Review the generated plan**: View the diagnostic understanding, 3 key priorities, step-by-step action plan, pro tips, obstacles, and immediate 3-5 minute micro-action.
6. **Convert into tasks**: Click *"Convert Plan to Tasks"* to populate the Smart Task Planner.
7. **Complete tasks**: Toggle completion checkboxes and view dynamic progress calculations.
8. **Verify dashboard statistics**: Switch to the Dashboard tab to see updated metrics, completion percentage, and category distribution.
9. **Ask an AI follow-up question**: E.g., *"Make this plan easier"* or *"Reduce this to 3 steps"*, and click *"Update My Task Planner"*.
10. **Refresh the page**: Confirm that all tasks and plans persist seamlessly via localStorage.

---

## 11. Future Improvements
- Multi-calendar sync (Google Calendar / iCal export).
- Push notifications for task deadlines.
- Voice input / speech-to-text for on-the-go problem describing.
- Collaborative shared community plans for neighborhood projects.

---

## 12. Hackathon Information
- **Event**: HackNowa Global Hackathon 2026
- **Category**: AI for Everyday Life
- **Project**: LifePilot AI
