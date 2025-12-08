from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import SHEET_SALEDATA_SHIFT

COLUMNS_HR_SHIFT =  ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_SHIFT,
    app_id='2b015840-7032-4e82-986d-3b0d48c85e8f',
    url_name='ShiftImportAPI',
    template_link='fimport/template/import-hr-shift.xlsx',
    validate={},
)

# Basic info
COLUMNS_HR_SHIFT.add_column(
    name=_('Title'), data={
        'name': _('Title'),
        'input_name': 'title',
        'type': 'string',
        'remarks': [],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'text',
                'minlength': 1,
                'maxlength': 150,
            },
        },
    }
)

# Check-in time fields
COLUMNS_HR_SHIFT.add_column(
    name=_('Check-in Time'), data={
        'name': _('Check-in Time'),
        'input_name': 'checkin_time',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 07:00)')],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Check-in Grace Start'), data={
        'name': _('Check-in Grace Start'),
        'input_name': 'checkin_gr_start',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 06:30)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Check-in Grace End'), data={
        'name': _('Check-in Grace End'),
        'input_name': 'checkin_gr_end',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 07:30)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Check-in Threshold'), data={
        'name': _('Check-in Threshold'),
        'input_name': 'checkin_threshold',
        'type': 'number',
        'remarks': [_('Minutes (default: 0)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'number',
                'min': 0,
            },
        },
    }
)

# Break-in time fields
COLUMNS_HR_SHIFT.add_column(
    name=_('Break-in Time'), data={
        'name': _('Break-in Time'),
        'input_name': 'break_in_time',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 12:00)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Break-in Grace Start'), data={
        'name': _('Break-in Grace Start'),
        'input_name': 'break_in_gr_start',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 11:30)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Break-in Grace End'), data={
        'name': _('Break-in Grace End'),
        'input_name': 'break_in_gr_end',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 12:30)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Break-in Threshold'), data={
        'name': _('Break-in Threshold'),
        'input_name': 'break_in_threshold',
        'type': 'number',
        'remarks': [_('Minutes (default: 0)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'number',
                'min': 0,
            },
        },
    }
)

# Break-out time fields
COLUMNS_HR_SHIFT.add_column(
    name=_('Break-out Time'), data={
        'name': _('Break-out Time'),
        'input_name': 'break_out_time',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 12:30)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Break-out Grace Start'), data={
        'name': _('Break-out Grace Start'),
        'input_name': 'break_out_gr_start',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 12:00)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Break-out Grace End'), data={
        'name': _('Break-out Grace End'),
        'input_name': 'break_out_gr_end',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 13:00)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Break-out Threshold'), data={
        'name': _('Break-out Threshold'),
        'input_name': 'break_out_threshold',
        'type': 'number',
        'remarks': [_('Minutes (default: 0)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'number',
                'min': 0,
            },
        },
    }
)

# Check-out time fields
COLUMNS_HR_SHIFT.add_column(
    name=_('Check-out Time'), data={
        'name': _('Check-out Time'),
        'input_name': 'checkout_time',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 17:00)')],
        'input_attrs': {
            'args': ['required'],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Check-out Grace Start'), data={
        'name': _('Check-out Grace Start'),
        'input_name': 'checkout_gr_start',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 16:30)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Check-out Grace End'), data={
        'name': _('Check-out Grace End'),
        'input_name': 'checkout_gr_end',
        'type': 'time',
        'remarks': [_('Format: HH:MM (e.g., 17:30)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'time',
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Check-out Threshold'), data={
        'name': _('Check-out Threshold'),
        'input_name': 'checkout_threshold',
        'type': 'number',
        'remarks': [_('Minutes (default: 0)')],
        'input_attrs': {
            'args': [],
            'kwargs': {
                'type': 'number',
                'min': 0,
            },
        },
    }
)

COLUMNS_HR_SHIFT.add_column(
    name=_('Working Days'), data={
        'name': _('Working Days'),
        'input_name': 'working_day_list',
        'type': 'json',
        'remarks': [
            _('JSON object with days and true/false values'),
            _('Keys: Mon, Tue, Wed, Thu, Fri, Sat, Sun'),
            _('Example: {"Mon": true, "Tue": true, "Wed": true, "Thu": true, "Fri": true, "Sat": false, "Sun": false}'),
        ],
        'input_attrs': {
            'kwargs': {
                'type': 'text',
                'data-type': 'json',
                'data-valid-json': True,
            },
        },
    },
)

COLUMNS_HR_SHIFT.add_validate(
    name='working_day_list', data={
        'json': True,
        'pattern': r'^{(\s*"(Mon|Tue|Wed|Thu|Fri|Sat|Sun)":\s*(true|false)\s*,?\s*){7}}$',
    }
)