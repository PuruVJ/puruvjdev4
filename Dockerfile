# Build with:   docker build -t IMAGE_NAME .
# Run with:     docker run -p 3000:3000 --rm --name IMAGE_NAME IMAGE_NAME

FROM node:20-alpine AS builder
WORKDIR /staging
COPY . /staging/
RUN corepack enable && \
  pnpm install --frozen-lockfile --force && \
  pnpm build && \
  pnpm prune --prod

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /staging/package.json /staging/pnpm-lock.yaml  /app/
COPY --from=builder /staging/node_modules /app/node_modules
COPY --from=builder /staging/build /app/build

EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "/app/build/index.js"]