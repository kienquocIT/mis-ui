__all__ = ['COLUMNS_ACCOUNT_USER']

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_ACCOUNT_USER = ResolveColumnsFImport(
    app_id='af9c6fd3-1815-4d5a-aa24-fca9d095cb7a',
    template_link='fimport/template/af9c6fd3-1815-4d5a-aa24-fca9d095cb7a.xlsx',
    validate={
        'username': {
            'required': True,
            'minlength': 1,
        },
        'phone': {
            # 'check_phone_vn': {'hihi': True},
        }
    },
    columns=[
        {
            'name': 'STT',
            'type': 'number',
            'remarks': 'Order Numbering',
            'input_attrs': None,
            'col_attrs': {
                'class': 'col-1',
            },
        },
        {
            'name': 'Username',
            'type': 'string',
            'remarks': _('User name'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'name': 'username',
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': 'Last Name',
            'type': 'string',
            'remarks': 'First name',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'name': 'first_name',
                    'type': 'text',
                    'minlength': 1,
                }
            },
        },
        {
            'name': 'First Name',
            'type': 'string',
            'remarks': 'Last name',
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'name': 'last_name',
                    'type': 'text',
                    'minlength': 1,
                }
            },
        },
        {
            'name': 'Email',
            'type': 'email',
            'remarks': 'E-Mail',
            'input_attrs': {
                'kwargs': {
                    'name': 'email',
                    'type': 'email',
                }
            },
        },
        {
            'name': 'Phone Number',
            'type': 'phone',
            'remarks': 'Phone number',
            'input_attrs': {
                'kwargs': {
                    'name': 'phone',
                    'type': 'tel',
                    # 'pattern': "^((\+84)|0)([35789]|1[2389])([0-9]{8})$",
                    'data-valid-check-phone-vn': True, # "^((\+84)|0)([35789]|1[2389])([0-9]{8})$",
                }
            },
        },
    ],
).data
