"""system module"""
from django.utils.translation import gettext_lazy as _


class SOMsg:  # pylint: disable=too-few-public-methods
    """Sale order message translation"""
    DELIVERY_TYPE_NONE = _('None')
    DELIVERY_TYPE_DELIVERING = _('Delivering')
    DELIVERY_TYPE_PART = _('Partially delivered')
    DELIVERY_TYPE_DELIVERED = _('Delivered')
    PAYMENT_STAGE_SO = _('Sale order')
    PAYMENT_STAGE_CONTRACT = _('Contract')
    PAYMENT_STAGE_DELIVERY = _('Delivery')
    PAYMENT_STAGE_ACCEPTANCE = _('Final acceptance')
    PAYMENT_DATE_TYPE_CONTRACT = _('Contract date')
    PAYMENT_DATE_TYPE_DELIVERY = _('Delivery date')
    PAYMENT_DATE_TYPE_ACCEPTANCE = _('Acceptance date')
