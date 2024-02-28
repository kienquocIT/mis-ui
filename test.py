from django.utils import translation


def test():
    translation.activate('vi')
    print(translation.gettext_lazy('Preview full'))
