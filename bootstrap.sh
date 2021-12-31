set -e

path=`pwd`
npm install
npm run compile
cp -r ${path}/src/source ./dist/source


pm2 start ./dist/app.js