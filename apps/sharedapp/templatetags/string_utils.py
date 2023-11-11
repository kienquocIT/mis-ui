"""register filter custom"""
import json
import random
import string
from typing import Union

from django import template
from django.contrib.auth.models import AnonymousUser

register = template.Library()


@register.filter
def parsed_title_page(value):
    if value and isinstance(value, dict):
        return f'{value["title"]}'  # [{value["code"].upper()}] &#8901;
    return 'BFlow - Management Information System'


@register.filter
def shorten_name(value, upper=False):
    """Nguyen Van A --> NVA"""
    result = "".join(
        [
            x[0] if x else '' for x in value.split()
        ]
    )
    return result.upper() if upper else result.lower()


@register.simple_tag
def random_int(to_number: int) -> int:
    return random.randint(1, to_number)


@register.simple_tag
def random_str(length: int = 32):
    return "".join(
        [
            random.choice(string.digits + string.ascii_letters) for _x in range(0, length)
        ]
    )


@register.simple_tag
def random_full_name():
    return random.choice(
        ['Nguyễn Văn An', 'Nguyễn Văn Bình', 'Nguyễn Văn Cao', 'Nguyễn Văn Dũng', 'Nguyễn Văn Đức', 'Nguyễn Văn Huy',
         'Nguyễn Văn Hùng', 'Nguyễn Văn Khanh', 'Nguyễn Văn Long', 'Nguyễn Văn Nam', 'Nguyễn Văn Nhật',
         'Nguyễn Văn Quân',
         'Nguyễn Văn Sơn', 'Nguyễn Văn Tài', 'Nguyễn Văn Tuấn', 'Nguyễn Văn Vinh', 'Nguyễn Văn Vương',
         'Nguyễn Văn Tuấn',
         'Nguyễn Văn Việt', 'Nguyễn Thị Anh', 'Nguyễn Thị An', 'Nguyễn Thị Châu', 'Nguyễn Thị Chi', 'Nguyễn Thị Diệp',
         'Nguyễn Thị Hoa', 'Nguyễn Thị Hằng', 'Nguyễn Thị Hương', 'Nguyễn Thị Mai', 'Nguyễn Thị Mỹ', 'Nguyễn Thị Ngọc',
         'Nguyễn Thị Phương', 'Nguyễn Thị Quỳnh', 'Nguyễn Thị Trang', 'Nguyễn Thị Vân', 'Nguyễn Thị Vy',
         'Nguyễn Thị Xuyến',
         'Nguyễn Thị Yến']
    )


@register.simple_tag
def class_name_animal():
    icon = random.choice(
        (
            'fa-cat',
            'fa-crow',
            'fa-spider',
            'fa-paw',
            'fa-otter',
            'fa-kiwi-bird',
            'fa-horse-head',
            'fa-horse',
            'fa-hippo',
            'fa-frog',
            'fa-fish',
            'fa-dragon',
            'fa-dove',
            'fa-dog',
            'fa-bugs',
            'fa-worm',
            'fa-shrimp',
            'fa-shield-dog',
            'fa-shield-cat',
            'fa-mosquitto',
            'fa-locust',
            'fa-fish-fins',
            'fa-cow',
        )
    )
    color = random.choice(
        (
            'text-primary',
            'text-secondary',
            'text-success',
            'text-danger',
            'text-warning',
            'text-info',
            'text-dark',
            'text-muted',
        )
    )
    return f'{icon} {color}'


@register.filter
def replace_str(data, from_str_commas_to_str):
    arr = from_str_commas_to_str.split(",")
    if len(arr) == 2:
        return str(data).replace(arr[0], arr[1])
    return data


@register.filter
def str_first_upper(data):
    arr = []
    for index, item in enumerate(data.split(" ")):
        if index == 0:
            arr.append(item.capitalize())
        else:
            arr.append(item.lower())
    return " ".join(arr)


@register.filter(name='val_in_arr')
def val_in_arr(value, key) -> Union['0', '1']:
    if "*" in value:
        return '1'
    elif not value:
        return '1'
    return '1' if key in [str(ite).strip() for ite in value.split(",")] else '0'


@register.filter
def parse_0_or_1(data):
    if data in ['True', True, 1, '1']:
        return '1'
    return '0'


@register.simple_tag(name='parse_link')
def parse_link(data):
    if data:
        return data
    return '#'


@register.simple_tag(name='parse_bool')
def parse_bool(data):
    if data in [True, 'True', 1, '1']:
        return '1'
    return '0'


@register.simple_tag(name='parse_str')
def parse_str(data, default_data=''):
    if data and isinstance(data, str):
        return data
    return default_data


@register.simple_tag(name='define_var')
def define_var(data):
    return data


@register.simple_tag(name='priority_app')
def priority_app(value):
    default_value = ['opp', 'prj', 'inherit']
    if value:
        try:
            default_value = []
            arr = value.split("-")
            for item in arr:
                item = item.lower()
                if item in ['opp', 'prj', 'inherit']:
                    default_value.append(item)
            return default_value
        except Exception as err:
            print('[TemplateTag][priority_app] ', str(err))
        return []
    return default_value


@register.simple_tag(takes_context=True, name='data_onload_current_employee')
def data_onload_current_employee(context):
    result = []
    user_obj = context.request.user
    if user_obj and not isinstance(user_obj, AnonymousUser):
        employee_data = context.request.user.employee_current_data
        if (
                employee_data
                and 'id' in employee_data
                and 'first_name' in employee_data
                and 'last_name' in employee_data
                and 'full_name' in employee_data
                and 'email' in employee_data
        ):
            result = [{
                'id': employee_data['id'],
                'first_name': employee_data['first_name'],
                'last_name': employee_data['last_name'],
                'full_name': employee_data['full_name'],
                'email': employee_data['email'],
                'selected': True,
            }]
    return json.dumps(result)


@register.simple_tag(name='parse_data_or_default')
def parse_data_or_default(context, default_value=None, append_or_override='override'):
    if not context:
        return default_value
    if append_or_override == 'override':
        return context
    elif append_or_override == 'append':
        return f'{context} {default_value}'

    return context


@register.simple_tag(name='attr_and_value_else_blank')
def attr_and_value_else_blank(attr_name, attr_value, default_value=None, else_return=""):
    if attr_name:
        result = default_value if default_value else attr_value if attr_value else None
        if result:
            return f'{attr_name}={result}'
    return else_return


@register.filter
def pretty_json(value):
    try:
        return json.dumps(value, indent=4)
    except Exception as err:
        print(err)
    return ''


@register.simple_tag(name='permit_mapping_pretty_json')
def permit_mapping_pretty_json(value, app_by_id, exclude_key="", indent=4):
    try:
        for key in exclude_key.split(","):
            if key in value:
                del value[key]

        if 'app_depends_on' in value:
            result = {}
            for app_id, app_config in value['app_depends_on'].items():
                key = app_id
                app_data = app_by_id.get(app_id, {})
                if app_data:
                    key = f"{app_data['title']} - {app_data['code']}"
                result[key] = app_config
            value['app_depends_on'] = result
        return json.dumps(value, indent=indent)
    except Exception as err:
        print(err)
    return '{}'
