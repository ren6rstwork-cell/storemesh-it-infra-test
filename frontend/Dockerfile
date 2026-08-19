# --- Storemesh IT Infra Test: React.js frontend image --------------------
# Multi-stage build: compile the React app in a Node image, then ship only
# the static build output in a tiny Nginx image. Keeps the final image
# small and avoids exposing Node/npm in production.

# Stage 1: build the static assets
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve the built assets with Nginx
FROM nginx:1.27-alpine AS serve

# Nginx config specific to serving this SPA (client-side routing fallback).
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
