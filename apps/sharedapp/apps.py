"""app module"""
from django.apps import AppConfig


class SharedappConfig(AppConfig):
    """shared app config"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sharedapp'
