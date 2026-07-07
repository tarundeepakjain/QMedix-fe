# SDLC Phase 5: Deployment & Maintenance Manual - QMedix

This manual details the deployment procedure, environments, and troubleshooting guides for the QMedix application.

---

## 1. Environment Configurations

All system variables are injected during bundling and must be configured inside the environment configurations (`.env.production` or CI/CD settings):

```bash
# Backend REST Endpoints
VITE_BACKEND_URL=https://api.qmedix.com

# Supabase Realtime Gateway
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Deployment Steps

### 2.1 Build Production Bundle
To compile and optimize the client application assets for web servers:
```bash
npm run build
```
This generates the optimized static files under the `/dist` directory.

### 2.2 Host Deployments
- **Static Hosting**: Deploy the output folder `/dist` to platforms like Vercel, Netlify, or AWS S3.
- **Routing Rules**: Ensure all incoming routes redirect to `/index.html` (Single Page Application fallback rule) to let React Router handle route routing:
  - For Vercel (`vercel.json`):
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```

---

## 3. Maintenance & Troubleshooting

### 3.1 Connection Failures
If realtime updates are not showing, verify:
1. **WebSocket Protocol**: Inspect client network logs to confirm standard websocket connection (`wss://`) to Supabase.
2. **Postgres Replication**: Ensure the `Appointment` table is active in the Supabase replication publication (`supabase_realtime`). Run this SQL statement in the Supabase console:
   ```sql
   alter publication supabase_realtime add table "Appointment";
   ```

### 3.2 Token Desynchronization
If client tokens mismatch, verify if any system browser is bypassing standard timezone synchronization. Clear the local cache or force-reload the browser (`Ctrl + F5`) to trigger `queueEngine.init()` which pulls the global chronological ordering of today's appointments.
