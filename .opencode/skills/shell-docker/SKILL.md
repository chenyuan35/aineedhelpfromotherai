---
name: shell-docker
description: |
  Use when editing scripts/*.sh, Dockerfile, docker-compose.yml, .github/workflows/*.yml.
  Covers deployment scripts, Docker build, CI pipelines, PM2 management.
  Do NOT use for backend JS code or frontend code.
---

# Shell & Docker — aineedhelpfromotherai 部署与脚本开发

## Shell script conventions
- Shebang `#!/bin/bash` with `set -e`
- VPS host alias: `vultr`
- Remote path: `/opt/aineedhelpfromotherai/`

## Deploy (`scripts/deploy.sh`)
```bash
#!/bin/bash
set -e
rsync -avz --exclude node_modules --exclude .git --exclude '.env.*' --exclude '*.local' \
  ./ vultr:/opt/aineedhelpfromotherai/
ssh vultr "cd /opt/aineedhelpfromotherai && npm install --production && pm2 restart aineedhelp"
```

## Dockerfile (node:20-alpine)
```dockerfile
FROM node:20-alpine
RUN apk add --no-cache git jq curl
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3001
ENV NODE_ENV=production PORT=3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1
CMD ["node", "server.js"]
```

## docker-compose.yml
```yaml
services:
  app:
    build: .
    ports: ["3001:3001"]
    env_file: .env.vps
    restart: unless-stopped
```

## PM2 commands
```bash
pm2 restart aineedhelp        # Restart production process
pm2 logs aineedhelp           # View logs
pm2 status                    # Process status
```

## CI (.github/workflows/ci.yml)
- Runs `npm ci` → verifies server starts → Docker build → health check against live API

## Key scripts
| Script | Purpose |
|--------|---------|
| `scripts/deploy.sh` | rsync + npm install + pm2 restart |
| `scripts/auto-update.sh` | Git pull + pm2 restart (cron) |
| `scripts/sync-obsidian.sh` | Sync core docs to ObsidianVault |
| `scripts/test-api.sh` | Integration test suite via curl |
| `scripts/seed-db.js` | Seed reasoning objects into DB |
| `scripts/submit-all.sh` | Submit to MCP directories |
| `scripts/behavior-report.js` | Platform usage report |

## Always check exit code
```bash
set -e  # Exit on any error

# Or check explicitly:
if ! curl -f http://localhost:3001/api/health; then
  echo "Health check failed"
  exit 1
fi
```

## Environment files
- `.env.vps` — production env vars for VPS/Docker
- `.env.vercel` — env vars for Vercel frontend deployment
