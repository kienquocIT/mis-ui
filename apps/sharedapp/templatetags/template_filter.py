"""system module"""
from django import template

register = template.Library()

@register.filter(name='add_class')
def extend_class(value, css_class):
    """additional class for element via update attribute"""
    return value.as_widget(attrs={
        "class": " ".join((value.css_classes(), css_class))
    })
