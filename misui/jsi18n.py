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
                match_data = I18N_JS_MATCH_APP[packages]
                if isinstance(match_data, list) and len(match_data) == 2:
                    kwargs['packages'] = match_data[0]
                    self.domain = match_data[1]
                else:
                    kwargs['packages'] = str(match_data)
            else:
                kwargs['packages'] = ''

        return super().get(request, *args, **kwargs)


I18N_JS_MATCH_APP = {
    'home': 'apps.core.home',
    'auth': 'apps.core.auths',
    'hr': 'apps.core.hr',
    'fimport': 'apps.core.fimport',
    'mailer': 'apps.core.mailer',
    'form': 'apps.core.form',
    'form_runtime': ['apps.core.form', 'djangojs_runtime'],
    'project_home': 'apps.sales.project',
    'attachment': 'apps.core.attachment',
    'log': 'apps.log',
}
