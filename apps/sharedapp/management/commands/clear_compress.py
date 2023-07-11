import os
import shutil
import sys

from django.core.management.commands.makemessages import Command as BaseMakeMessagesCommand
from django.conf import settings


class Command(BaseMakeMessagesCommand):
    def handle(self, *args, **options):
        cache_path = os.path.join(settings.STATIC_ROOT, 'CACHE')
        if os.path.exists(cache_path):
            sys.stdout.writelines(
                'Clean CACHE compressor: ' + str(os.listdir(settings.STATIC_ROOT)) + '\n'
            )
            shutil.rmtree(cache_path)
        sys.stdout.writelines(
            'Done clear CACHE compressor command: ' + str(os.listdir(settings.STATIC_ROOT)) + '\n'
        )
