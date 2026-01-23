# 🐳 Docker Setup Guide for CodeOwl

This guide explains how to run CodeOwl using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker` and replace placeholder values with your actual:

- GitHub OAuth credentials
- GitHub webhook secret
- JWT secret (generate with: `openssl rand -base64 32`)
- Pinecone API key
- OpenRouter API key
- Razorpay credentials

### 2. Build and Start Services

```bash
docker-compose --env-file .env.docker up -d
```

This will start:

- **MongoDB** on port 27017
- **Redis** on port 6379
- **Backend API** on port 5001
- **Frontend** on port 3000

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## Service Architecture

```
┌─────────────────┐
│   Frontend      │ :3000 (nginx)
│   (React/Vite)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │ :5001 (Express)
│   (Node.js)     │
└────┬────────┬───┘
     │        │
     ▼        ▼
┌─────────┐ ┌─────────┐
│ MongoDB │ │  Redis  │
│  :27017 │ │  :6379  │
└─────────┘ └─────────┘
```

## Project Structure

```
CodeOwl/
├── backend/
│   ├── Dockerfile              # Backend Docker configuration
│   ├── src/
│   └── package.json
├── frontend/
│   ├── Dockerfile              # Frontend Docker configuration
│   ├── src/
│   └── package.json
├── .dockerignore               # Shared Docker ignore rules
├── .env.docker.example         # Environment template
├── docker-compose.yml          # Orchestration configuration
└── DOCKER.md                   # This file
```

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Check Service Status

```bash
docker-compose ps
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ deletes all data)

```bash
docker-compose down -v
```

### Rebuild Services

```bash
# Rebuild all
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
```

### Restart a Service

```bash
docker-compose restart backend
```

## Production Deployment

### Build for Production

Update the `docker-compose.yml` or create a `docker-compose.prod.yml`:

1. **Use production MongoDB** - Replace with MongoDB Atlas URI
2. **Use production Redis** - Replace with managed Redis (AWS ElastiCache, Redis Cloud, etc.)
3. **Configure domain** - Update `GITHUB_CALLBACK_URL` to your production domain
4. **Use secrets** - Don't commit `.env.docker` to version control

### Environment-Specific Configuration

```bash
# Development
docker-compose --env-file .env.docker up -d

# Production (create .env.production)
docker-compose --env-file .env.production up -d
```

## Data Persistence

Docker volumes are used for data persistence:

- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `redis_data` - Redis data

These volumes persist even when containers are stopped. Use `docker-compose down -v` only when you want to completely reset the application.

## Troubleshooting

### Backend can't connect to MongoDB

Check if MongoDB is healthy:

```bash
docker-compose ps mongodb
docker-compose logs mongodb
```

### Frontend shows connection errors

1. Check if backend is running: http://localhost:5001/health
2. Verify CORS configuration allows frontend URL
3. Check browser console for specific errors

### Port already in use

If ports are already occupied, modify `docker-compose.yml` port mappings:

```yaml
ports:
  - "3001:80" # Changed frontend from 3000 to 3001
```

### Clean rebuild

```bash
# Stop everything
docker-compose down -v

# Remove images
docker-compose rm -f
docker rmi codeowl-backend codeowl-frontend

# Rebuild and start
docker-compose --env-file .env.docker up -d --build
```

## Development Workflow

For active development, it's recommended to run services locally with hot-reload:

```bash
# Run only MongoDB and Redis in Docker
docker-compose up -d mongodb redis

# Run backend locally
cd backend
npm run dev

# Run frontend locally (separate terminal)
cd frontend
npm run dev
```

This gives you:

- Fast hot-reload for code changes
- Full debugging capabilities
- Persistent data in Docker volumes

## Health Checks

All services include health checks:

```bash
# Check backend health
curl http://localhost:5001/health

# Check all service health
docker-compose ps
```

Healthy services show `(healthy)` in their status.

## Security Notes

- Never commit `.env.docker` to version control
- Use strong, unique secrets for `JWT_SECRET`
- In production, use managed databases instead of containerized ones
- Keep Docker images updated regularly
- Use HTTPS in production with proper SSL certificates

## Additional Resources

- [CodeOwl Documentation](./README.md)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
