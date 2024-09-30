from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import SHEET_SALEDATA_CURRENCY, SHEET_SALEDATA_PRICE_TAX_CATEGORY

COLUMNS_SALEDATA_CURRENCY = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_CURRENCY,
    app_id='1102a36d-5dbe-48f6-845e-a6e0e69e04b2',
    url_name='CurrencyImportAPI',
    template_link='fimport/template/import-saledata-currency.xlsx',
    validate={},
    columns=[
        {
            'name': 'No.',
            'type': 'number',
        },
        {
            'name': _('Code'),
            'input_name': 'abbreviation',
            'type': 'string',
            'remarks': [],
            'is_primary_key': True,
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                    'maxlength': 100,
                },
            },
        },
        {
            'name': _('Rate'),
            'input_name': 'rate',
            'type': 'number',
            'remarks': [],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'number',
                    'minlength': 1,
                },
            },
        },
        {
            'name': _('Currency Base Code'),
            'input_name': 'currency',
            'type': 'text',
            'remarks': [
                _('Currency code system for synchronizing exchange rates from VCB')
            ],
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'maxlength': 10,
                },
            },
        },
    ],
)

COLUMNS_SALEDATA_PRICE_TAX_CATEGORY = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRICE_TAX_CATEGORY,
    app_id='133e105e-cb3f-4845-8fba-bbb2516c5de2',
    url_name='PriceTaxCategoryImportAPI',
    template_link='fimport/template/import-saledata-price-taxcategory.xlsx',
    validate={},
    columns=[
        {
            'name': 'No.',
            'type': 'number',
        },
        {
            'name': _('Code'),
            'input_name': 'code',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                }
            }
        },
        {
            'name': _('Title'),
            'input_name': 'title',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                }
            }
        },
        {
            'name': _('Remarks'),
            'input_name': 'description',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
            'args': [],
                'kwargs': {
                    'type': 'text',
                    'maxlength': 200,
                },
            },
        }
    ]
)
