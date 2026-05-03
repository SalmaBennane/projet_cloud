# Étape 1 : build de l'application React
FROM node:18 as build

# dossier de travail
WORKDIR /app

# copier package.json
COPY package*.json ./

# installer les dépendances
RUN npm install

# copier tout le code
COPY . .

# construire l'app React
RUN npm run build


# Étape 2 : serveur web pour servir React
FROM nginx:alpine

# copier le build React dans nginx
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
# exposer le port 80
EXPOSE 80

# lancer nginx
CMD ["nginx", "-g", "daemon off;"]