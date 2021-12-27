set -e

npm install
npm run compile

pm2 start ./dist/app.js