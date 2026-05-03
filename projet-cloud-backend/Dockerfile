# Image Node officielle
FROM node:18

# dossier de travail
WORKDIR /app

# copier package.json
COPY package*.json ./

# installer dépendances
RUN npm install

# copier tout le code
COPY . .

# exposer le port
EXPOSE 3001

# lancer serveur
CMD ["node", "server.js"]