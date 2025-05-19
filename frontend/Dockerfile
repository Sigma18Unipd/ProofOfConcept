FROM docker.io/node:24-alpine3.20 AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
# RUN pnpm build

EXPOSE 5173
# TODO: change to a production-ready webserver
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]