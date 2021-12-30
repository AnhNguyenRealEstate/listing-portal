# syntax=docker/dockerfile:1
FROM node:16-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-prod
COPY . .

#Serve with nginx
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/listing-portal /usr/share/nginx/html

# Expose port 80
EXPOSE 80