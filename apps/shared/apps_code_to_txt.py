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
            'assettoolsprovide': _('Asset, Tools provide')
        }
    }

    @classmethod
    def get_data(cls):
        return cls.mapping
