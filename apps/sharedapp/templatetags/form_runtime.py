import random
import string

from django import template
from django.templatetags.static import static

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
    return static('assets/images/brand/bflow-by-mts/png/bflow-by-mts-original.png')


@register.simple_tag
def get_icon(value):
    if value:
        return value
    return static('assets/images/brand/bflow/png/icon/icon-bflow-original-36x36.png')


@register.simple_tag
def random_idx(length: int = 32):
    return random.choice(string.ascii_letters) + "".join(
        [
            random.choice(string.digits + string.ascii_letters) for _x in range(0, length - 1)
        ]
    )
