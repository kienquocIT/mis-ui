from rest_framework import status
from rest_framework.views import APIView

from django.shortcuts import render
from django.views import View
from django.utils.translation import gettext_lazy as _
from apps.core.form.utils import FormAuthController
from apps.shared import mask_view, ServerAPI, ApiURL, TypeCheck
from apps.shared.apis import RespData
from apps.shared.http import HttpRequestControl


class FormKnowledgeView(View):
    @mask_view(
        login_require=True,
        template='form/extends/base/knowledge/index.html',
        jsi18n='form',
        breadcrumb='FORM_KNOWLEDGE',
        menu_active='menu_form_data',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FormListView(View):
    @mask_view(
        login_require=True,
        template='form/list.html',
        jsi18n='form',
        breadcrumb='FORM_LIST',
        menu_active='menu_form_data',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FormListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FORM_LIST).get(request.data)
        return resp.auto_return(key_success='form_list')


class FormCreateView(View):
    @mask_view(
        login_require=True,
        template='form/create.html',
        jsi18n='form',
        breadcrumb='FORM_CREATE',
        menu_active='menu_form_data',
        enable_page_content_css=False,
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FormCreateAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FORM_LIST).post(request.data)
        return resp.auto_return(key_success='form_list')


class FormDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get(request.data)
            return resp.auto_return(key_success='form_detail')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def delete(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).delete(request.data)
            return resp.auto_return(key_success='form_detail')
        return RespData.resp_404()


class FormDetailDuplicateAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_DETAIL_DUPLICATE.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).post(request.data)
            return resp.auto_return(key_success='form_duplicate')
        return RespData.resp_403()


class FormDetailForEntriesAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_DETAIL_FOR_ENTRIES.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get(request.data)
            return resp.auto_return(key_success='form_config_for_entries')
        return RespData.resp_404()


class FormUpdateView(View):
    @mask_view(
        login_require=True,
        template='form/update.html',
        jsi18n='form',
        breadcrumb='FORM_UPDATE',
        menu_active='menu_form_data',
        enable_page_content_css=False,
    )
    def get(self, request, *args, pk, **kwargs):
        return {}, status.HTTP_200_OK


class FormUpdateAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
            return resp.auto_return(key_success='form_update')
        return RespData.resp_404()


class FormUpdateTurnOnOffAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_DETAIL_TURN_ON_OFF.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
            return resp.auto_return(key_success='form_update')
        return RespData.resp_404()


def get_publish_data(request, form_code, use_at, params=None, headers=None):
    if not params:
        params = {}
    if not headers:
        headers = {}

    cls = FormAuthController(request=request)
    headers = {
        **headers,
        **cls.headers
    }
    domain_code = HttpRequestControl(request).get_sub_domain()
    url = ApiURL.FORM_PUBLISHED_RUNTIME_DETAIL.fill_key(form_code=form_code, tenant_code=domain_code, use_at=use_at)
    resp = ServerAPI(request=request, user=request.user, url=url, params=params, headers=headers).get()
    return resp


def get_publish_with_submitted_data(request, form_code, use_at, pk, params=None, headers=None):
    if not params:
        params = {}
    if not headers:
        headers = {}

    domain_code = HttpRequestControl(request).get_sub_domain()
    url = ApiURL.FORM_PUBLISHED_RUNTIME_DETAIL_WITH_SUBMITTED.fill_key(
        form_code=form_code, tenant_code=domain_code, use_at=use_at, pk=pk
    )
    cls = FormAuthController(request=request)
    headers = {
        **headers,
        **cls.headers
    }
    resp = ServerAPI(request=request, user=request.user, url=url, params=params, headers=headers).get()
    return resp


def get_submitted_data(request, form_code, params=None, headers=None):
    if not params:
        params = {}
    if not headers:
        headers = {}

    domain_code = HttpRequestControl(request).get_sub_domain()
    url = ApiURL.FORM_PUBLISHED_RUNTIME_CHECK_SUBMITTED.fill_key(form_code=form_code, tenant_code=domain_code)
    cls = FormAuthController(request=request)
    headers = {
        **headers,
        **cls.headers
    }
    resp = ServerAPI(request=request, user=request.user, url=url, params=params, headers=headers).get()
    return resp


