__all__ = [
    'AppsCodeToList',
]

from django.utils.translation import gettext_lazy as _


class AppsCodeToList:
    mapping = {
        'quotation': {
            'quotation': _('Quotation')
        },
        'saleorder': {
            'saleorder': _('Sale Order')
        },
        'leave': {
            'leaverequest': _('Leave request')
        },
        'businesstrip': {
            'businessrequest': _('Business request')
        },
        'assettools': {
            'assettoolsprovide': _('Asset, Tools provide'),
            'assettoolsdelivery': _('Asset, Tools delivery'),
        },
        'task': {
            'opportunitytask': _('Task')
        },
        'saledata': {
            'contact': _('Contact'),
            'account': _('Account'),
            'product': _('Product'),
            'expenses': _('Expenses'),
            'expenseitem': _('Expenses Item'),
            'warehouse': _('Warehouse'),
            'goodreceipt': _('Good receipt'),
            'price': _('Price'),
            'shipping': _('Shipping'),
            'paymentterm': _('Payment Terms'),
        },
        'opportunity': {
            'opportunity': _('Opportunity'),
            'documentforcustomer': _('Document For Customers'),
            'opportunitycall': _('Call Log'),
            'opportunityemail': _('Email Log'),
            'meetingwithcustomer': _('Metting Log'),
        },
        'delivery': {
            'orderpickingsub': _('Delivery'),
            'orderdeliverysub': _('Picking'),
        },
        'promotion': {
            'promotion': _('Promotion'),
        },
        'cashoutflow': {
            'advancepayment': _('Advance Payment'),
            'payment': _('Payment'),
            'returnadvance': _('Return Advance'),
        },
        'contract': {
            'contract': _('Contract'),
        },
        'purchasing': {
            'purchasequotationrequest': _('Purchase quotation request'),
            'purchasequotation': _('Purchase quotation'),
            'purchaseorder': _('Purchase order'),
            'purchaserequest': _('Purchase request'),
        },
    }

    @classmethod
    def get_data(cls):
        return cls.mapping
