__all__ = ['COLUMNS_HR_ROLES']

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.app_name import SHEET_HR_EMPLOYEE, SHEET_HR_ROLE
from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

COLUMNS_HR_ROLES = ResolveColumnsFImport(
    sheet_name=SHEET_HR_ROLE,
    app_id='4cdaabcc-09ae-4c13-bb4e-c606eb335b11',
    url_name='HrRoleImportAPI',
    list_name='RoleList',
    create_name='RoleCreate',
    template_link='fimport/template/import-roles.xlsx',
    validate={},
    columns=[
        {
            'name': 'No.',
            'type': 'number',
        },
        {
            'name': _('Abbreviation'),
            'input_name': 'abbreviation',
            'type': 'string',
            'is_primary_key': True,
            'remarks': [
                _('Abbreviation of roles'),
            ],
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
            'remarks': [
                _('Name of roles'),
            ],
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
            'remarks': [
                _('Members of roles. Array ID split by commas.'),
            ],
            'is_foreign_key': SHEET_HR_EMPLOYEE,
            'input_attrs': {
                'args': [],
                'kwargs': {
                    'type': 'text',
                },
            },
        },
    ],
)
