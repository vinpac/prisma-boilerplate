FROM node:14.15.4

EXPOSE 4000
WORKDIR /app

ENV JWT_SECRET="<development-only>"

COPY package.json .
COPY yarn.lock .
RUN yarn
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./prisma .

RUN ["yarn", "build"]
CMD ["yarn", "start"]
