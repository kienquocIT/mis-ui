__all__ = ['JavaScriptCatalogCustomize', 'I18N_JS_MATCH_APP']

from django.views.i18n import JavaScriptCatalog


class JavaScriptCatalogCustomize(JavaScriptCatalog):
    domain = 'djangojs'

    def get(self, request, *args, **kwargs):
        packages = kwargs.get('packages', '')
        if packages in ['null', 'Null', 'NULL', 'None', 'none', 'NONE']:
            kwargs['packages'] = ''
            packages = ''

        if packages:
            if packages in I18N_JS_MATCH_APP:
                kwargs['packages'] = I18N_JS_MATCH_APP[packages]
            else:
                kwargs['packages'] = ''

        return super().get(request, *args, **kwargs)


I18N_JS_MATCH_APP = {
    'hr': 'apps.core.hr',
}
