"""register filter custom"""
from django import template

register = template.Library()


def shorten_name(value, upper=False):
    """Nguyen Van A --> NVA"""
    result = "".join(
        [
            x[0] if x else '' for x in value.split()
        ]
    )
    return result.upper() if upper else result.lower()


register.filter('shorten_name', shorten_name)
