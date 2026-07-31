# HiveMind — Production Deployment Architecture & Guide

A containerized, production-ready web application built with **React (Vite + TS)**, **Express (Node.js + TS)**, **MongoDB Atlas**, **Cloudinary**, and **Zoho Mail**, orchestrated using **Docker Compose** and **Nginx Reverse Proxy**.

---

## 🏛️ System Architecture

```
                       Internet (HTTP: 80 / HTTPS: 443)
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │    Ingress Nginx Gateway      │
                      │       (hivemind-nginx)        │
                      └───────────────┬───────────────┘
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           │                                                     │
           ▼ (/api/...)                                          ▼ (/)
┌───────────────────────────────┐                     ┌───────────────────────────────┐
│     Express Backend API       │                     │      React Frontend App       │
│      (hivemind-server)        │                     │      (hivemind-client)       │
│          Port 5000            │                     │           Port 80             │
└──────────────┬────────────────┘                     └───────────────────────────────┘
               │
    ┌──────────┴──────────┬────────────────────────┐
    ▼                     ▼                        ▼
MongoDB Atlas      Cloudinary Storage        Zoho Mail SMTP
 (Database)            (Media)                 (Emails)
```

### Key Architectural Highlights
- **Single Ingress Point**: Only Nginx exposes ports `80` and `443` to the outside world.
- **Strict Container Isolation**: Express API (`server`) and React static app (`client`) are accessible **only** within the internal Docker bridge network (`hivemind-network`). Port `5000` is never exposed publicly.
- **Production Performance**: Main Nginx features Gzip compression, WebSockets proxying, client body limits (50MB for media uploads), security headers, and keep-alive upstream connections.
- **Health Checks & Automatic Recovery**: Built-in container healthchecks with `depends_on: condition: service_healthy` ordering to prevent boot race conditions.

---

## 📁 Repository Structure

```
HiveMind/
├── client/                 # React + Vite + TypeScript Frontend
│   ├── Dockerfile          # Multi-stage production Dockerfile (Node 20 Alpine -> Nginx Alpine)
│   ├── .dockerignore       # Frontend Docker build exclusions
│   └── nginx.conf          # Client SPA fallback & caching configuration
├── server/                 # Express + Node.js + TypeScript Backend
│   ├── Dockerfile          # Multi-stage production Dockerfile (Node 20 Alpine compilation -> Non-root runtime)
│   ├── .dockerignore       # Backend Docker build exclusions
│   ├── .env.example        # Backend environment template
│   └── src/                # Express application source code
├── nginx/
│   └── default.conf        # Production Ingress Nginx gateway reverse proxy configuration
├── .env.example            # Root Docker build environment template
├── .env                    # Root Docker Compose environment variables
├── docker-compose.yml      # Production multi-container orchestration manifest
└── README.md               # Deployment documentation
```

---

## 🚀 Single-Command AWS EC2 Deployment Guide

### Prerequisites
- An AWS EC2 instance running **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS**.
- An AWS Security Group allowing inbound traffic on ports **80 (HTTP)**, **443 (HTTPS)**, and **22 (SSH)**.

### Step-by-Step Deployment

#### 1. Connect to your EC2 Instance
```bash
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
```

#### 2. Install Docker & Docker Compose
```bash
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Install Docker Engine & Compose plugin
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

#### 3. Clone the Repository
```bash
git clone https://github.com/Bersinberz/HiveMind-website.git
cd HiveMind-website
```

#### 4. Configure Environment Variables

Create the root `.env` for Docker build variables:
```bash
cp .env.example .env
```

Create the server `.env` for backend secrets (MongoDB Atlas, Cloudinary, Zoho Mail, JWT):
```bash
cp server/.env.example server/.env
nano server/.env
```
*(Update `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, and `SMTP_*` values in `server/.env`)*.

#### 5. Launch the Application
```bash
docker compose up -d --build
```

That's it! Your website is live immediately at `http://<your-ec2-public-ip>`.

---

## 🔒 Optional: Enabling Free SSL / HTTPS with Certbot

To point your domain name and enable SSL certificate:

1. Point your domain DNS **A Record** (e.g. `hivemindsist.dev`) to your EC2 Elastic IP address.
2. Install Certbot on the host or run Let's Encrypt:
   ```bash
   sudo apt-get install -y certbot
   sudo certbot certonly --standalone -d hivemindsist.dev -d www.hivemindsist.dev
   ```
3. Mount certificates into `./nginx/default.conf` and uncomment the SSL block in Nginx config.
4. Reload Nginx:
   ```bash
   docker compose exec nginx nginx -s reload
   ```

---

## 🛠️ Operational Commands

- **View Running Containers**:
  ```bash
  docker compose ps
  ```
- **View Aggregated Logs**:
  ```bash
  docker compose logs -f
  ```
- **Restart All Services**:
  ```bash
  docker compose restart
  ```
- **Stop Application**:
  ```bash
  docker compose down
  ```
