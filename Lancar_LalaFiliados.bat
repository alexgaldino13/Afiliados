@echo off
title Lancador LalaFiliados
echo [LALA] Iniciando motores...
echo [LALA] Abrindo Servidor e Frontend...
start cmd /k "npm run dev"
timeout /t 5
start http://localhost:3000
echo [LALA] Sucesso! Bons lucros.
exit
