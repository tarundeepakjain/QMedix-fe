# SDLC Phase 3: System Design Document (SDD) - QMedix

This document details the architectural layout, queue engines, and data flow of the QMedix application.

---

## 1. System Architecture

QMedix is a React single-page application built on a decoupled serverless architecture.

```mermaid
graph TD
    subgraph Client-Side (React Application)
        UI[Component Views]
        QE[QueueEngine Singleton]
        Client[supabase-js / Axios client]
    end
    subgraph Cloud Backend & Realtime
        SupabaseRealtime[(Supabase Websocket Channel)]
        ExpressAPI[Express.js Node API Engine]
        DB[(PostgreSQL Database)]
    end

    UI -->|API Requests| ExpressAPI
    ExpressAPI -->|Read/Write| DB
    DB -.->|Postgres Replication| SupabaseRealtime
    SupabaseRealtime -.->|Websocket Broadcast| Client
    Client -->|Local Updates| QE
    QE -->|Re-render Trigger| UI
```

---

## 2. Queue Engine Logic & Algorithms

### 2.1 The `QueueEngine` Class
The core queue state is represented in memory as a client-side singleton class (`QueueEngine`) containing three registry maps:
- `this.appointments`: `Map<appointment_id, appointment>` (Flat store of all cached appointments).
- `this.queues`: `Map<hospital_id, Map<doctor_id, { in_progress: [], waiting: [], completed: [] }>>` (Hierarchical queue grouping).
- `this.positions`: `Map<appointment_id, position>` (Dynamically computed live queue positions).
- `this.tokens`: `Map<appointment_id, token_no>` (Static chronological token assignments).

### 2.2 Queue Sorting Algorithm
The `waiting` queue for a doctor is sorted dynamically using the following comparison algorithm:
```javascript
doctorQueue.waiting.sort((a, b) => {
  // 1. Emergency priority first
  if (a.isEmergency !== b.isEmergency) {
    return b.isEmergency - a.isEmergency;
  }
  // 2. FIFO by appointment creation timestamp
  return new Date(a.created_at) - new Date(b.created_at);
});
```

### 2.3 Tokenization Algorithm
To ensure universal token persistence and stability across emergencies, token numbers are assigned sequentially based on registration time:
1. Gather all today's appointments for a doctor (completed + active).
2. Sort chronologically by `created_at`.
3. Assign sequential integers starting from 1 (fallback index + 1).

---

## 3. Realtime Low-Latency Integration

Supabase Realtime listens to changes on the database `Appointment` table. When an insert, update, or delete occurs:
1. The websocket payload is dispatched to the client.
2. The `realtimeService` receives the change payload.
3. The payload is forwarded to the corresponding `queueEngine.handleInsert`, `queueEngine.handleUpdate`, or `queueEngine.handleDelete` handler.
4. The engine mutates its internal maps, and recalculates positions and static token associations locally in client memory (`<5ms`).
5. An event listener triggers the local dashboard component to re-render using updated values from `queueEngine` without hitting the backend API.
