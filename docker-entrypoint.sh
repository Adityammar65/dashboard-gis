#!/bin/sh
set -eu

chown -R daemon:daemon /var/www/html/storage/app /var/www/html/bootstrap/cache

if [ -z "${APP_KEY:-}" ]; then
    key_file=/var/www/html/storage/app/.docker-app-key
    if [ ! -s "$key_file" ]; then
        su daemon -s /bin/sh -c 'php artisan key:generate --show' > "$key_file"
    fi
    export APP_KEY="$(cat "$key_file")"
fi

attempt=0
until su daemon -s /bin/sh -c 'php /usr/local/bin/wait-for-mysql.php'; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 60 ]; then
        echo 'MySQL connection failed after 120 seconds.' >&2
        exit 1
    fi
    echo 'Waiting for MySQL...'
    sleep 2
done

su daemon -s /bin/sh -c 'php artisan migrate --force && php artisan storage:link --force && exec php artisan serve --host=0.0.0.0 --port=8000'
