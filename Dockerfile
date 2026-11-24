# syntax=docker/dockerfile:1
# Static portal only: build the Vue SPA, serve it with nginx. No backend, no runtime secrets.
#   docker build -t nitrowater-static:local .
#   docker run --rm -p 18080:80 nitrowater-static:local
FROM node:24.22.3-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Build-time link injection (see src/config/links.ts). Empty args fall back to defaults.
ARG VITE_DOCS_URL
ARG VITE_TOOLS_URL
ARG VITE_BEIAN_NO
ENV VITE_DOCS_URL=${VITE_DOCS_URL} \
    VITE_TOOLS_URL=${VITE_TOOLS_URL} \
    VITE_BEIAN_NO=${VITE_BEIAN_NO}

RUN npm run build

FROM nginx:1.29-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80
