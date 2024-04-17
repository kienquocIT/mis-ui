from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import (
    SHEET_SALEDATA_ACCOUNT_GROUP, SHEET_SALEDATA_ACCOUNT_TYPE,
    SHEET_SALEDATA_INDUSTRY, SHEET_SALEDATA_ACCOUNT, SHEET_HR_EMPLOYEE, SHEET_SALEDATA_CONTACT,
)

COLUMNS_SALEDATA_ACCOUNT_GROUP = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_ACCOUNT_GROUP,
    app_id='35b38745-ba92-4d97-b1f7-4675a46585d3',
    url_name='AccountGroupImportAPI',
    template_link='fimport/template/import-saledata-account-group.xlsx',
    validate={},
)
COLUMNS_SALEDATA_ACCOUNT_GROUP.add_column(
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
                'minlength': 1,
            },
        },
    }
)
COLUMNS_SALEDATA_ACCOUNT_GROUP.add_column(
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
COLUMNS_SALEDATA_ACCOUNT_GROUP.add_column(
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

COLUMNS_SALEDATA_ACCOUNT_TYPE = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_ACCOUNT_TYPE,
    app_id='b22a58d3-cc9e-4913-a06d-beee11afba60',
    url_name='AccountTypeImportAPI',
    template_link='fimport/template/import-saledata-account-type.xlsx',
    validate={},
)
COLUMNS_SALEDATA_ACCOUNT_TYPE.add_column(
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
                'minlength': 1,
            },
        },
    }
)
COLUMNS_SALEDATA_ACCOUNT_TYPE.add_column(
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
COLUMNS_SALEDATA_ACCOUNT_TYPE.add_column(
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

COLUMNS_SALEDATA_INDUSTRY = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_INDUSTRY,
    app_id='37eb1961-8103-46c5-ad2e-236f3a6585f5',
    url_name='IndustryImportAPI',
    template_link='fimport/template/import-saledata-industry.xlsx',
    validate={},
)
COLUMNS_SALEDATA_INDUSTRY.add_column(
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
                'minlength': 1,
            },
        },
    }
)
COLUMNS_SALEDATA_INDUSTRY.add_column(
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
COLUMNS_SALEDATA_INDUSTRY.add_column(
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

COLUMNS_SALEDATA_ACCOUNT = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_ACCOUNT,
    app_id='4e48c863-861b-475a-aa5e-97a4ed26f294',
    url_name='SaleDataAccountImportAPI',
    create_name='AccountCreate',
    list_name='AccountList',
    template_link='fimport/template/import-saledata-account.xlsx',
    validate={},
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
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
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Title'), data={
        'name': _('Title'),
        'input_name': 'name',
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
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Account Type'), data={
        'name': _('Account Type'),
        'input_name': 'account_type',
        'type': 'array split by commas',
        'is_foreign_key': SHEET_SALEDATA_ACCOUNT_TYPE,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Account Group'), data={
        'name': _('Account Group'),
        'input_name': 'account_group',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_ACCOUNT_GROUP,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Industry'), data={
        'name': _('Industry'),
        'input_name': 'industry',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_INDUSTRY,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Manager'), data={
        'name': _('Manager'),
        'input_name': 'manager',
        'type': 'array split by commas',
        'is_foreign_key': SHEET_HR_EMPLOYEE,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Website'), data={
        'name': _('Website'),
        'input_name': 'website',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
                'maxlength': 150,
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Phone'), data={
        'name': _('Phone'),
        'input_name': 'phone',
        'type': 'phone number vietnam',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
                'maxlength': 25,
                'data-valid-phone-vn': True,
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Email'), data={
        'name': _('Email'),
        'input_name': 'email',
        'type': 'email',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'email',
                'maxlength': 150,
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Tax Code'), data={
        'name': _('Tax Code'),
        'input_name': 'tax_code',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
                'maxlength': 150,
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Annual Revenue'), data={
        'name': _('Annual Revenue'),
        'input_name': 'annual_revenue',
        'type': 'select',
        'data_list': [
            (1, _('1-10 billions')),
            (2, _('10-20 billions')),
            (3, _('20-50 billions')),
            (4, _('50-200 billions')),
            (5, _('200-1000 billions')),
            (6, _('> 1000 billions')),
        ],
        'select2_config': {
            'allowClear': True,
        },
        'remarks': [
            _(
                "Annual Revenue, chosen from: 1 (1-10 billions), 2 (10-20 billions), 3 (20-50 billions), "
                "4 (50-200 billions), 5 (200-1000 billions), 6 (> 1000 billions)"
            ),
        ],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Total Employee'), data={
        'name': _('Total Employee'),
        'input_name': 'total_employees',
        'type': 'select',
        'data_list': [
            (1, _('< 20 people')),
            (2, _('20-50 people')),
            (3, _('50-200 people')),
            (4, _('200-500 people')),
            (5, _('> 500 people')),
        ],
        'select2_config': {
            'allowClear': True,
        },
        'remarks': [
            _(
                "Total employee, chosen from: 1 (< 20 people), 2 (20-50 people), 3 (50-200 people), 4 (200-500 "
                "people), 5 (> 500 people)"
            ),
        ],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
                'pattern': '[1-5]'
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Parent'), data={
        'name': _('Parent'),
        'input_name': 'parent_account_mapped',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_ACCOUNT,
        'remarks': [
            _("Code of parent"),
        ],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_column(
    name=_('Contact'), data={
        'name': _('Contact'),
        'input_name': 'contact_mapped',
        'type': 'json',
        'is_foreign_key': SHEET_SALEDATA_CONTACT,
        'remarks': [
            _('List of configurations associated with contacts'),
            _('The structure of each item in the list as follows: [Contact code, Default]'),
            _('Contact code: is the code of the contact function at #saledata.contact'),
            _('Is default: Only 1 contact is default with 0 being false, 1 being true'),
            _('Example: [[\"001\", 1],[\"002\", 0]]'),
        ],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
                'data-type': 'json',
                'data-valid-json': True,
            },
        },
    },
)
COLUMNS_SALEDATA_ACCOUNT.add_validate(
    name='contact_mapped', data={
        'json': True,
        'pattern': "^\[(\[\"[(a-zA-Z0-9_-]*\",(\s)?([0-1])*\][,\s]?)*\]$",
    }
)
