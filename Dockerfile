FROM node:18-alpine

WORKDIR /app
# add local files
COPY . .

RUN \
  echo " Installing dependencies..." && \
  npm install && \
  echo "Done"

CMD npm run start

# ports and volumes
EXPOSE 3000