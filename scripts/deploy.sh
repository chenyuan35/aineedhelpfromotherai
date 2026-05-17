#!/bin/bash
set -e
rsync -avz --exclude node_modules --exclude .git --exclude '.env.*' --exclude '*.local' ./ vultr:/opt/aineedhelpfromotherai/
ssh vultr "cd /opt/aineedhelpfromotherai && npm install --production && pm2 restart aineedhelp"
echo "Deployed successfully."
