from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import (
    SHEET_SALEDATA_PRODUCT_UOMGROUP
)

COLUMNS_SALEDATA_PRODUCT_UOMGROUP = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRODUCT_UOMGROUP,
    app_id='eb5c547f-3a68-4113-8aa3-a1f938c9d3a7',
    url_name='ProductUOMGroupImportAPI',
    template_link='fimport/template/import-saledata-product-uomgroup.xlsx',
    validate={},
)
COLUMNS_SALEDATA_PRODUCT_UOMGROUP.add_column(
    name=_('Title'), data={
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
    }
)
