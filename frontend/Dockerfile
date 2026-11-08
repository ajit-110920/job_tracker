
# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install exact dependencies from package-lock.json
RUN npm ci

# Copy frontend source code
COPY . .

# Generate production build
RUN npm run build


# Stage 2: Serve the production build using Nginx
FROM nginx:stable-alpine

# Copy generated React files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
