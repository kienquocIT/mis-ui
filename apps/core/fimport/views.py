from django.views import View
from rest_framework import status

from apps.shared import mask_view


class FImportListView(View):
    @mask_view(
        auth_require=True,
        template='fimport/list.html',
        jsi18n='fimport',
        breadcrumb='IMPORT_LIST_PAGE',
        menu_active='menu_import_data',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FImportCreateView(View):
    @mask_view(
        auth_require=True,
        template='fimport/index.html',
        jsi18n='fimport',
        breadcrumb='IMPORT_CREATE_PAGE',
        menu_active='menu_import_data',
    )
    def get(self, request, *args, **kwargs):
        base_url = 'fimport/template/'
        ctx = {
            'af9c6fd3-1815-4d5a-aa24-fca9d095cb7a': {
                'template_link': base_url + 'af9c6fd3-1815-4d5a-aa24-fca9d095cb7a.xlsx',
                'columns': [
                    {
                        'name': 'STT',
                        'type': 'number',
                        'remarks': 'Order Numbering',
                    },
                    {
                        'name': 'Username',
                        'type': 'string',
                        'remarks': 'User name',
                    },
                    {
                        'name': 'Last Name',
                        'type': 'string',
                        'remarks': 'First name'
                    },
                    {
                        'name': 'First Name',
                        'type': 'string',
                        'remarks': 'Last name',
                    },
                    {
                        'name': 'Email',
                        'type': 'email',
                        'remarks': 'E-Mail',
                    },
                    {
                        'name': 'Phone Number',
                        'type': 'phone',
                        'remarks': 'Phone number',
                    }
                ],
            },
        }
        return ctx, status.HTTP_200_OK
