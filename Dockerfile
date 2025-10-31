FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json /usr/src/app/package-lock.json* ./
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD npm run migration:run:prod && npm run seed:run && node dist/main
