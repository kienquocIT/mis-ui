__all__ = ['COLUMNS_HR_EMPLOYEE']

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_HR_EMPLOYEE = ResolveColumnsFImport(
    sheet_name='#hr.employees',
    app_id='50348927-2c4f-4023-b638-445469c66953',
    url_name='EmployeeListAPI',
    list_name='EmployeeList',
    # create_name='EmployeeCreate',
    template_link='fimport/template/import-employees.xlsx',
    validate={},
    columns=[
        {
            'name': 'No.',
            'type': 'number',
            'remarks': _('Order Numbering'),
            'col_attrs': {
                'class': 'col-1',
            },
        },
        {
            'name': _('Code'),
            'input_name': 'code',
            'type': 'string',
            'remarks': _('Code of employee'),
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
            'remarks': _('First name of employee'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': _('Last Name'),
            'input_name': 'last_name',
            'type': 'string',
            'remarks': _('Last name of employee'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': _('Email'),
            'input_name': 'email',
            'type': 'string',
            'remarks': _('Email of employee'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'email',
                    'minlength': 1,
                },
            },
        },
        {
            'name': _('Phone'),
            'input_name': 'phone',
            'type': 'string',
            'remarks': _('Phone of employee'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'tel',
                    'data-valid-check-phone-vn': True,
                },
            },
        },
        {
            'name': _('User'),
            'input_name': 'user',
            'type': 'string',
            'remarks': _('User link to employee'),
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
            'remarks': _('Date joined of employee. Format: dd/mm/YYYY.'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'data-valid-check-date': True,
                },
            },
        },
        {
            'name': _('Date of Birthday'),
            'input_name': 'dob',
            'type': 'string',
            'remarks': _('DOB of employee. Format: dd/mm/YYYY.'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'data-valid-check-date': True,
                },
            },
        },
        {
            'name': _('Group'),
            'input_name': 'group',
            'type': 'string',
            'remarks': _('Group of employee'),
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
            'remarks': _('Role of employee'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
    ],
)