def get_ctx_user_current(request, authentication_type):
    user_current = {}

    if authentication_type == 'system':
        if hasattr(request, 'user') and request.user.is_authenticated is True:
            user_obj = request.user
            if hasattr(user_obj, 'employee_current_data') and isinstance(user_obj.employee_current_data, dict):
                emp_data = user_obj.employee_current_data
                user_current = {
                    'full_name': emp_data.get('full_name', ''),
                }
    elif authentication_type == 'email':
        email = FormAuthController(request=request).email
        if email:
            user_current = {
                'full_name': email,
            }
    return user_current


def html_footer_sub_form():
    warning_txt = _(
        'Do not submit confidential information such as credit card details, mobile and ATM PINs, OTPs, '
        'account passwords, etc.'
    )
    power_by = _('Powered by')
    mail_report_abuse = "mailto:support@bflow.vn?Subject=Report%20abuse%20form&body=URL%3A%20%5BPlease%20replace" \
                        "%20with%20form%20URL%5D%0AFull%20name%3A%20%5BPlease%20replace%20with%20your%20full%20name" \
                        "%5D%0AOther%20contact%3A%20%5BPlease%20replace%20with%20your%20contact%20information%5D" \
                        "%0AReason%20for%20report%3A%20%5BPlease%20replace%20with%20your%20reason%5D"
    report_abuse = _('Report Abuse')
    logo_url = "https://www.bflow.vn/images/brand/bflow-by-mts/png/bflow-by-mts-original.png"
    return f"""
        <p class="foot-warning-text">
            {warning_txt}
        </p>
        <a href="{mail_report_abuse}" class="foot-report-abuse">{report_abuse}</a>
        <div class="foot-power-by">
            <span style="margin-right: 1rem;">{power_by}</span>
            <img src="{logo_url}" alt="" style="width: 100px;"/>
        </div>
    """


def publish_data(resp, code, request, use_at, submitted_data=None):
    result = resp.result
    if result and isinstance(result, dict):
        company_title = result.get('company_title', '')
        form_title = result.get('form_title', '')
        title = f"{company_title} - {form_title}"

        form_remark = result.get('form_remark', '')

        html_text = result.get('html_text', '').replace(
            '${footerSub}',
            html_footer_sub_form()
        )
        theme_assets = result.get('theme_assets', {})

        company_logo = result.get('company_logo', '')

        authentication_type = result.get('authentication_type', None)

        ctx = {
            'use_at': use_at,
            'code': code,
            'url': request.build_absolute_uri(),
            'logo': request.build_absolute_uri(company_logo) if company_logo else '',
            'title': title,
            'remark': form_remark,
            'html_text': html_text,
            'css': theme_assets.get('css', []),
            'language': 'vi',
            'user_current': get_ctx_user_current(request, authentication_type),
            'prevent_submit_form': False,
            'jsi18n': 'form_runtime',
            'submitted_id': submitted_data.get('id', None) if submitted_data else None,
            'submitted_data': submitted_data.get('body_data', None) if submitted_data else None,
        }
        return ctx
    raise ValueError('Response API format is incorrect format')


class FormSanitizeHTMLAPI(APIView):
    @classmethod
    def callback_success(cls, result):
        return result if isinstance(result, dict) else {'sanitize_html': ''}

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        url = ApiURL.FORM_SANITIZE_HTML
        data = request.data
        if isinstance(data, dict) and data.get('html', None):
            resp = ServerAPI(request=request, user=request.user, url=url).post(
                data={
                    'html': data['html']
                }
            )
            return resp.auto_return(callback_success=self.callback_success)
        return RespData.resp_404()


class FakePreviewIframe(View):
    @mask_view(login_require=True)
    def get(self, request, *args, form_code, **kwargs):
        return render(request, 'form/fake_iframe_preview.html', {'form_code': form_code})


class FormAuthLogView(View):
    @mask_view(
        login_require=True,
        template='form_log/log.html',
        jsi18n='form',
        breadcrumb='FORM_AUTH_LOG',
        menu_active='menu_form_data',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FormMailLogAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FORM_MAIL_LOG).get()
        return resp.auto_return(key_success='mail_log')
