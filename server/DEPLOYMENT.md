# HiveMind Backend Production Deployment Guide (Ubuntu 24.04)

This guide documents the complete process for deploying, operating, maintaining, and updating the HiveMind Express/TypeScript backend on a remote Ubuntu 24.04 server using Docker and Docker Compose.

---

## 1. Architecture Overview

```text
[ Internet / Clients ]
         │
         ▼ (HTTPS)
   [ Cloudflare ]
         │
         ▼ (Cloudflare Tunnel)
 [ Ubuntu 24.04 Server ]
         │
         ▼ (127.0.0.1:5000 - Host Binding)
[ Docker: hivemind-backend ]
         │
         ▼ (MongoDB Atlas SRV / Cloudinary / Gmail SMTP)
```

- **Host Port Binding:** `127.0.0.1:5000:5000` (The backend is **never** exposed directly to the public internet).
- **Public Ingress:** Handled securely by Cloudflare Tunnel routing `https://api.hivemindsist.dev` to `http://127.0.0.1:5000`.

---

## 2. Server Prerequisites

On the Ubuntu 24.04 LTS college server, ensure the following packages are installed:

### Install Docker & Docker Compose Plugin
```bash
# Update package index
sudo apt update && sudo apt upgrade -y

# Install prerequisite packages
sudo apt install -y ca-certificates curl gnupg lsb-release git

# Add Docker official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine and Docker Compose plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add your user to the docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 3. Deployment Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/HiveMind-SIST/HiveMind-Website.git
cd HiveMind-Website/server
```

### Step 2: Configure Environment Variables
Copy the template and configure your production credentials:
```bash
cp .env.example .env
nano .env
```

Ensure all variables are populated:
- `NODE_ENV=production`
- `PORT=5000`
- `CLIENT_URL=https://hivemindsist.dev`
- `ALLOWED_ORIGINS=https://hivemindsist.dev,https://www.hivemindsist.dev`
- `MONGODB_URI=mongodb+srv://...`
- `JWT_SECRET=...`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `EMAIL_USER=...`
- `EMAIL_PASS=...`
- `EMAIL_FROM=...`
- `TEAM_LEADS_EMAILS=...`

> [!CAUTION]
> Never commit the `.env` file to Git. Ensure file permissions are restricted:
> `chmod 600 .env`

### Step 3: Build & Start Container with Docker Compose
```bash
# Build the production image and start container in detached mode
docker compose up -d --build
```

---

## 4. Operational Verification

### Check Container Status
```bash
docker compose ps
```
You should see `hivemind-backend` in state `Up` and `(healthy)`.

### Inspect Live Logs
```bash
# View recent logs
docker compose logs

# Follow logs in real-time
docker compose logs -f
```

### Test Local Health Check Endpoint
```bash
curl -i http://127.0.0.1:5000/health
```
Expected output:
```json
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "status": "ok",
  "service": "HiveMind API Server",
  "timestamp": "2026-08-19T07:15:00.000Z"
}
```

---

## 5. Maintenance & Management Commands

| Action | Command |
| :--- | :--- |
| **Start Services** | `docker compose up -d` |
| **Stop Services** | `docker compose down` |
| **Restart Services** | `docker compose restart` |
| **View Real-Time Logs** | `docker compose logs -f` |
| **Check Health Status** | `docker inspect --format='{{json .State.Health}}' hivemind-backend` |
| **Clean Unused Images** | `docker image prune -f` |

---

## 6. Updating the Deployment (Zero/Low-Downtime)

When new changes are pushed to GitHub:

```bash
cd HiveMind-Website/server

# 1. Fetch latest changes
git pull origin main

# 2. Rebuild and restart the container
docker compose up -d --build

# 3. Verify health
docker compose ps
curl http://127.0.0.1:5000/health
```

---

## 7. Rollback Procedure

If a newly deployed build has issues:

```bash
cd HiveMind-Website/server

# 1. Revert to previous Git commit
git checkout <PREVIOUS_STABLE_COMMIT_HASH>

# 2. Rebuild and launch the previous version
docker compose up -d --build

# 3. Verify health
docker compose ps
```

---

## 8. Cloudflare Tunnel Integration Guide

Once the container is healthy on `http://127.0.0.1:5000`, configure Cloudflare Tunnel on the server:

1. In Cloudflare Zero Trust Dashboard -> **Networks** -> **Tunnels**.
2. Add a Public Hostname route:
   - **Public Hostname:** `api.hivemindsist.dev`
   - **Service Type:** `HTTP`
   - **URL:** `127.0.0.1:5000`
   - **Additional settings:** Enable `No TLS Verify` (since communication from Tunnel agent to local backend on same host is plain HTTP).
3. The backend is now securely accessible worldwide at `https://api.hivemindsist.dev`!
