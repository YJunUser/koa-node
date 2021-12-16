set -e

npm run compile

pm2 start ./dist/app.js