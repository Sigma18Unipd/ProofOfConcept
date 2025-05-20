FROM docker.io/node:24-alpine3.20 AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest && pnpm install
COPY . .
CMD ["pnpm", "run", "start"]