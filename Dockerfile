FROM node:18-alpine

WORKDIR /app
# add local files
COPY ./documents ./documents
COPY ./src ./src
COPY ./public ./public
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

RUN \
  echo " Installing dependencies..." && \
  npm install --ignore-scripts && \
  echo "Done"

CMD npm run start

# ports and volumes
EXPOSE 3000