FROM docker:19.03.13
RUN apk --update add nodejs

WORKDIR /app
COPY . /app

ENTRYPOINT ["node", "/app/dist/index.js"]
