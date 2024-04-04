__all__ = [
    'COLUMNS_ACCOUNT_USER',
]

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_ACCOUNT_USER = ResolveColumnsFImport(
    sheet_name='#account.users',
    app_id='af9c6fd3-1815-4d5a-aa24-fca9d095cb7a',
    url_name='UserListAPI',
    list_name='UserList',
    create_name='UserCreate',
    template_link='fimport/template/import-account-user.xlsx',
    validate={
        'username': {
            'required': True,
            'minlength': 1,
        }
    },
    columns=[
        {
            'name': 'No.',
            'type': 'number',
            'remarks': _('Order Numbering'),
            'col_attrs': {
                'style': 'max-width: 50px',
            },
        },
        {
            'name': _('User name'),
            'input_name': 'username',
            'type': 'string',
            'remarks': [
                _('The string includes lowercase and uppercase letters, numbers, hyphens, and underscores.'),
                _('It is a unique identifier string for users within the organization.'),
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
            'name': _('First name'),
            'input_name': 'first_name',
            'type': 'string',
            'remarks': '',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                }
            },
        },
        {
            'name': _('Last name'),
            'input_name': 'last_name',
            'type': 'string',
            'remarks': '',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                }
            },
        },
        {
            'name': _('Password'),
            'input_name': 'password',
            'type': 'password',
            'remarks': [
                _('Must meet 2 of the following conditions'),
                _('Contains at least 1 lowercase letter'),
                _('Contains at least 1 uppercase letter'),
                _('Contains at least 1 number'),
                _('Contains at least 1 special character'),
            ],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 6,
                },
            },
        },
        {
            'name': 'Email',
            'input_name': 'email',
            'type': 'email',
            'remarks': [],
            'input_attrs': {
                'kwargs': {
                    'type': 'email',
                }
            },
        },
        {
            'name': _('Phone number'),
            'input_name': 'phone',
            'type': 'phone',
            'remarks': [],
            'input_attrs': {
                'kwargs': {
                    'type': 'tel',
                    'data-valid-check-phone-vn': True,  # "^((\+84)|0)([35789]|1[2389])([0-9]{8})$",
                }
            },
        },
    ],
)
