from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.app_name import (
    SHEET_SALEDATA_CONTACT, SHEET_HR_EMPLOYEE,
    SHEET_SALEDATA_SALUTATION, SHEET_SALEDATA_ACCOUNT,
)
from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_SALEDATA_CONTACT = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_CONTACT,
    app_id='828b785a-8f57-4a03-9f90-e0edf96560d7',
    url_name='SaleDataContactImportAPI',
    list_name='ContactList',
    create_name='ContactCreate',
    template_link='fimport/template/import-saledata-contact.xlsx',
    validate={},
)
COLUMNS_SALEDATA_CONTACT.add_column(
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
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Contact Owner'), data={
        'name': _('Contact Owner'),
        'input_name': 'owner',
        'type': 'string',
        'is_foreign_key': SHEET_HR_EMPLOYEE,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Salutation'), data={
        'name': _('Salutation'),
        'input_name': 'salutation',
        'type': 'string',
        'is_foreign_key': SHEET_SALEDATA_SALUTATION,
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Full name'), data={
        'name': _('Full name'),
        'input_name': 'fullname',
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
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Job Title'), data={
        'name': _('Job Title'),
        'input_name': 'job_title',
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
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Report To'), data={
        'name': _('Report To'),
        'input_name': 'report_to',
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
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Phone'), data={
        'name': _('Phone'),
        'input_name': 'mobile',
        'type': 'string',
        'remarks': [],
        'is_unique': True,
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
                'data-valid-phone-vn': True,
            },
        },
    }
)
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Email'), data={
        'name': _('Email'),
        'input_name': 'email',
        'type': 'string',
        'remarks': [],
        'is_unique': True,
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'email',
            },
        },
    }
)
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Account'), data={
        'name': _('Account'),
        'input_name': 'account_name',
        'type': 'string',
        'remarks': [],
        'is_foreign_key': SHEET_SALEDATA_ACCOUNT,
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'text',
            },
        },
    }
)
COLUMNS_SALEDATA_CONTACT.add_column(
    name=_('Biography'), data={
        'name': _('Biography'),
        'input_name': 'biography',
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
