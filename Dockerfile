# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080 3000
CMD ["sh", "-c", "npm run backend & npm run serve"]
