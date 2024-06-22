import random
import string

from django import template

register = template.Library()


@register.filter('startswith')
def startswith(text, starts):
    if isinstance(text, str):
        return text.startswith(starts)
    return False


@register.simple_tag
def check_split_static(value):
    if value and value.startswith('/static/form/'):
        value = value.replace('/static/', '')
        return value
    return ''


@register.simple_tag
def get_logo(value):
    if value:
        return value
    return 'https://www.bflow.vn/images/logo/logo_180x180.png'


@register.simple_tag
def random_idx(length: int = 32):
    return random.choice(string.ascii_letters) + "".join(
        [
            random.choice(string.digits + string.ascii_letters) for _x in range(0, length - 1)
        ]
    )
