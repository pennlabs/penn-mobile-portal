FROM node:10-buster as build

WORKDIR /app/

# Copy project dependencies
COPY package*.json /app/

# Install project dependencies
RUN npm install --production=true

# Copy project files
COPY . /app/

# Build project
RUN npm run build


FROM nginx:1.17.7

LABEL maintainer="Penn Labs"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build/ /usr/share/nginx/html
