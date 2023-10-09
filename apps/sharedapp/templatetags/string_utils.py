"""register filter custom"""
import random
import string

from django import template

register = template.Library()


@register.filter
def parsed_title_page(value):
    if value and isinstance(value, dict):
        return f'{value["title"]}'  # [{value["code"].upper()}] &#8901;
    return 'MIS - Management Information System'


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
