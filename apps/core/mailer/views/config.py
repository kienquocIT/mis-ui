from django.urls import reverse
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, TypeCheck
from apps.shared.apis import RespData
from apps.shared.msg import TemplateMsg


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
        base_url = 'mailer/template/'
        ctx = {
            'system_info': [
                {
                    'form_id': 'frm-welcome',
                    'title': TemplateMsg.welcome_template,
                    'remarks': f"""
                        <p>{TemplateMsg.welcome_template_remark_1}</p>
                        <p>{TemplateMsg.welcome_template_remark_2}</p>
                    """,
                    'url': reverse('MailTemplateSystemDetailAPI', kwargs={'pk': '__pk__'}),
                    'method': 'PUT',
                    'url_get': reverse('MailTemplateSystemAPI', kwargs={'system_code': '1'}),
                    'system_code': '1',
                    'templates': [
                        {
                            'title': TemplateMsg.welcome_template + ' 01',
                            'url': base_url + 'welcome/template_1.html',
                            'description': '',
                        },
                    ],
                },
                {
                    'form_id': 'frm-otp-validate',
                    'title': TemplateMsg.otp_validate_template,
                    'remarks': f"""
                        <p>{TemplateMsg.otp_validate_template_remark_1}</p>
                    """,
                    'url': reverse('MailTemplateSystemDetailAPI', kwargs={'pk': '__pk__'}),
                    'method': 'PUT',
                    'url_get': reverse('MailTemplateSystemAPI', kwargs={'system_code': '3'}),
                    'system_code': '3',
                    'templates': [
                        {
                            'title': TemplateMsg.otp_validate_template + ' 01',
                            'url': base_url + 'otp_validation/template_1.html',
                            'description': '',
                        }
                    ],
                },
                {
                    'form_id': 'frm-calendar',
                    'title': TemplateMsg.calendar_template,
                    'remarks': f"""
                        <p>{TemplateMsg.calendar_template_remark_1}</p>
                    """,
                    'url': reverse('MailTemplateSystemDetailAPI', kwargs={'pk': '__pk__'}),
                    'method': 'PUT',
                    'url_get': reverse('MailTemplateSystemAPI', kwargs={'system_code': '2'}),
                    'system_code': '2',
                    'templates': [
                        {
                            'title': TemplateMsg.calendar_template + ' 01',
                            'url': base_url + 'calendar/template_1.html',
                            'description': '',
                        }
                    ],
                },
            ]
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
