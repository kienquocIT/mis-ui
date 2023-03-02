#!/bin/bash

python builder/dev-site/init_db.py

python manage.py migrate

echo "yes" | python manage.py collectstatic

gunicorn misui.wsgi:application --bind 0.0.0.0:8000
