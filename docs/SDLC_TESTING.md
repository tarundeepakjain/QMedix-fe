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
