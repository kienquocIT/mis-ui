import json

from django import template

register = template.Library()


@register.simple_tag
def cls_name_of_bastion_field(has_opp, has_prj, has_inherit, has_process):
    counter_true = sum(bool(item) for item in [has_opp, has_prj, has_inherit, has_process])
    if counter_true == 4:
        return 'col-lg-3 col-md-3 col-sm-6 col-12'
    if counter_true == 3:
        return 'col-lg-4 col-md-4 col-sm-6 col-12'
    if counter_true == 2:
        return 'col-lg-6 col-md-12'
    if counter_true == 1:
        return 'col-12'
    return 'hidden'


@register.simple_tag
def override_list_form_app(list_from_app, new_list_from_app):
    if new_list_from_app:
        return new_list_from_app
    return list_from_app


@register.filter
def process_runtime_to_me(employee_current_data):
    if employee_current_data and 'id' in employee_current_data:
        return f"creator={employee_current_data['id']}&creator_title={employee_current_data.get('full_name', '')}"
    return ''
