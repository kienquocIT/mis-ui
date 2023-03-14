from django.utils.translation import gettext_lazy as _


class PermsMsg(object):
    USER = _('User')
    USER_STAFF = _('User\'s staff (lower grade)')
    ALL_STAFF = _('All staff in user\'s group')
    ALL_USER = _('All users')
