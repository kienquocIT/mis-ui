from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import SHEET_SALEDATA_CURRENCY, SHEET_SALEDATA_PRICE_TAX_CATEGORY, \
    SHEET_SALEDATA_PRICE_TAX

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

COLUMNS_SALEDATA_PRICE_TAX = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRICE_TAX,
    app_id='720d14f9-e031-4ffe-acb9-3c7763c134fc',
    url_name='PriceTaxImportAPI',
    template_link='fimport/template/import-saledata-price-tax.xlsx',
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
            'name': _('Type'),
            'input_name': 'tax_type',
            'type': 'select',
            'data_list': [
                (0, _('Purchase')),
                (1, _('Sale')),
                (2, _('Both Purchase and Sale')),
            ],
            'select2_config': {
                'allowClear': True,
            },
            'remarks': [
                _(
                    "Type selection, chosen from: 0 (Purchase), 1 (Sale), 2 (Both Purchase and Sale)"
                ),],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                },
            },
        },
        {
            'name': _('Category'),
            'input_name': 'category',
            'type': 'string',
            'remarks': [],
            'is_foreign_key': SHEET_SALEDATA_PRICE_TAX_CATEGORY,
            'input_attrs': {
            'args': ['required'],
                'kwargs': {
                    'type': 'text',
                },
            },
        },
{
            'name': _('Rate'),
            'input_name': 'rate',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
            'args': ['required'],
                'kwargs': {
                    'type': 'text',
                },
            },
        },
    ]
)