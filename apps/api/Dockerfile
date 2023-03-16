# ---------------------------
FROM node:18.13-alpine3.17 as builder

LABEL maintainer="Jonathan Robic <hello@jonathanrobic.fr>"

ENV PROJECT_DIR=/app
# good colors for most applications
ENV TERM xterm
# avoid million NPM install messages
ENV npm_config_loglevel warn

# Define the npm cache folder
ENV PNPM_STORE=/root/.cache/.pnpm-store
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR ${PROJECT_DIR}

RUN apk add --no-cache libc6-compat
RUN apk update \
  && apk add jq

COPY package.json ./

# Install pnpm
RUN mkdir -p /usr/local/share/pnpm \
  && npm i --location=global $(cat package.json | jq -r .packageManager) && pnpm --version \
  && pnpm bin -g \
  && pnpm add -g clean-modules

# ---------------------------

COPY ./scripts/ ./scripts/
COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY ./apps/api-node/package.json ./apps/api-node/package.json

RUN pnpm i --frozen-lockfile

COPY ./packages/eslint-config ./packages/eslint-config
COPY ./apps/api-node ./apps/api-node


# Build packages
RUN cd apps/api-node && \
  pnpm run prisma:generate && \
  pnpm run build

RUN pnpm clean:npm && \
  pnpm i -P --frozen-lockfile && \
  (cd apps/api-node && pnpm run prisma:generate) && \
  clean-modules -y

# ---------------------------
FROM node:18.13-alpine3.17 as api

ENV PROJECT_DIR=/app
ENV NODE_ENV=production

# good colors for most applications
ENV TERM xterm

WORKDIR ${PROJECT_DIR}

COPY --from=builder ${PROJECT_DIR} ${PROJECT_DIR}

WORKDIR ${PROJECT_DIR}/apps/api-node

CMD ["node", "dist/cmd/http/main"]
