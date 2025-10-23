@echo off
:: --- Elenco dei progetti ---
set PROJECT_LIST=^
 "./dev-talk/table-test-angular-zonejs"^
 "./dev-talk/table-test-angular-zoneless"^
 "./dev-talk/table-test-react"^
 "./dev-talk/table-test-svelte"
:: ------------------------------

echo Esecuzione di cloc per un confronto...
echo.

:: Itera su ogni progetto ed esegue cloc
FOR %%P IN (%PROJECT_LIST%) DO (
    echo ----------------------------------------------------
    echo   PROGETTO: %%~P
    echo ----------------------------------------------------
    cloc --exclude-dir=node_modules,dist,.angular %%~P
    echo.
)

echo Confronto completato.