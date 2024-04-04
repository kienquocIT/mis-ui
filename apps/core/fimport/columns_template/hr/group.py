__all__ = ['COLUMNS_HR_GROUPS', 'COLUMNS_HR_GROUPS_LEVEL']

from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template.tools import ResolveColumnsFImport

SHEET_HR_GROUP_LEVEL = '#hr.groups.level'
SHEET_HR_GROUP = '#hr.groups'

COLUMNS_HR_GROUPS_LEVEL = ResolveColumnsFImport(
    sheet_name=SHEET_HR_GROUP_LEVEL,
    app_id='d05237c5-0488-40aa-9384-b214412852bf',
    url_name='HrGroupLevelImportAPI',
    list_name='GroupLevelList',
    create_name='GroupLevelList',
    template_link='fimport/template/import-groups-level.xlsx',
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
            'name': _('Level'),
            'input_name': 'level',
            'type': 'number',
            'is_primary_key': True,
            'remarks': [],
            'input_attrs': {
                'args': ['required', 'data-unique'],
                'kwargs': {
                    'min': 1,
                    'type': 'number',
                },
            },
            'allow_edit_big_field': False,
        },
        {
            'name': _('Remarks'),
            'input_name': 'description',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                    'maxlength': 500,
                },
            },
        },
        {
            'name': _('First manager remarks'),
            'input_name': 'first_manager_description',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'maxlength': 500,
                },
            },
        },
        {
            'name': _('Second manager remarks'),
            'input_name': 'second_manager_description',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'maxlength': 500,
                },
            },
        },
    ],
)

COLUMNS_HR_GROUPS = ResolveColumnsFImport(
    sheet_name=SHEET_HR_GROUP,
    app_id='e17b9123-8002-4c9b-921b-7722c3c9e3a5',
    url_name='HrGroupImportAPI',
    list_name='GroupList',
    create_name='GroupCreate',
    template_link='fimport/template/import-groups.xlsx',
    validate={},
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
            'name': _('Code'),
            'input_name': 'code',
            'type': 'string',
            'remarks': _('Code of groups'),
            'is_primary_key': True,
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
            'name': _('Level'),
            'input_name': 'group_level',
            'type': 'string',
            'remarks': _('Level of groups'),
            'is_foreign_key': SHEET_HR_GROUP_LEVEL,
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                },
            },
            'allow_edit_big_field': False,
        },
        {
            'name': _('Title'),
            'input_name': 'title',
            'type': 'string',
            'remarks': _('Name of groups'),
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
            'name': _('Parent'),
            'input_name': 'parent_n',
            'type': 'string',
            'is_foreign_key': SHEET_HR_GROUP,
            'remarks': _('Parent of groups'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
        {
            'name': _('Remarks'),
            'input_name': 'description',
            'type': 'string',
            'remarks': _('Remarks of groups'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'maxlength': 600,
                },
            },
        },
        {
            'name': _('Members'),
            'input_name': 'group_employee',
            'type': 'string',
            'remarks': _('Members of groups'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
        {
            'name': _('First Manager'),
            'input_name': 'first_manager',
            'type': 'string',
            'remarks': _('First manager of groups'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
        {
            'name': _('First Manager Title'),
            'input_name': 'first_manager_title',
            'type': 'string',
            'remarks': _('First manager title of groups'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'maxlength': 100,
                },
            },
        },
        {
            'name': _('Second Manager'),
            'input_name': 'second_manager',
            'type': 'string',
            'remarks': _('Second manager of groups'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                },
            },
        },
        {
            'name': _('Second Manager Title'),
            'input_name': 'second_manager_title',
            'type': 'string',
            'remarks': _('Second manager title of groups'),
            'input_attrs': {
                'kwargs': {
                    'type': 'text',
                    'maxlength': 100,
                },
            },
        },
    ],
)
