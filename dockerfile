FROM node:18-apine3.16

RUN mkdir -p /home/merchant

COPY . /home/merchant

WORKDIR "/home/merchant"

RUN npm install

RUN npm install typescript --save-dev

RUN npx tsc

CMD [ "npm","start" ]