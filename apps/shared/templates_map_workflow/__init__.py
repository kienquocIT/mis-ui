from .cashoutflow_advance import ADVANCE_DATA_MAP
from .cashoutfow_payment import PAYMENT_DATA_MAP
from .delivery_order_delivery import DELIVERY_DATA_MAP
from .inventory_goods_receipt import GOODS_RECEIPT_DATA_MAP
from .purchasing_purchase_order import PURCHASE_ORDER_DATA_MAP
from .purchasing_purchase_request import PURCHASE_REQUEST_DATA_MAP
from .quotation_quotation import QUOTATION_DATA_MAP
from .sale_data_contact import SALE_DATA_CONTACT_MAP
from .sale_data_account import SALE_DATA_ACCOUNT_MAP
from .saleorder_sale_order import SALE_ORDER_DATA_MAP
from .eoffice_leave_request import LEAVE_DATA_MAP
from .eoffice_business_trip import BUSINESS_TRIP_DATA_MAP

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
    INVENTORY_GOODS_RECEIPT = GOODS_RECEIPT_DATA_MAP
    PURCHASING_PURCHASE_REQUEST = PURCHASE_REQUEST_DATA_MAP
    LEAVE_DATA_MAP = LEAVE_DATA_MAP
    CASHOUTFLOW_ADVANCE = ADVANCE_DATA_MAP
    CASHOUTFLOW_PAYMENT = PAYMENT_DATA_MAP
    BUSINESS_TRIP_DATA_MAP = BUSINESS_TRIP_DATA_MAP
