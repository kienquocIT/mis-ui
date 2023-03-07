"""system module."""
import json

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
def workflow_field(value):
    """workflow tags convert field to html tag variavle params => autoescape=True"""
    result = ''
    try:
        value = json.loads(value)
    except json.JSONDecodeError as json_load_error:
        print('Template tags workflow_field: %r', json_load_error)

    # doc_id = value.get('id', '')
    field_title = conditional_escape(value.get('title', ''))
    # field_remark = conditional_escape(value.get('remark', ''))
    field_code = value.get('code', '')
    field_type = value.get('type', '')
    # field_content_type = value.get('content_type', '')
    # field_properties = value.get('properties', '')

    match field_type:
        case 'text':
            result = (f"<div class=\"form-group\">"
                      f"<label class=\"form-label\">{field_title}</label>"
                      f"<input type=\"text\" class=\"form-control\" name=\"{field_code}\">"
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
