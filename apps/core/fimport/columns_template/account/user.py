__all__ = [
    'COLUMNS_ACCOUNT_USER',
]

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.app_name import SHEET_ACCOUNT_USERS
from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_ACCOUNT_USER = ResolveColumnsFImport(
    sheet_name=SHEET_ACCOUNT_USERS,
    app_id='af9c6fd3-1815-4d5a-aa24-fca9d095cb7a',
    url_name='CoreAccountUserImportAPI',
    list_name='UserList',
    create_name='UserCreate',
    template_link='fimport/template/import-account-user.xlsx',
)
COLUMNS_ACCOUNT_USER.add_column(
    name=_('User name'), data={
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
    }
)
COLUMNS_ACCOUNT_USER.add_column(
    name=_('Last name'), data={
        'name': _('Last name'),
        'input_name': 'last_name',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
                'minlength': 1,
            }
        },
    }
)
COLUMNS_ACCOUNT_USER.add_column(
    name=_('First name'), data={
        'name': _('First name'),
        'input_name': 'first_name',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
                'minlength': 1,
            }
        },
    }
)
COLUMNS_ACCOUNT_USER.add_column(
    name=_('Password'), data={
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
    }
)
COLUMNS_ACCOUNT_USER.add_column(
    name='Email', data={
        'name': 'Email',
        'input_name': 'email',
        'type': 'email',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'email',
            }
        },
    }
)
COLUMNS_ACCOUNT_USER.add_column(
    name=_('Phone number'), data={
        'name': _('Phone number'),
        'input_name': 'phone',
        'type': 'phone',
        'remarks': [],
        'input_attrs': {
            'kwargs': {
                'type': 'tel',
                'data-valid-phone-vn': True,  # "^((\+84)|0)([35789]|1[2389])([0-9]{8})$",
            }
        },
    }
)
