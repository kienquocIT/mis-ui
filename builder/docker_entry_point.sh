#!/bin/bash
set -e  # Dừng script nếu có lỗi xảy ra

#echo "🔄 Setting up message queue..."
#curl -i -u ${MSG_QUEUE_USER}:${MSG_QUEUE_PASSWORD} -X PUT "http://${MSG_QUEUE_HOST}:${MSG_QUEUE_API_PORT}/api/vhosts/${MSG_QUEUE_BROKER_VHOST}"

#echo "🔄 Initializing database..."
#python builder/init_db.py

echo "🔄 Running Django migrations..."
python manage.py migrate

echo "🗑️ Clearing old compressed files..."
python manage.py clear_compress

echo "📦 Collecting static files..."
echo "yes" | python manage.py collectstatic --noinput

echo "🚀 Starting Celery workers..."
celery -A misui worker --loglevel=info &

echo "📅 Starting Celery Beat scheduler..."
celery -A misui beat --loglevel=info -S django &

echo "🔥 Starting Gunicorn server..."
exec gunicorn misui.wsgi:application --bind 0.0.0.0:8000
