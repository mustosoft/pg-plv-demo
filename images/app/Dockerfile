FROM oven/bun:latest

WORKDIR /app

ADD package.json .
ADD bun.lockb .
ADD src/ ./src
ADD plv8ify-dist/ ./plv8ify-dist
ADD index.ts .

RUN bun install

CMD ["bun", "run", "start"]
