# Stage 1: Build React app
FROM node:alpine3.18 AS builder

WORKDIR /usr/share/app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from previous stage
COPY --from=builder /usr/share/app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
