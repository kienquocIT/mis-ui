from django import template

register = template.Library()


def parse_person_data(data):
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')
    avatar = data.get('avatar', '')
    return avatar, f'{last_name[0] if len(last_name) > 0 else ""}{first_name[0] if len(first_name) > 0 else ""}'


@register.filter
def render_avatar(person_data, opts: dict = None):  # using `x|render_avatar|safe` after use this templatetags
    if not opts:
        opts = {}

    cls_name = opts.get('cls_name', '')
    avatar, short_name = parse_person_data(person_data if isinstance(person_data, dict) else {})

    if avatar:
        return f"""<div class="avatar avatar-rounded {cls_name if cls_name else 'avatar-xs'}">
        <img 
            src="{avatar if avatar else ''}" 
            alt="{short_name}" 
            class="avatar-img"
        >
        </div>"""
    return f'<div class="avatar avatar-rounded {cls_name if cls_name else "avatar-xs avatar-primary"}">' \
           f'<span class="initial-wrap">{short_name}</span></div>'


@register.filter
def render_avatar_tag(person_data):  # using `x|render_avatar_tag|safe` after use this templatetags
    avatar, short_name = parse_person_data(person_data if isinstance(person_data, dict) else {})

    if avatar:
        return f"""<img 
            src="{avatar if avatar else ''}" 
            alt="{short_name}" 
            class="avatar-img"
        >"""
    return f'<span class="initial-wrap">{short_name}</span>'
