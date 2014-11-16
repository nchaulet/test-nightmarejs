FROM google/nodejs

RUN \
  apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y vim git wget libfreetype6 libfontconfig bzip2

RUN npm install -g phantomjs
RUN npm install -g nodemon
WORKDIR /app
COPY . /app

RUN npm install
EXPOSE 3000
CMD ["nodemon", "/app/index.js"]
