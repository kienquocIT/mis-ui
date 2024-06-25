#!/bin/bash
curl -i -u ${MSG_QUEUE_USER}:${MSG_QUEUE_PASSWORD} -X PUT http://${MSG_QUEUE_HOST}:${MSG_QUEUE_API_PORT}/api/vhosts/${MSG_QUEUE_BROKER_VHOST}
python builder/init_db.py
python manage.py migrate
python manage.py clear_compress
echo "yes" | python manage.py collectstatic
celery -A misui worker -l info &
celery -A misui beat -l info -S django &
gunicorn misui.wsgi:application --bind 0.0.0.0:8000
