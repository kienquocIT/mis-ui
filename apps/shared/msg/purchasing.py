"""system module"""
from django.utils.translation import gettext_lazy as _


class PurchasingMsg:  # pylint: disable=too-few-public-methods
    """Purchasing message translation"""
    PURCHASE_REQUEST_CREATE = _('Purchase request create successfully')
    PO_GR_NONE = _('None')
    PO_GR_WAIT = _('Wait')
    PO_GR_PART = _('Partially received')
    PO_GR_RECEIVED = _('Received')
