from django.utils.translation import gettext_lazy as _


class LoginMsg:
    TENANT_FAIL = _("Tenant Code does not match")
    USERNAME_FAIL = _("Username is required")
    PASSWORD_FAIL = _("Password is required")
    CAPTCHA_FAIL = _("Captcha must be completed")
    LOGIN_INSUFFICIENT = _("Insufficient login data")
