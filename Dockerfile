# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

RUN apt-get update && apt-get install -y openssl sqlite3

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm install -g npm@10.3.0

RUN npm ci

# Copy application code
COPY --link . .


ENV DATABASE_URL=file:sqlite.db
ENV PORT="3000"
ENV NODE_ENV="production"


# Build application
FROM base as build

# COPY --from=deps /app/node_modules /app/node_modules

ADD prisma .
RUN npx prisma generate
RUN npx prisma db push
RUN npx prisma db seed

ADD . .

RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli


# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

CMD [ "npm", "run", "start" ]
