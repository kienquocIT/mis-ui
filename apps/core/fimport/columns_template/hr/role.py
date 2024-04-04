__all__ = ['COLUMNS_HR_ROLES']

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_HR_ROLES = ResolveColumnsFImport(
    sheet_name='#hr.roles',
    app_id='4cdaabcc-09ae-4c13-bb4e-c606eb335b11',
    url_name='RoleListAPI',
    list_name='RoleList',
    # create_name='RoleCreate',
    template_link='fimport/template/import-roles.xlsx',
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
            'name': _('Abbreviation'),
            'input_name': 'abbreviation',
            'type': 'string',
            'is_primary_key': True,
            'remarks': _('Abbreviation of roles'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': _('Title'),
            'input_name': 'title',
            'type': 'string',
            'remarks': _('Name of roles'),
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': _('Members'),
            'input_name': 'employees',
            'type': 'string',
            'remarks': _('Members of roles. Array ID split by commas.'),
            'input_attrs': {
                'args': [],
                'kwargs': {
                    'type': 'text',
                },
            },
        },
    ],
)
