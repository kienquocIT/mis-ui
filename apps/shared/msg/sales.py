"""system module"""
from django.utils.translation import gettext_lazy as _


class SaleMsg:  # pylint: disable=too-few-public-methods
    """Sale's applications message translation"""
    OPPORTUNITY_CREATE = _('Opportunity create successfully')
    OPPORTUNITY_UPDATE = _('Opportunity update successfully')
    QUOTATION_CREATE = _('Quotation create successfully')
    QUOTATION_UPDATE = _('Quotation update successfully')
    SALE_ORDER_CREATE = _('Sale order create successfully')
    SALE_ORDER_UPDATE = _('Sale order update successfully')
    QUOTATION_CONFIG_UPDATE = _('Quotation config update successfully')
    SALE_ORDER_CONFIG_UPDATE = _('Sale order config update successfully')
    OPPORTUNITY_CONFIG_UPDATE = _('Opportunity config update successfully')
