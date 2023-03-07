import json
import ast

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.html import conditional_escape, mark_safe

register = template.Library()


# ('text', 'Text')
# ('text_area', 'Text area')
# ('date_time', 'Date time')
# ('select', 'Choices')
# ('check', 'Checkbox')
# ('file', 'Files')
# ('masterdata', 'Master data')

@register.filter(needs_autoescape=True)
@stringfilter
def workflow_field(value, autoescape=True):
    result = ''
    try:
        # value = ast.literal_eval(value)
        if not isinstance(value, dict):
            value = json.loads(value)
    except Exception as e:
        print('Template tags workflow_field has some error: ', e)
        return {}

    doc_id = value.get('id', '')
    title = conditional_escape(value.get('title', ''))
    remark = conditional_escape(value.get('remark', ''))
    code = value.get('code', '')
    type = value.get('type', '')
    content_type = value.get('content_type', '')
    properties = value.get('properties', '')

    match type:
        case 'text':
            result = (f"<div class=\"form-group\">"
                      f"<label class=\"form-label\">{title}</label>"
                      f"<input type=\"text\" class=\"form-control\" name=\"{code}\">"
                      f"</div>"
                      )
        case 'text_area':
            pass
        case 'date_time':
            pass
        case 'select':
            pass
        case 'check':
            pass
        case 'file':
            pass
        case 'masterdata':
            pass
        case _:
            result = value

    return mark_safe(result)
