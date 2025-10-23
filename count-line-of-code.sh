#!/bin/bash

# --- Modifica questo elenco ---
# Aggiungi i percorsi ai tuoi progetti qui, separati da uno spazio.
PROJECTS=(
  "./mio-progetto-angular"
  "./mio-progetto-react"
  "./cartella-diversa/mio-progetto-svelte"
)
# ------------------------------

echo "Esecuzione di cloc sui seguenti progetti:"
for proj in "${PROJECTS[@]}"; do
  echo " - $proj"
done
echo "-----------------------------------------"

# Esegue il comando cloc escludendo le directory specificate
# e passando l'elenco dei progetti
cloc --exclude-dir=node_modules,dist "${PROJECTS[@]}"