from django.utils.translation import gettext_lazy as _

from apps.core.fimport.columns_template import ResolveColumnsFImport
from apps.core.fimport.columns_template.app_name import SHEET_SALEDATA_PAYMENT_TERM

COLUMNS_SALEDATA_PAYMENT_TERM = ResolveColumnsFImport(
    sheet_name=SHEET_SALEDATA_PAYMENT_TERM,
    app_id='3407d35d-27ce-407e-8260-264574a216e3',
    url_name='PaymentTermImportAPI',
    template_link='fimport/template/import-payment-term.xlsx',
    validate={
        'term': {
            'json': True,
            'pattern': "^\[(\[[012],( )?(\d)*,( )?[12],( )?(\d)*,( )?[123456]\](, )?)*\]$",
        }
    },
    columns=[
        {
            'name': 'No.',
            'type': 'number',
        },
        {
            'name': _('Code'),
            'input_name': 'code',
            'type': 'string',
            'remarks': [],
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
            'name': _('Title'),
            'input_name': 'title',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            },
        },
        {
            'name': _('Apply for'),
            'input_name': 'apply_for',
            'type': 'string',
            'remarks': [
                _('Selected from 0 (Sale) and 1 (Purchase)')
            ],
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'number',
                    'min': 0,
                    'max': 1,
                }
            }
        },
        {
            'name': _('Terms'),
            'input_name': 'term',
            'type': 'string',
            'remarks': [
                _('Is a list of data organized in an array'),
                _("Each element in the array being a configuration array as follows: [Type, Value, Date Type, Number of Days, Activation Condition]"),
                _('Type: The unit used for measuring the value, selected from 0 (Percentage), 1 (Quantity) and 2 (Balance)'),
                _('Value: Numerical data in the unit of measurement specified by the type'),
                _('Date Type: The type of date used for precise calculation regarding the number of days, selected from 1 (Workday) and 2 (Calendar day)'),
                _("Number of Days: Integer data representing the number of days for the formula, adhering to the day count of the Date Type"),
                _('Activation Condition: The time milestone when the event will be triggered, chosen from: 1 (Contract Signing Date), 2 (Delivery Date), 3 (Invoice Date), 4 (Approval Date), 5 (End of Billing Month), and 6 (Order Date)'),
            ],
            'col_attrs': {
                'class': 'col-4',
            },
            'input_attrs': {
                'args': ['required'],
                'kwargs': {
                    'type': 'text',
                    'minlength': 1,
                },
            }
        },
        {
            'name': _('Remarks'),
            'input_name': 'remark',
            'type': 'string',
            'remarks': [],
            'input_attrs': {
                'args': [],
                'kwargs': {
                    'type': 'text',
                    'maxlength': 200,
                },
            },
        },
    ],
)
