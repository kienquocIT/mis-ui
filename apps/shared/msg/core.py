"""system module"""
from django.utils.translation import gettext_lazy as _


class CoreMsg:  # pylint: disable=too-few-public-methods
    """Core's applications message translation"""
    FOLDER_CREATE = _('Folder create successfully')
    FOLDER_UPDATE = _('Folder update successfully')
    RECURRENCE_CREATE = _('Recurrence create successfully')
    RECURRENCE_UPDATE = _('Recurrence update successfully')
