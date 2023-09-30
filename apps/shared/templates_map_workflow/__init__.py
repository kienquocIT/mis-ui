from .delivery_order_delivery import DELIVERY_DATA_MAP
from .purchasing_purchase_order import PURCHASE_ORDER_DATA_MAP
from .quotation_quotation import QUOTATION_DATA_MAP
from .sale_data_contact import SALE_DATA_CONTACT_MAP
from .sale_data_account import SALE_DATA_ACCOUNT_MAP
from .saleorder_sale_order import SALE_ORDER_DATA_MAP

__all__ = [
    'InputMappingProperties',
]


class InputMappingProperties:
    SALE_DATA_CONTACT = SALE_DATA_CONTACT_MAP
    SALE_DATA_ACCOUNT = SALE_DATA_ACCOUNT_MAP
    DELIVERY_ORDER_DELIVERY = DELIVERY_DATA_MAP
    QUOTATION_QUOTATION = QUOTATION_DATA_MAP
    SALE_ORDER_SALE_ORDER = SALE_ORDER_DATA_MAP
    PURCHASING_PURCHASE_ORDER = PURCHASE_ORDER_DATA_MAP
