# QMedix Frontend - Smart Healthcare Queue Management

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)

QMedix is a healthcare management interface designed to bridge the gap between online appointments and walk-in patients. It provides a seamless, real-time experience for patients, doctors, and hospital staff through a unified digital ecosystem.

---

##  Key Features
- **Real-Time Patient Dashboard:** Tracks live queue positions and generates digital tokens with <2s latency.
- **Doctor Console:** Specialized interface for managing live sessions, calling the next patient, and updating consultation status.
- **Reception Portal:** Unified system to register walk-ins and mark emergency cases for priority handling.
- **Adaptive UI:** Full support for high-contrast Dark Mode optimized for clinical environments.

---

##  Tech Stack
- **Core Library:** React 19 (Utilizing Hooks and Context API for state management).
- **Styling:** Tailwind CSS 4.0 with Vite integration.
- **Routing:** React Router 7 (Implementing Protected Role-Based Routes).
- **API Communication:** Axios with a centralized service wrapper.
- **Icons:** Lucide React.

---

##  Architecture Highlights
- **`src/context/`**: Manages global Authentication and Queue states to ensure data consistency across components.
- **`src/services/`**: Contains the core `queueEngine.js` logic and `realtimeService.js` for Supabase subscriptions.
- **`src/protectedRoutes.jsx`**: Implements Role-Based Access Control (RBAC) to secure sensitive medical dashboards.

---

## Collaborators
- Tripti Gupta[https://github.com/Tripti213]
- Avadhesh Nagar[https://github.com/avadhesh11]
- Dev Joshi[https://github.com/devj-arch]
- Tarun Jain[https://github.com/tarundeepakjain]
