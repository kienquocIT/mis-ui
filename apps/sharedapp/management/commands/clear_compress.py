import os
import shutil
import sys

from django.core.management.commands.makemessages import Command as BaseMakeMessagesCommand
from django.conf import settings


class Command(BaseMakeMessagesCommand):
    def handle(self, *args, **options):
        sys.stdout.writelines(
            'Before clean COMPRESS with MEDIA ROOT dir: ' + str(os.listdir(settings.STATIC_ROOT)) + '\n'
        )
        shutil.rmtree(settings.COMPRESS_ROOT_PARENT)
        sys.stdout.writelines(
            'After clean COMPRESS is success with MEDIA ROOT dir: ' + str(os.listdir(settings.STATIC_ROOT)) + '\n'
        )
