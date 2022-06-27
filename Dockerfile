FROM debian
USER root
RUN apt-get update
RUN apt install -y nodejs npm
COPY app /var/app
WORKDIR /var/app
RUN npm install
CMD npm run dev
