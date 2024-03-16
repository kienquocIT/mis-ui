from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, TypeCheck
from apps.shared.apis import RespData


class MailTemplatesListView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='mailer/list.html',
        breadcrumb='MAILER_CONFIG_LIST_PAGE',
        menu_active='menu_mail_template',
        jsi18n='mailer',
    )
    def get(self, request, *args, **kwargs):
        base_url = 'mailer/template/';
        ctx = {
            'system_template': {
                'welcome': [
                    {
                        'title': 'Welcome 01',
                        'url': base_url + 'welcome/template_1.html',
                        'description': 'Hohoho',
                    }
                ],
                'calendar': [
                    {
                        'title': 'Calendar 01',
                        'url': base_url + 'calendar/template_1.html',
                        'description': 'Hahaha',
                    }
                ],
            }
        }
        return ctx, status.HTTP_200_OK


class MailTemplateCreateView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='mailer/create.html',
        breadcrumb='MAILER_CONFIG_LIST_PAGE',
        menu_active='menu_mail_template',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class MailTemplateDetailView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='mailer/detail.html',
        breadcrumb='MAILER_CONFIG_LIST_PAGE',
        menu_active='menu_mail_template',
    )
    def get(self, request, *args, pk, **kwargs):
        return {}, status.HTTP_200_OK


class MailTemplateUpdateView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='mailer/update.html',
        breadcrumb='MAILER_CONFIG_LIST_PAGE',
        menu_active='menu_mail_template',
    )
    def get(self, request, *args, pk, **kwargs):
        return {}, status.HTTP_200_OK


class MailTemplateListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.MAILER_LIST).get(data=params)
        return resp.auto_return(key_success='mailer')

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.MAILER_LIST).post(data=request.data)
        return resp.auto_return(key_success='mailer')


class MailTemplateDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            params = request.query_params.dict()
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.MAILER_LIST).get(data=params)
            return resp.auto_return(key_success='mailer')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.MAILER_LIST).post(data=request.data)
            return resp.auto_return(key_success='mailer')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def delete(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.MAILER_LIST).delete(data=request.data)
            return resp.auto_return(key_success='mailer')
        return RespData.resp_404()
