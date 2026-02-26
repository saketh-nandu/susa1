@echo off
echo Starting SUSA IDE in production mode...
set NODE_ENV=production
npx electron .
pause