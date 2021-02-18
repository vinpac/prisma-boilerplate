FROM node:14.15.4

EXPOSE 4000
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./prisma .

RUN ["yarn", "build"]
CMD ["yarn", "migrate", "&&", "yarn", "start"]
