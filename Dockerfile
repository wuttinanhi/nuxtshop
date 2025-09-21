FROM node:lts-alpine AS build
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV SHELL=bash
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "pnpm-lock.yaml", "pnpm-workspace.yaml", "./"]
RUN corepack enable
RUN pnpm setup
RUN pnpm add -g nuxt
RUN pnpm install --prod
COPY . .
RUN pnpm build

FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.output ./.output
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/mocks ./mocks
EXPOSE 3000
RUN chown -R node /usr/src/app

# ENV vars incase forgot .env
ENV DB_TYPE=postgres
ENV DB_HOST=UPDATE_ME
ENV DB_PORT=5432
ENV DB_USER=UPDATE_ME
ENV DB_PASS=UPDATE_ME
ENV DB_NAME=UPDATE_ME
ENV MOCK_DATA=true
ENV JWT=UPDATE_ME_secret
ENV STRIPE_SECRET_KEY=UPDATE_ME
ENV PAY_SUCCESS_URL=http://localhost:3000/pays/success
ENV PAY_CANCEL_URL=http://localhost:3000/pays/cancel
ENV STRIPE_CURRENCY=thb

USER node
CMD ["node", ".output/server/index.mjs"]
