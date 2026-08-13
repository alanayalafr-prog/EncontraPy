@echo off
title EncontraPY - Servidor Web Local
cls
echo ===================================================
echo     Iniciando EncontraPY - Directorio Web
echo ===================================================
echo.
echo [1/3] Sincronizando código fuente del sitio web...
powershell -NoProfile -Command "Copy-Item -Path 'H:\Mi unidad\Directorio Web\src\*' -Destination 'C:\Users\usuario\.gemini\antigravity\scratch\EncontraPY\src' -Recurse -Force; Copy-Item -Path 'H:\Mi unidad\Directorio Web\public\*' -Destination 'C:\Users\usuario\.gemini\antigravity\scratch\EncontraPY\public' -Recurse -Force; Copy-Item -Path 'H:\Mi unidad\Directorio Web\index.html', 'H:\Mi unidad\Directorio Web\package.json', 'H:\Mi unidad\Directorio Web\vite.config.js' -Destination 'C:\Users\usuario\.gemini\antigravity\scratch\EncontraPY' -Force"

echo.
echo [2/3] Abriendo navegador en http://localhost:5173/ ...
timeout /t 1 /nobreak > nul
start http://localhost:5173/

echo.
echo [3/3] Servidor listo. No cierres esta ventana mientras uses la web.
echo ===================================================
echo.
cd /d "C:\Users\usuario\.gemini\antigravity\scratch\EncontraPY"
npm run dev -- --host --port 5173
