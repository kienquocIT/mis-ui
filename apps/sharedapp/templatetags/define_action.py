from django import template

from apps.shared import RandomGenerate

register = template.Library()


@register.simple_tag
def define(val=None):
    return val


@register.simple_tag
def assign_out_random(value=None, length=32, start_with_letter=True):
    if value:
        return value
    return RandomGenerate.get_string(length=length, start_letter=start_with_letter)


@register.simple_tag
def assign_out_bool_str(value, default_value):
    if value in [True, 'true', 'True', '1', 1]:
        r_value = True
    elif value in [False, 'false', 'False', '0', 0]:
        r_value = False
    else:
        if default_value in [True, 'true', 'True', '1', 1]:
            r_value = True
        elif default_value in [False, 'false', 'False', '0', 0]:
            r_value = False
        else:
            r_value = False

    if r_value is True:
        return '1'
    return '0'
