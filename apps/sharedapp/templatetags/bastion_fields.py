from django import template

register = template.Library()


@register.simple_tag
def cls_name_of_bastion_field(has_opp, has_prj, has_inherit):
    counter_true = sum(bool(item) for item in [has_opp, has_prj, has_inherit])
    if counter_true == 3:
        return 'col-lg-4 col-md-4 col-sm-6 col-12'
    if counter_true == 2:
        return 'col-sm-6 col-12'
    if counter_true == 1:
        return 'col-12'
    return 'hidden'
