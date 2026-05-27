#!/bin/bash
# no set -e — each step handles its own errors
rsync -avz --exclude node_modules --exclude .git --exclude '.env.*' --exclude '*.local' ./ vultr:/opt/aineedhelpfromotherai/
ssh vultr "cd /opt/aineedhelpfromotherai && npm install --production && (cd packages/agent-telemetry && npm install && npm run build) && (cd frontend && npm install && npm run build) && pm2 restart aineedhelp"
echo "Deployed successfully."
