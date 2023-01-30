from django import forms
from django.forms import formset_factory

from ..form_custom import MultiForm, convert_data

LEFT_COND = (
    ('req_type', 'Request type'),
    ('total_value', 'Total value'),
)
MATH = [
    ('<', '<'),
    ('<=', '<='),
    ('>', '>'),
    ('>=', '>='),
    ('=', '='),
]
RIGHT_COND = [
    ('sup_new', 'Supply new'),
    ('upgrade', 'Upgrade'),
]
LOGIC_CONDITION = [
    ('AND', 'And'),
    ('OR', 'Or')
]


class ParameterFrom(forms.Form):
    left_cond = forms.ChoiceField(label="Left condition", required=False, choices=LEFT_COND)
    math = forms.ChoiceField(label="Math condition", required=False, choices=MATH)
    right_cond = forms.ChoiceField(label="Right condition", required=False, choices=RIGHT_COND)
    type = forms.ChoiceField(label="Type condition", required=False, choices=LOGIC_CONDITION)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class ConditionForm(forms.Form):
    name = forms.CharField(label='Condition name', max_length=80, required=False)
    logic = forms.ChoiceField(label='Logic', choices=LOGIC_CONDITION, required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['logic'].widget.attrs.update({'title': 'Logic'})


class ConditionFormset(MultiForm):
    form_classes = {
        'condition': formset_factory(ConditionForm, can_order=True, can_delete=True, min_num=1, extra=0),
        'parameter': formset_factory(ParameterFrom, can_order=True, can_delete=True, min_num=1, extra=0)
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
