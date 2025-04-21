FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV=production
ENV PAGE_LIMIT=5
CMD ["bun", "src/index.ts"]

EXPOSE 3000
