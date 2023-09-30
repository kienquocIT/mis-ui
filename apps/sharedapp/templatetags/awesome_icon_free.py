from django.utils.translation import gettext_lazy as _

from django import template

register = template.Library()


@register.simple_tag
def icon_choices() -> list[list]:
    data = [
        ['fa-solid fa-address-book', 'address-book'], ['fa-solid fa-address-card', 'address-card'],
        ['fa-solid fa-arrows-spin', 'arrows-spin'], ['fa-solid fa-bars-progress', 'bars-progress'],
        ['fa-solid fa-bars-staggered', 'bars-staggered'], ['fa-solid fa-book', 'book'],
        ['fa-solid fa-box-archive', 'box-archive'], ['fa-solid fa-boxes-packing', 'boxes-packing'],
        ['fa-solid fa-briefcase', 'briefcase'], ['fa-solid fa-bullhorn', 'bullhorn'],
        ['fa-solid fa-business-time', 'business-time'], ['fa-solid fa-cake-candles', 'cake-candles'],
        ['fa-solid fa-calculator', 'calculator'], ['fa-solid fa-calendar-days', 'calendar-days'],
        ['fa-solid fa-certificate', 'certificate'], ['fa-solid fa-chart-line', 'chart-line'],
        ['fa-solid fa-chart-pie', 'chart-pie'], ['fa-solid fa-chart-simple', 'chart-simple'],
        ['fa-solid fa-circle-nodes', 'circle-nodes'], ['fa-solid fa-city', 'city'],
        ['fa-solid fa-clipboard', 'clipboard'], ['fa-solid fa-clipboard-question', 'clipboard-question'],
        ['fa-solid fa-cloud', 'cloud'], ['fa-solid fa-comment', 'comment'], ['fa-solid fa-comments', 'comments'],
        ['fa-solid fa-compass', 'compass'], ['fa-solid fa-envelope', 'envelope'],
        ['fa-solid fa-envelope-circle-check', 'envelope-circle-check'], ['fa-solid fa-face-smile', 'face-smile'],
        ['fa-solid fa-fax', 'fax'], ['fa-solid fa-file', 'file'], ['fa-solid fa-folder', 'folder'],
        ['fa-solid fa-folder-open', 'folder-open'], ['fa-solid fa-globe', 'globe'],
        ['fa-solid fa-hands-asl-interpreting', 'hands-asl-interpreting'],
        ['fa-solid fa-highlighter', 'highlighter'], ['fa-solid fa-house-laptop', 'house-laptop'],
        ['fa-solid fa-icons', 'icons'], ['fa-solid fa-inbox', 'inbox'], ['fa-solid fa-landmark', 'landmark'],
        ['fa-solid fa-laptop-file', 'laptop-file'], ['fa-solid fa-lightbulb', 'lightbulb'],
        ['fa-solid fa-list-check', 'list-check'],
        ['fa-solid fa-magnifying-glass-arrow-right', 'magnifying-glass-arrow-right'],
        ['fa-solid fa-magnifying-glass-chart', 'magnifying-glass-chart'], ['fa-solid fa-marker', 'marker'],
        ['fa-solid fa-message', 'message'], ['fa-solid fa-microphone', 'microphone'],
        ['fa-solid fa-mobile-screen-button', 'mobile-screen-button'], ['fa-solid fa-mug-saucer', 'mug-saucer'],
        ['fa-solid fa-network-wired', 'network-wired'], ['fa-solid fa-note-sticky', 'note-sticky'],
        ['fa-solid fa-paper-plane', 'paper-plane'], ['fa-solid fa-paperclip', 'paperclip'],
        ['fa-solid fa-pen', 'pen'], ['fa-solid fa-pen-nib', 'pen-nib'],
        ['fa-solid fa-pen-to-square', 'pen-to-square'], ['fa-solid fa-person-chalkboard', 'person-chalkboard'],
        ['fa-solid fa-phone', 'phone'], ['fa-solid fa-print', 'print'], ['fa-solid fa-registered', 'registered'],
        ['fa-solid fa-scale-balanced', 'scale-balanced'], ['fa-solid fa-signal', 'signal'],
        ['fa-solid fa-star', 'star'], ['fa-solid fa-sun', 'sun'], ['fa-solid fa-tag', 'tag'],
        ['fa-solid fa-thumbtack', 'thumbtack'], ['fa-solid fa-timeline', 'timeline'],
        ['fa-solid fa-video', 'video'], ['fa-solid fa-voicemail', 'voicemail'],
        ['fa-solid fa-walkie-talkie', 'walkie-talkie'], ['fa-solid fa-wallet', 'wallet']
    ]
    return data


@register.simple_tag
def bg_choices() -> list[str]:
    data = [
        'light', 'primary', 'success', 'warning', 'danger', 'info', 'dark', 'red', 'green', 'pink', 'purple', 'violet',
        'indigo', 'blue', 'sky', 'cyan', 'teal', 'neon', 'lime', 'sun', 'yellow', 'orange', 'pumpkin', 'brown', 'gray',
        'gold', 'smoke'
    ]
    return data


@register.simple_tag
def text_color_choices() -> list[str]:
    data = ['dark', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'muted', 'white']
    return data
