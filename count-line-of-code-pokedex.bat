@echo off
:: --- Elenco dei progetti ---
set PROJECT_LIST=^
 "./frameworks/pokedex-angular-v1"^
 "./frameworks/pokedex-next-v1"^
 "./frameworks/pokedex-svelte-v1"
:: ------------------------------

echo Esecuzione di cloc per un confronto...
echo.

:: Itera su ogni progetto ed esegue cloc
FOR %%P IN (%PROJECT_LIST%) DO (
    echo ----------------------------------------------------
    echo   PROGETTO: %%~P
    echo ----------------------------------------------------
    cloc --exclude-dir=node_modules,dist,.angular,.next,.vercel,.svelte-kit %%~P
    echo.
)

echo Confronto completato.