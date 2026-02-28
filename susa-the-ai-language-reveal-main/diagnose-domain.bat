@echo off
echo Diagnosing susastudio.online DNS Configuration...
echo.

echo Current DNS Resolution:
ping susastudio.online -n 1
echo.

echo Expected Firebase IPs:
echo - 151.101.1.195
echo - 151.101.65.195
echo.

echo Current Resolution Analysis:
ping susastudio.online -n 1 | findstr "Pinging"
echo.

echo DIAGNOSIS:
echo If your domain resolves to 13.248.243.5 or similar (not Firebase IPs),
echo then your DNS records are not pointing to Firebase yet.
echo.

echo SOLUTION:
echo 1. Go to your domain provider (where you bought susastudio.online)
echo 2. Update DNS records to point to Firebase IPs:
echo    Type: A, Name: @, Value: 151.101.1.195
echo    Type: A, Name: @, Value: 151.101.65.195
echo 3. Add TXT record from Firebase Console for verification
echo 4. Wait 24-48 hours for DNS propagation
echo.

echo Check DNS propagation: https://www.whatsmydns.net/
echo.
pause