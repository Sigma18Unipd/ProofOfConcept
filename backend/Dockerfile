FROM docker.io/node:24-alpine3.20 AS base
WORKDIR /usr/src
COPY ./package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest && pnpm install

FROM base AS dev
EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]

FROM base AS build
COPY . .
RUN pnpm run build

FROM docker.io/node:24-alpine3.20 AS prod
WORKDIR /usr/src
COPY --from=base /usr/src/node_modules ./node_modules
COPY --from=build /usr/src/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]