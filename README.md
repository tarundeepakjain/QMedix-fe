# QMedix Frontend 🏥
### Smart Healthcare Appointment & Queue Management System

QMedix is a modern, high-performance role-based queue management client designed to bridge the gap between online appointment bookings and walk-in patients in clinical environments. Built on top of React 19, Vite, Tailwind CSS, and Supabase Realtime, it provides instantaneous state synchronizations and persistent digital token tracking.

---

## 🚀 Key Features

* **⚡ Real-Time Low-Latency Updates**: Integrates Supabase Realtime WebSocket subscriptions to process state updates in **sub-100ms** latency directly in client-side memory, bypassing heavy API round-trips.
* **🎫 Universal Static Tokens**: Implements a chronological sequencing algorithm ensuring that patients receive a persistent token number (e.g., `Q-3`) that is identical across Patient, Doctor, Receptionist, and Admin dashboards and remains unaffected by emergency overrides.
* **🚨 Emergency Priority Overrides**: Front-desk staff can flag emergency walk-ins, causing them to bubble to the front of the active waiting queue instantly while leaving standard token values stable.
* **👥 Role-Based Access Control (RBAC)**: Secure dashboard views tailored specifically for:
  * **Patients**: Register, book time-slots, view live queue position, serving token, and historical records.
  * **Doctors**: Control active sessions, call the next patient, write diagnoses, and complete consultations.
  * **Staff (Receptionists)**: Register walk-ins, assign doctors, and flag emergencies.
  * **Admins**: View department workloads, manage staff directories, and approve credentials.
* **🌗 Adaptive UI**: Full high-contrast Dark Mode support optimized for clinical settings.

---

## 📂 Project Directory Structure

```bash
├── docs/                      # SDLC Lifecycle Documentation
│   ├── SDLC_PLANNING.md       # Project charter, feasibility, & Gantt chart
│   ├── SDLC_REQUIREMENTS.md   # Functional specs & RBAC matrix
│   ├── SDLC_DESIGN.md         # Component layouts & queue sorting algorithms
│   ├── SDLC_TESTING.md        # Quality assurance test matrix
│   └── SDLC_DEPLOYMENT.md     # Production release & troubleshooting guides
├── src/
│   ├── components/            # Reusable UI elements grouped by role
│   ├── context/               # Global Authentication & shared states
│   ├── data/                  # Asynchronous data loading hooks
│   ├── pages/                 # Full dashboard pages per role
│   ├── services/
│   │   ├── apiWrapper.js      # Central Axios instance with refresh interceptors
│   │   ├── queueEngine.js     # In-memory singleton managing sorting & positions
│   │   ├── realtimeService.js # Supabase Realtime WebSocket listeners
│   │   └── supabaseClient.js  # Supabase client credentials initialization
│   ├── App.jsx                # Router configurations & route protection
│   ├── main.jsx               # Render entrypoint
│   └── index.css              # Global styles & theme utilities
```

---

## 🛠️ Tech Stack

* **Core Framework**: React 19 (Functional components, custom Hooks, Context API)
* **Build Tool**: Vite 7 (Hot Module Replacement, Rollup code-splitting)
* **Styling**: Tailwind CSS 4.0 (Custom design system, high-contrast layouts)
* **Realtime Layer**: Supabase Client SDK (WebSocket subscriptions)
* **Client Networking**: Axios (Interceptors for silent token refreshing)
* **Routing**: React Router 7 (Protected declarative routes)

---

## 📐 Architecture & Data Flow

When a state mutation occurs, the data is pushed in real-time to maintain global consistency:

```mermaid
sequenceDiagram
    participant Receptionist
    participant DB as Postgres DB
    participant WS as Supabase Realtime
    participant Patient as Patient Dashboard
    
    Receptionist->>DB: POST /register-walkin (Patient details)
    Note over DB: Trigger database write
    DB-.>>WS: Postgres replication payload
    WS-.>>Patient: WebSocket broadcast event (INSERT)
    Note over Patient: queueEngine updates local caches (Positions, Tokens)
    Note over Patient: deriveFromEngine recomputes UI states (No API call!)
    Note over Patient: React re-renders view (<100ms latency)
```

---

## ⚙️ Quick Start

### 1. Prerequisite Installations
Ensure you have Node.js (v18+) and npm installed on your machine.

### 2. Configure Environment Variables
Create a `.env` file in the root directory and specify the backend REST endpoint and your Supabase credentials:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
To bundle and optimize the project assets for deployment:
```bash
npm run build
```

---

## 📚 SDLC Documentation

This project has been developed and structured following a standard Software Development Life Cycle (SDLC). Detailed phase documentations are available in the [`/docs`](file:///Users/mac/Library/CloudStorage/OneDrive-Personal/Projects/QMedix-fe/docs) directory:

1. 📂 **Planning Phase**: [SDLC_PLANNING.md](file:///Users/mac/Library/CloudStorage/OneDrive-Personal/Projects/QMedix-fe/docs/SDLC_PLANNING.md)
2. 📋 **Requirements Phase**: [SDLC_REQUIREMENTS.md](file:///Users/mac/Library/CloudStorage/OneDrive-Personal/Projects/QMedix-fe/docs/SDLC_REQUIREMENTS.md)
3. 📐 **Design Phase**: [SDLC_DESIGN.md](file:///Users/mac/Library/CloudStorage/OneDrive-Personal/Projects/QMedix-fe/docs/SDLC_DESIGN.md)
4. 🧪 **Testing Phase**: [SDLC_TESTING.md](file:///Users/mac/Library/CloudStorage/OneDrive-Personal/Projects/QMedix-fe/docs/SDLC_TESTING.md)
5. 🚢 **Deployment & Maintenance**: [SDLC_DEPLOYMENT.md](file:///Users/mac/Library/CloudStorage/OneDrive-Personal/Projects/QMedix-fe/docs/SDLC_DEPLOYMENT.md)

---

## 👥 Collaborators

* [Tripti Gupta](https://github.com/Tripti213)
* [Avadhesh Nagar](https://github.com/avadhesh11)
* [Dev Joshi](https://github.com/devj-arch)
* [Tarun Jain](https://github.com/tarundeepakjain)
