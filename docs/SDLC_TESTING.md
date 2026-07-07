# SDLC Phase 4: Test Document - QMedix Queue Verification

This document specifies the verification plan, test cases, and execution logs for confirming the correctness of QMedix features.

---

## 1. Unit & Integration Test Suite

### 1.1 Test Case Matrix

| ID | Module / Area | Description | Expected Output | Status |
|---|---|---|---|:---:|
| TC-01 | Realtime | Broadcast an `INSERT` payload over Supabase realtime channel. | `queueEngine` inserts the record and triggers dashboard recompute. | Passed |
| TC-02 | Universal Tokens | Insert an emergency appointment for Doctor A. | The emergency moves to the top of the waiting queue, but existing appointments retain their static tokens (`Q-1`, `Q-2`). | Passed |
| TC-03 | Latency | Measure delay between database state mutation and Patient UI update. | Dashboard updates within `<100ms` from receiving the websocket frame. | Passed |
| TC-04 | Patient UI Sync | Log in as Patient. Check if token matches Doctor view exactly. | Patient sees the exact same token number (e.g. `Q-5`) and serving token as Doctor. | Passed |
| TC-05 | Fallback Polling | Disable websocket network requests in developer console. | Dashboards gracefully fallback to API polling (15s patient, 30s staff/admin). | Passed |

---

## 2. Traceability Matrix

Each functional requirement is linked to its verification test case:

| Requirement ID | Requirement Description | Test Case ID | Status |
|---|---|---|---|
| FR-1.2 | Priority Emergency Override | TC-02 | Verified |
| FR-1.3 | Universal Static Token Matching | TC-04 | Verified |
| NFR-2.1 | Latency under 2 seconds | TC-03 | Verified |
| NFR-2.2 | Fallback Polling | TC-05 | Verified |

---

## 3. Real-Time Latency Measurement Guide

To verify and continuously test that the end-to-end synchronization latency remains under the 2-second NFR threshold, use the following three methodologies:

### Methodology A: Database Commit Time Verification (End-to-End Latency)
Every replication payload pushed by Supabase Realtime contains a `commit_timestamp` from the Postgres transaction log. Comparing this against the client's current render time yields the total latency including network transport, WebSocket frame propagation, client state update, and DOM render:

1. Open your browser console (F12 or Opt + Cmd + I).
2. Inside [realtimeService.js](file:///Users/mac/Library/CloudStorage/OneDrive-Personal/Projects/QMedix-fe/src/services/realtimeService.js), you can log:
   ```javascript
   const commitTime = new Date(payload.commit_timestamp).getTime();
   const clientTime = Date.now();
   const latency = clientTime - commitTime;
   console.log(`[Realtime Sync Latency] E2E Network + Render: ${latency}ms`);
   ```
3. Target Performance: **`<150ms`** (Excellent), **`150ms-500ms`** (Acceptable), **`>2000ms`** (Failing).

### Methodology B: Chrome DevTools WebSocket Inspector
To inspect the network transport layer delay:
1. Open DevTools -> **Network Tab** -> filter by **WS** (WebSockets).
2. Click on the active connection `appointments-realtime-...`.
3. Select the **Messages** panel.
4. Trigger an appointment change (e.g. register a walk-in, toggle emergency).
5. Compare the timestamp of the outgoing request in the HTTP/REST log with the time the message frame is received in the Messages tab.

### Methodology C: React Render Profiling
To isolate client-side processing delays:
1. Open DevTools -> **Performance** tab.
2. Click **Record** and toggle an emergency in the queue.
3. Stop recording and inspect the Flamegraph under the User Timings section.
4. Verify that the local `deriveAndSet` function execution takes **`<3ms`** and the subsequent React commit phase takes **`<8ms`**.
