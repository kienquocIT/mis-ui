"""system module"""
from django.utils.translation import gettext_lazy as _


class SOMsg:  # pylint: disable=too-few-public-methods
    """Sale order message translation"""
    DELIVERY_TYPE_NONE = _('None')
    DELIVERY_TYPE_DELIVERING = _('Delivering')
    DELIVERY_TYPE_PART = _('Partially delivered')
    DELIVERY_TYPE_DELIVERED = _('Delivered')
