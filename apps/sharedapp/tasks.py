from celery import shared_task
from django.core import management


@shared_task
def clean_session_expire():
    management.call_command("clearsessions", verbosity=0)
