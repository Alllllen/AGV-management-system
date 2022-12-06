FROM node:alpine
RUN apk add g++ make py3-pip

COPY . /workspace
WORKDIR /workspace
# ENV PORT=1883 WSPORT=8883
RUN npm install

# EXPOSE 1883 8883

CMD node server.js

# docker build --no-cache -t mqtt/broker .
# docker run -p 1883:1883 -p 8883:8883 -d mqtt/broker

# docker system prune --volumes