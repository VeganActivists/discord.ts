# SPDX-License-Identifier: MIT
# Vegan Activists (VeganActivists@proton.me)

FROM node:18.5.0-alpine3.15

WORKDIR /opt/build/vabot

ENV NODE_ENV="production"

COPY . .

RUN npm install

RUN npm run cleanBuild

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
