# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Producción
FROM node:20 AS production

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
