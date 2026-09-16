#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH=$PATH:/usr/local/bin:/usr/bin:~/.nvm/versions/node/$(ls ~/.nvm/versions/node 2>/dev/null | tail -n 1)/bin

echo "Deploying Kenny Web..."
npm install
npm run build

# Copy static assets to the standalone directory
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Restart/Start standalone server using PM2
pm2 restart "kenny-web" || pm2 start .next/standalone/server.js --name "kenny-web"

echo "Kenny Web deployed successfully!"
