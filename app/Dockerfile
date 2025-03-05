# Utilisation de l'image Node.js
FROM node:22-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier le reste des fichiers
COPY . .

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Compiler le TypeScript en JavaScript
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
