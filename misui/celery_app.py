import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misui.settings')

app = Celery('misui')

# @setup_logging.connect
# def config_loggers(*args, **kwargs):
#     from logging.config import dictConfig
#     from django.conf import settings
#     dictConfig(settings.LOGGING)


# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    # Executes every 1minutes
    'clean-session-expire': {
        'task': 'apps.sharedapp.tasks.clean_session_expire',
        'schedule': crontab(minute=30, hour=23),
    }
}


app.conf.timezone = 'Asia/Ho_Chi_Minh'
# python manage.py migrate django_celery_results zero
# python manage.py migrate django_celery_results
