from .delivery_order_delivery import DELIVERY_DATA_MAP
from .quotation_quotation import QUOTATION_DATA_MAP
from .sale_data_contact import SALE_DATA_CONTACT_MAP
from .sale_data_account import SALE_DATA_ACCOUNT_MAP

__all__ = [
    'InputMappingProperties',
]


class InputMappingProperties:
    SALE_DATA_CONTACT = SALE_DATA_CONTACT_MAP
    SALE_DATA_ACCOUNT = SALE_DATA_ACCOUNT_MAP
    DELIVERY_ORDER_DELIVERY = DELIVERY_DATA_MAP
    QUOTATION_QUOTATION = QUOTATION_DATA_MAP
