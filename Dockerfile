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

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && rm -rf bootstrap/cache/* \
    && chown -R daemon:daemon storage bootstrap/cache public

USER daemon

EXPOSE 8000

CMD ["sh", "-c", "if [ -z \"$APP_KEY\" ]; then key_file=/var/www/html/storage/app/.docker-app-key; if [ ! -s \"$key_file\" ]; then php artisan key:generate --show > \"$key_file\"; fi; export APP_KEY=\"$(cat \"$key_file\")\"; fi; php artisan migrate --force && php artisan storage:link --force && exec php artisan serve --host=0.0.0.0 --port=8000"]
