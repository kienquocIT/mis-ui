"""register filter custom"""
import random

from django import template

register = template.Library()


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
