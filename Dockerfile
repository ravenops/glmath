FROM node:13
RUN mkdir /glmath
WORKDIR /glmath
COPY package.json yarn.lock ./
RUN yarn && yarn cache clean
COPY . .
CMD yarn test
