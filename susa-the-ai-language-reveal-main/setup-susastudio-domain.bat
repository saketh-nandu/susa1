@echo off
title SUSA Studio Online - Domain Setup
color 0A

echo.
echo  ███████╗██╗   ██╗███████╗ █████╗     ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ 
echo  ██╔════╝██║   ██║██╔════╝██╔══██╗    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
echo  ███████╗██║   ██║███████╗███████║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
echo  ╚════██║██║   ██║╚════██║██╔══██║    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
echo  ███████║╚██████╔╝███████║██║  ██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
echo  ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
echo.
echo  Domain Setup: susastudio.online
echo  ═══════════════════════════════════════════════════════════════════════════════════
echo.

echo Setting up susastudio.online for your SUSA website...
echo.

echo ✅ Firebase project: susa-programming-language
echo ✅ Domain: susastudio.online
echo ✅ Website built and ready
echo.

echo NEXT STEPS:
echo.
echo 1. 🌐 Go to Firebase Console:
echo    https://console.firebase.google.com/project/susa-programming-language/hosting
echo.
echo 2. 📝 Click "Add custom domain"
echo.
echo 3. 🔗 Enter domain: susastudio.online
echo.
echo 4. ✅ Add TXT record for verification (Firebase will show you the exact record)
echo.
echo 5. 🌍 Add these A records to susastudio.online DNS:
echo    Type: A, Name: @, Value: 151.101.1.195
echo    Type: A, Name: @, Value: 151.101.65.195
echo.
echo 6. 🌐 Add CNAME for www:
echo    Type: CNAME, Name: www, Value: susa-programming-language.web.app
echo.
echo 7. ⏳ Wait for DNS propagation (up to 48 hours)
echo.
echo 8. 🔒 SSL certificate will be automatically provisioned
echo.

echo TROUBLESHOOTING ACME 404 ERRORS:
echo - Wait for DNS propagation (this fixes most issues)
echo - Ensure TXT record is exactly as shown in Firebase Console
echo - Don't change DNS records while verification is in progress
echo - Check DNS propagation: https://www.whatsmydns.net/
echo.

echo FINAL RESULT:
echo Your SUSA website will be live at:
echo ✅ https://susastudio.online
echo ✅ https://www.susastudio.online
echo.

echo Opening Firebase Console...
start https://console.firebase.google.com/project/susa-programming-language/hosting

echo.
echo 🚀 Your SUSA programming language will soon be live at susastudio.online!
echo.
pause