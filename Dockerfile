FROM node:lts-alpine as build
# ENV NODE_ENV=production
RUN yarn global add nuxt
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production --silent
COPY . .
RUN yarn build

FROM node:lts-alpine as production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.output ./.output
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/mocks ./mocks
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["yarn", "start"]
