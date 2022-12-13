from django.utils.translation import gettext_lazy as _


class AuthMsg(object):
    login_exc = _('Setup login return exception')
    login_success = _('Login successfully')
    KEY_TENANT_CODE = _('tenant_code')
    KEY_DETAIL = _('detail')