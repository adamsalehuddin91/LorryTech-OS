#!/bin/sh
set -e

# Runtime startup — env vars (DB, etc.) are only injected by Coolify at runtime,
# so migrations and config/route cache must run here, not at build time.

echo "==> Running database migrations..."
php artisan migrate --force

# NOTE: no route:cache — web.php has closure routes (/, /dev-autologin) which
# are not serializable and would crash boot ("Unable to prepare route for serialization").
echo "==> Caching config..."
php artisan config:cache

echo "==> Starting supervisord..."
exec supervisord -c /etc/supervisord.conf
