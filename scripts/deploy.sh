#!/bin/bash
set -e
rsync -avz --exclude node_modules --exclude .git --exclude '.env.*' --exclude '*.local' ./ vultr:/opt/aineedhelpfromotherai/
ssh vultr "cd /opt/aineedhelpfromotherai && npm install --production && cd packages/agent-telemetry && npm install && npm run build && cd /opt/aineedhelpfromotherai && pm2 restart aineedhelp"
echo "Deployed successfully."
