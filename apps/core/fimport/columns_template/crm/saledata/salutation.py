from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import SHEET_SALEDATA_SALUTATION

COLUMNS_SALEDATA_SALUTATION = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_SALUTATION,
    app_id='d3903adb-61a9-4b18-90ed-542ce7acedc8',
    url_name='SalutationImportAPI',
    template_link='fimport/template/import-saledata-salutation.xlsx',
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
            'is_primary_key': True,
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
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
                },
            },
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
        },
    ],
)
