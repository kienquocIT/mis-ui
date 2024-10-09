from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport, SHEET_SALEDATA_PRICE_TAX
from apps.core.fimport.columns_template.app_name import (
    SHEET_SALEDATA_PRODUCT_UOMGROUP, SHEET_SALEDATA_PRODUCT_PRODUCT_TYPE, SHEET_SALEDATA_PRODUCT_PRODUCT_CATEGORY,
    SHEET_SALEDATA_PRODUCT_UOM, SHEET_SALEDATA_PRODUCT,
)

COLUMNS_SALEDATA_PRODUCT_UOMGROUP = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRODUCT_UOMGROUP,
    app_id='eb5c547f-3a68-4113-8aa3-a1f938c9d3a7',
    url_name='ProductUOMGroupImportAPI',
    template_link='fimport/template/import-saledata-product-uomgroup.xlsx',
    validate={},
)

COLUMNS_SALEDATA_PRODUCT_UOMGROUP.add_column(
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
    template_link='fimport/template/import-saledata-product-prodcategory.xlsx',
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
        'is_primary_key': True,
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

COLUMNS_SALEDATA_PRODUCT_UOM.add_column(
    name=_('Is Referenced'), data={
        'name': _('Is Referenced'),
        'input_name': 'is_referenced_unit',
        'type': 'select',
        'data_list': [
                (0, _('False')),
                (1, _('True')),
        ],
        'select2_config': {
            'allowClear': True,
        },
        'remarks': [
            _(
                "Is referenced selection, chosen from: 0 (false), 1 (true)"
            ),],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT_UOM.add_column(
    name=_('Ratio'), data={
        'name': _('Ratio'),
        'input_name': 'ratio',
        'type': 'string',
        'remarks': [
            _(
                "If the current unit is referenced unit, ratio must be 1"
            ),],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT_UOM.add_column(
    name=_('Rounding'), data={
        'name': _('Rounding'),
        'input_name': 'rounding',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PRODUCT,
    app_id='a8badb2e-54ff-4654-b3fd-0d2d3c777538',
    url_name='ProductImportAPI',
    template_link='fimport/template/import-saledata-product.xlsx',
    validate={},
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Code'), data={
        'name': _('Code'),
        'input_name': 'code',
        'type': 'string',
        'is_primary_key': True,
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

COLUMNS_SALEDATA_PRODUCT.add_column(
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

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Part number'), data={
        'name': _('Part number'),
        'input_name': 'part_number',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
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

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Product choice'), data={
        'name': _('Product choice'),
        'input_name': 'product_choice',
        'type': 'json',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
                'data-type': 'json',
                'data-valid-json': True,
            },
        },
    },
)
COLUMNS_SALEDATA_PRODUCT.add_validate(
    name='product_choice', data={
        'json': True,
        'pattern': "^\[(0|1|2)?(,(0|1|2)){0,2}\]$",
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Product Type'), data={
        'name': _('Product Type'),
        'input_name': 'general_product_types_mapped',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRODUCT_PRODUCT_TYPE,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Product Category'), data={
        'name': _('Product Category'),
        'input_name': 'general_product_category',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRODUCT_PRODUCT_CATEGORY,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('UOM Group'), data={
        'name': _('UOM Group'),
        'input_name': 'general_uom_group',
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

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Traceability method'), data={
        'name': _('Traceability method'),
        'input_name': 'general_traceability_method',
        'type': 'select',
        'data_list': [
                (0, _('None')),
                (1, _('Batch/Lot number')),
                (2, _('Serial number'))
        ],
        'select2_config': {
            'allowClear': True,
        },
        'remarks': [
            _(
                "Traceability method selection, chosen from: 0 (None), 1 (Batch/Lot number), 2 (Serial number)"
            ),],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Length (cm)'), data={
        'name': _('Length (cm)'),
        'input_name': 'length',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Width (cm)'), data={
        'name': _('Width (cm)'),
        'input_name': 'width',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Height (cm)'), data={
        'name': _('Height (cm)'),
        'input_name': 'height',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Volume (cm3)'), data={
        'name': _('Volume (cm3)'),
        'input_name': 'volume',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Weight (gram)'), data={
        'name': _('Weight (gram)'),
        'input_name': 'weight',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Sale UOM'), data={
        'name': _('Sale UOM'),
        'input_name': 'sale_default_uom',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRODUCT_UOM,
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Sale Tax'), data={
        'name': _('Sale Tax'),
        'input_name': 'sale_tax',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRICE_TAX,
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Inventory UOM'), data={
        'name': _('Inventory UOM'),
        'input_name': 'inventory_uom',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRODUCT_UOM,
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Purchase UOM'), data={
        'name': _('Purchase UOM'),
        'input_name': 'purchase_default_uom',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRODUCT_UOM,
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Purchase Tax'), data={
        'name': _('Purchase Tax'),
        'input_name': 'purchase_tax',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_PRICE_TAX,
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)

COLUMNS_SALEDATA_PRODUCT.add_column(
    name=_('Supplied By'), data={
        'name': _('Supplied By'),
        'input_name': 'supplied_by',
        'type': 'select',
        'data_list': [
            (0, _('Purchasing')),
            (1, _('Making')),
        ],
        'select2_config': {
            'allowClear': True,
        },
        'remarks': [
            _(
                "Supply selection, chosen from: 0 (Purchasing), 1 (Making)"
            ), ],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    }
)



