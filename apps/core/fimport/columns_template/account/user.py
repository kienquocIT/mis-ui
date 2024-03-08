__all__ = ['COLUMNS_ACCOUNT_USER']

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_ACCOUNT_USER = ResolveColumnsFImport(
    app_id='af9c6fd3-1815-4d5a-aa24-fca9d095cb7a',
    url_name='UserListAPI',
    list_name='UserList',
    create_name='UserCreate',
    template_link='fimport/template/import-account-user.xlsx',
    validate={},
    columns=[
        {
            'name': 'STT',
            'type': 'number',
            'remarks': 'Order Numbering',
            'col_attrs': {
                'class': 'col-1',
            },
        },
        {
            'name': _('User name'),
            'input_name': 'username',
            'type': 'string',
            'remarks': '',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': 'Last Name',
            'input_name': 'first_name',
            'type': 'string',
            'remarks': 'First name',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                }
            },
        },
        {
            'name': 'First Name',
            'input_name': 'last_name',
            'type': 'string',
            'remarks': 'Last name',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                }
            },
        },
        {
            'name': 'Password',
            'input_name': 'password',
            'type': 'password',
            'remarks': 'Password',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': 'Email',
            'input_name': 'email',
            'type': 'email',
            'remarks': 'E-Mail',
            'input_attrs': {
                'kwargs': {
                    'type': 'email',
                }
            },
        },
        {
            'name': 'Phone Number',
            'input_name': 'phone',
            'type': 'phone',
            'remarks': 'Phone number',
            'input_attrs': {
                'kwargs': {
                    'type': 'tel',
                    'data-valid-check-phone-vn': True,  # "^((\+84)|0)([35789]|1[2389])([0-9]{8})$",
                }
            },
        },
    ],
)
