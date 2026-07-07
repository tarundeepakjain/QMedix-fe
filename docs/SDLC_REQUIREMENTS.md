# SDLC Phase 2: Software Requirements Specification (SRS) - QMedix

This document specifies the functional and non-functional requirements of the QMedix application, including role-based access controls.

---

## 1. Functional Requirements (FR)

### 1.1 Authentication & Registration
- Users must be able to sign up and log in via email and password credentials.
- System roles include: **Patient**, **Doctor**, **Hospital Staff (Receptionist)**, and **Hospital Admin**.
- Google OAuth session binding is supported with auto-mapping fallback to the Patient role.

### 1.2 Queue Management
- **Registration**: Staff can register walk-in patients by entering name, preferred doctor, and optional clinical details (age, phone, DOB, address).
- **Online Booking**: Patients can schedule OPD slots selecting a specific date, time slot, hospital, department, and preferred doctor.
- **Priority Override**: Staff can check the `isEmergency` flag, causing the patient to automatically sort to the top of the waiting queue.
- **Real-Time Session Transitions**: Doctors can click "Call Next" to move the top waiting patient into `in_progress`, and click "Complete" to move them to `completed` after updating consultation remarks.

### 1.3 State & Token Universalization
- **Universal Static Token**: The system must assign a static token (e.g. `Q-1`, `Q-2`) chronologically based on appointment registration order for that day.
- **Role Consistency**: The token number assigned to an appointment must display identically on Patient, Doctor, Receptionist, and Admin views.
- **Serving Token**: Patients must be able to view the static token number of the patient currently being served (`in_progress`) in the same doctor queue.

---

## 2. Non-Functional Requirements (NFR)

### 2.1 Latency
- The synchronization latency of queue state changes (e.g., patient joins queue, doctor updates patient status) to active patient screens must be **under 2 seconds**.
- Avoid redundant API roundtrips upon receiving realtime websocket updates to conserve database connections.

### 2.2 Security (RBAC Matrix)
Access to dashboard views is strictly controlled using React Router protected routes:

| Route Path | Patient | Doctor | Staff (Receptionist) | Admin |
|---|:---:|:---:|:---:|:---:|
| `/patient/dashboard` | Yes | No | No | No |
| `/patient/book` | Yes | No | No | No |
| `/doctor/dashboard` | No | Yes | No | No |
| `/staff/dashboard` | No | No | Yes | No |
| `/hospital/dashboard` | No | No | No | Yes |

### 2.3 Usability & Theme Consistency
- Dark mode preference must persist locally (`localStorage`) and add/remove the `dark` class from the root document.
- Interfaces must adapt responsively across mobile, tablet, and desktop viewports.
