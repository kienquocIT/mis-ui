"""register filter custom"""
import random

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


@register.simple_tag
def random_int(to_number: int) -> int:
    return random.randint(1, to_number)


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


register.filter('shorten_name', shorten_name)
