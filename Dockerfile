FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY resources ./resources
COPY vite.config.js ./
COPY public ./public
RUN npm run build

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs

FROM php:8.2-cli-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        autoconf \
        gcc \
        g++ \
        make \
        git \
        unzip \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libwebp-dev \
        libzip-dev \
        libonig-dev \
        libicu-dev \
        imagemagick \
        webp \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" gd mbstring pdo_mysql bcmath intl zip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY . .
RUN rm -f .env
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build
RUN printf '%s\n' '<?php' 'require dirname(__DIR__) . "/index.php";' > public/index.php

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && rm -rf bootstrap/cache/* \
    && chown -R daemon:daemon storage bootstrap/cache public

USER root

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
COPY wait-for-mysql.php /usr/local/bin/wait-for-mysql.php
RUN chmod +x /usr/local/bin/docker-entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]
