#!/bin/bash
python builder/init_db.py
python manage.py migrate
python manage.py clear_compress
echo "yes" | python manage.py collectstatic
gunicorn misui.wsgi:application --bind 0.0.0.0:8000
