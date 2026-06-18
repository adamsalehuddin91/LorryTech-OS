FROM php:8.3-fpm-alpine AS base

RUN apk add --no-cache \
    nginx supervisor curl zip unzip git \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    oniguruma-dev libxml2-dev sqlite-dev \
    postgresql-dev \
    nodejs npm \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql pdo_pgsql mbstring xml gd bcmath opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY package.json package-lock.json ./
RUN npm ci --production=false

COPY . .

# Frontend build-time var — Vite bakes it into the bundle (runtime env too late).
# Pass via Coolify "Build Variable". Empty default = Maps disabled (graceful fallback).
ARG VITE_GOOGLE_MAPS_API_KEY=""
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

# bust-cache: migration-rename-fix-v2
RUN npm run build && rm -rf node_modules

RUN php artisan view:cache \
    && php artisan storage:link

RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
