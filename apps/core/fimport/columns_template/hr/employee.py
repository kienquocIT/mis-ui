__all__ = ['COLUMNS_HR_EMPLOYEE']

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.app_name import (
    SHEET_ACCOUNT_USERS, SHEET_HR_EMPLOYEE, SHEET_HR_GROUP, SHEET_HR_ROLE,
)
from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_HR_EMPLOYEE = ResolveColumnsFImport(
    sheet_name=SHEET_HR_EMPLOYEE,
    app_id='50348927-2c4f-4023-b638-445469c66953',
    url_name='HrEmployeeImportAPI',
    list_name='EmployeeList',
    create_name='EmployeeCreate',
    template_link='fimport/template/import-employees.xlsx',
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
            'remarks': [
                _('Code of employee')
            ],
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
            'name': _('First Name'),
            'input_name': 'first_name',
            'type': 'string',
            'remarks': [
                _('First name of employee')
            ],
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
            'name': _('Last Name'),
            'input_name': 'last_name',
            'type': 'string',
            'remarks': [
                _('Last name of employee')
            ],
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
            'name': _('Email'),
            'input_name': 'email',
            'type': 'string',
            'remarks': [
                _('Email of employee')
            ],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'email',
                    'minlength': 1,
                    'maxlength': 150,
                },
            },
        },
        {
            'name': _('Phone'),
            'input_name': 'phone',
            'type': 'string',
            'remarks': [
                _('Phone of employee')
            ],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'tel',
                    'data-valid-phone-vn': True,
                    'maxlength': 25,
                },
            },
        },
        {
            'name': _('User'),
            'input_name': 'user',
            'type': 'string',
            'remarks': [
                _('User link to employee')
            ],
            'is_foreign_key': SHEET_ACCOUNT_USERS,
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
        {
            'name': _('Date joined'),
            'input_name': 'date_joined',
            'type': 'string',
            'remarks': [
                _('Date joined of employee'),
                _('Format: DD-MM-YYYY'),
            ],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'data-type': 'date',
                    'data-valid-date': True,
                    'data-date-format': 'DD-MM-YYYY',
                },
            },
        },
        {
            'name': _('Date of Birthday'),
            'input_name': 'dob',
            'type': 'string',
            'remarks': [
                _('DOB of employee'),
                _('Format: DD-MM-YYYY'),
            ],
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'data-type': 'date',
                    'data-valid-date': True,
                    'data-date-format': 'DD-MM-YYYY',
                },
            },
        },
        {
            'name': _('Group'),
            'input_name': 'group',
            'type': 'string',
            'remarks': [
                _('Group of employee')
            ],
            'is_foreign_key': SHEET_HR_GROUP,
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
        {
            'name': _('Role'),
            'input_name': 'role',
            'type': 'string',
            'remarks': [
                _('Role of employee')
            ],
            'is_foreign_key': SHEET_HR_ROLE,
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
    ],
)
