FROM node:14.15.4

EXPOSE 4000
WORKDIR /app

ENV JWT_SECRET="<required-to-build>"
ENV SENDGRID_API_KEY="<required-to-build>"
ENV SENDGRID_DEFAULT_SENDER="<required-to-build>"

COPY package.json .
COPY yarn.lock .
RUN yarn
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./prisma .

RUN ["yarn", "build"]
CMD ["yarn", "migrate", "&&", "yarn", "start"]
