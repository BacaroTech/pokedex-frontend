# Usa un'immagine Node.js come builder
FROM node:20-slim AS builder

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione e installa le dipendenze
COPY package*.json .
RUN npm install

# Copia il resto del codice sorgente
COPY . .

# Esegui il build (SSG/SSR)
# Nota: "npm run build" è il comando standard che gestisce SSR e SSG
RUN npm run build


# Fase di Produzione (per eseguire il server SSR)
FROM node:20-slim AS runner

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file generati (server, build, node_modules essenziali)
# Next.js
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# Angular SSR
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
RUN npm install --production

# SvelteKit (con adapter-node)
# COPY --from=builder /app/build ./build
# COPY --from=builder /app/package.json ./package.json
# RUN npm install --production

# Espone la porta su cui girerà l'app
 # O la porta usata dal tuo framework (es. 4000 per Angular SSR)
EXPOSE 3001

# Comando per avviare il server SSR in ambiente locale di produzione
# Angular:
CMD ["node", "dist/pokedex-angular-v1/server/main.js"]
# Next.js:
# CMD ["npm", "start"]
# SvelteKit (con adapter-node):
# CMD ["node", "build/index.js"]
