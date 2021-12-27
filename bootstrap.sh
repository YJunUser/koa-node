set -e

path=`pwd`
mv ${path}/src/source ./dist
npm install
npm run compile

pm2 start ./dist/app.js