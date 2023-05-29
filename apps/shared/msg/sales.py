"""system module"""
from django.utils.translation import gettext_lazy as _


class SaleMsg:  # pylint: disable=too-few-public-methods
    """Sale's applications message translation"""
    OPPORTUNITY_CREATE = _('Opportunity create successfully')
    OPPORTUNITY_UPDATE = _('Opportunity update successfully')
    QUOTATION_CREATE = _('Quotation create successfully')
    QUOTATION_UPDATE = _('Quotation update successfully')
