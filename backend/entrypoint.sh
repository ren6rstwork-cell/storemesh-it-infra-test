#!/bin/sh
# Entrypoint for the Django backend container.
#
# 1. Waits for PostgreSQL to accept connections (the `db` service can take
#    a few seconds longer to start than the `backend` container).
# 2. Runs database migrations.
# 3. Collects static files.
# 4. Starts the app server (passed in as CMD, e.g. gunicorn or runserver).
set -e

HOST="${POSTGRES_HOST:-db}"
PORT="${POSTGRES_PORT:-5432}"

echo "Waiting for PostgreSQL at ${HOST}:${PORT}..."
until python - <<PYEOF
import socket, sys
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(1)
try:
    s.connect(("${HOST}", ${PORT}))
except OSError:
    sys.exit(1)
else:
    sys.exit(0)
PYEOF
do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is up."

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
