from django.utils.translation import gettext_lazy as _

__all__ = [
    'COMPANY_SIZE',
    'CUSTOMER_REVENUE',
    'PICKING_STATE',
]

CUSTOMER_REVENUE = [
    {"value": 1, "name": _('1-10 billions')},
    {"value": 2, "name": _('10-20 billions')},
    {"value": 3, "name": _('20-50 billions')},
    {"value": 4, "name": _('50-200 billions')},
    {"value": 5, "name": _('200-1000 billions')},
    {"value": 6, "name": _('> 1000 billions')},
]

COMPANY_SIZE = [
    {"value": 1, "name": _('< 20 people')},
    {"value": 2, "name": _('20-50 people')},
    {"value": 3, "name": _('50-200 people')},
    {"value": 4, "name": _('200-500 people')},
    {"value": 5, "name": _('> 500 people')},
]

# Picking
PICKING_STATE = (
    (0, _('Ready')),
    (1, _('Done')),
)
# Delivery
DELIVERY_STATE = (
    (0, 'Wait'),
    (1, 'Partial'),
    (2, 'Full'),
)
