from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import (
    SHEET_SALEDATA_PRODUCT_UOMGROUP, SHEET_SALEDATA_PRODUCT_PRODUCT_TYPE, SHEET_SALEDATA_PRODUCT_PRODUCT_CATEGORY,
    SHEET_SALEDATA_PRODUCT_UOM,
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

COLUMNS_SALEDATA_PRODUCT_PRODUCT_TYPE = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRODUCT_PRODUCT_TYPE,
    app_id='90f07280-e2f4-4406-aa23-ba255a22ec2d',
    url_name='ProductProductTypeImportAPI',
    template_link='fimport/template/import-saledata-product-producttype.xlsx',
    validate={},
)

COLUMNS_SALEDATA_PRODUCT_PRODUCT_TYPE.add_column(
    name=_('Code'), data={
        'name': _('Code'),
        'input_name': 'code',
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

COLUMNS_SALEDATA_PRODUCT_PRODUCT_TYPE.add_column(
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

COLUMNS_SALEDATA_PRODUCT_PRODUCT_TYPE.add_column(
    name=_('Remarks'), data={
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
)

COLUMNS_SALEDATA_PRODUCT_PRODUCT_CATEGORY = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRODUCT_PRODUCT_CATEGORY,
    app_id='053c0804-162a-4357-a1c2-2161e6606cc2',
    url_name='ProductProductCategoryImportAPI',
    template_link='fimport/template/import-saledata-product-productcategory.xlsx',
    validate={},
)

COLUMNS_SALEDATA_PRODUCT_PRODUCT_CATEGORY.add_column(
    name=_('Code'), data={
        'name': _('Code'),
        'input_name': 'code',
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

COLUMNS_SALEDATA_PRODUCT_PRODUCT_CATEGORY.add_column(
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

COLUMNS_SALEDATA_PRODUCT_PRODUCT_CATEGORY.add_column(
    name=_('Remarks'), data={
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
)

COLUMNS_SALEDATA_PRODUCT_UOM = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRODUCT_UOM,
    app_id='7bc78f47-66f1-4104-a6fa-5ca07f3f2275',
    url_name='ProductUOMImportAPI',
    template_link='fimport/template/import-saledata-product-uom.xlsx',
    validate={},
)

COLUMNS_SALEDATA_PRODUCT_UOM.add_column(
    name=_('Code'), data={
        'name': _('Code'),
        'input_name': 'code',
        'type': 'string',
        'remarks': [],
        'is_primary_key': True,
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT_UOM.add_column(
    name=_('Title'), data={
        'name': _('Title'),
        'input_name': 'title',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT_UOM.add_column(
    name=_('UOM Group'), data={
        'name': _('UOM Group'),
        'input_name': 'group',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRODUCT_UOMGROUP,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

