from django import template
from django.templatetags.static import static

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
def render_avatar_tag(person_data, default_image=False):
    # using `x|render_avatar_tag|safe` after use this templatetags
    avatar, short_name = parse_person_data(person_data if isinstance(person_data, dict) else {})
    use_default_img = False

    if not avatar and default_image is True:
        use_default_img = True
        avatar = static('assets/images/systems/person-avt.png')

    if avatar:
        return f"""<img 
            src="{avatar if avatar else ''}" 
            alt="{short_name if short_name else ''}" 
            class="avatar-img {'img-filter-opacity-75' if use_default_img == True else ''}"
            style="width: 100%; height: 100%;"
        >"""
    return f"""<span class="initial-wrap"></span>"""


@register.filter(name='language_full_name')
def revert_language_to_full_name(value):
    if value:
        if value == 'vi':
            return 'Tiếng Việt'
        if value == 'en':
            return 'English'
    return ''
