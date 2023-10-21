FROM node:18-alpine

USER node

WORKDIR /app
# add local files
COPY --chown=node:node ./documents ./documents
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./public ./public
COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./package-lock.json ./package-lock.json
COPY --chown=node:node ./tsconfig.json ./tsconfig.json


RUN \
  echo " Installing dependencies..." && \
  npm install --ignore-scripts && \
  echo "Done"

CMD npm run start

# ports and volumes
EXPOSE 3000