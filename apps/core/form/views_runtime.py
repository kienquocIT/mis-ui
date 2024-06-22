from django.http.request import HttpHeaders
from django.shortcuts import render
from django.views import View
from django.views.decorators.clickjacking import xframe_options_exempt
from rest_framework.views import APIView

from apps.core.form.views import (
    get_publish_data, publish_data, auto_return_view, get_submitted_data,
    get_publish_width_submitted_data,
)
from apps.shared import ApiURL, ServerAPI, mask_view, TypeCheck
from apps.shared.apis import RespData
from apps.shared.csrf import APIAllowAny, CSRFCheckSessionAuthentication
from apps.shared.decorators import OutLayoutRender
from apps.shared.http import HttpRequestControl


class FormPublishedRuntimeView(View):
    def get(self, request, *args, form_code, **kwargs):
        resp = get_publish_data(request, form_code, 'view')
        if resp.state:
            if resp.result.get('is_public', False) is True:
                ctx = publish_data(resp=resp, code=form_code, request=request, use_at='view')
                return render(request, 'form/runtime/new.html', ctx)
        return auto_return_view(resp, request)


class FormPublishedRuntimeIFrame(View):
    @xframe_options_exempt
    def get(self, request, *args, form_code, **kwargs):
        resp = get_publish_data(request, form_code, 'iframe')
        if resp.state:
            if resp.result.get('is_iframe', False) is True:
                ctx = publish_data(resp=resp, code=form_code, request=request, use_at='iframe')
                return render(request, 'form/runtime/new.html', ctx)
        return auto_return_view(resp, request)


FORM_CODE_LENGTH = 32


class FormSubmittedViewEdit(View):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, form_code, pk, **kwargs):
        if len(form_code) == FORM_CODE_LENGTH and TypeCheck.check_uuid(pk):
            resp = get_publish_width_submitted_data(request, form_code, 'view', pk)
            if resp.state:
                if resp.result.get('is_public', False) is True:
                    edit_submitted = resp.result.get('edit_submitted', False)
                    if edit_submitted is True:
                        submitted_data = resp.result.get('submitted_data', {})
                        ctx = publish_data(
                            resp=resp, code=form_code, request=request, use_at='view',
                            submitted_data=submitted_data
                        )
                        return render(request, 'form/runtime/edit.html', {
                            **ctx,
                            'pk': pk,
                        })
            return auto_return_view(resp, request)
        return OutLayoutRender(request=request).render_404()


class FormSubmittedOnlyView(View):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, form_code, pk, **kwargs):
        if len(form_code) == FORM_CODE_LENGTH and TypeCheck.check_uuid(pk):
            resp = get_publish_width_submitted_data(request, form_code, 'view', pk)
            if resp.state:
                if resp.result.get('is_public', False) is True:
                    submitted_data = resp.result.get('submitted_data', {})
                    ctx = publish_data(
                        resp=resp, code=form_code, request=request, use_at='view',
                        submitted_data=submitted_data
                    )
                    return render(request, 'form/runtime/only_view.html', {
                        **ctx,
                        'pk': pk,
                    })
            return auto_return_view(resp, request)
        return OutLayoutRender(request=request).render_404()


class PostDataAbstract(APIView):
    class Meta:
        abstract = True

    # default if user is unauthenticated so csrf check was skipped.
    # Keep CSRFCheckSessionAuthentication at view post without authenticated
    # if you aren't expert flow permission_classes and authentication_classes
    # please discuss with leader or using bastion option (not override classes)
    permission_classes = [APIAllowAny]  # force skip check permit action when skip authenticated
    authentication_classes = [CSRFCheckSessionAuthentication]  # force check csrf

    def _get_request_data(self):
        return {
            'PATH': self.request.path,
            'PATH_INFO': self.request.path_info,
            'METHOD': self.request.method,
            'ENCODING': self.request.encoding,
            'CONTENT_TYPE': self.request.content_type,
            'CONTENT_PARAMS': self.request.content_params,
        }

    def _get_user_agent(self):
        meta_data = self.request.META
        return {
            'CONTENT_LENGTH': meta_data.get('CONTENT_LENGTH', ''),
            'CONTENT_TYPE': meta_data.get('CONTENT_TYPE', ''),
            'HTTP_ACCEPT': meta_data.get('HTTP_ACCEPT', ''),
            'HTTP_ACCEPT_ENCODING': meta_data.get('HTTP_ACCEPT_ENCODING', ''),
            'HTTP_ACCEPT_LANGUAGE': meta_data.get('HTTP_ACCEPT_LANGUAGE', ''),
            'HTTP_HOST': meta_data.get('HTTP_HOST', ''),
            'HTTP_REFERER': meta_data.get('HTTP_REFERER', ''),
            'HTTP_USER_AGENT': meta_data.get('HTTP_USER_AGENT', ''),
            'QUERY_STRING': meta_data.get('QUERY_STRING', ''),
            'REMOTE_ADDR': meta_data.get('REMOTE_ADDR', ''),
            'REMOTE_HOST': meta_data.get('REMOTE_HOST', ''),
            'REMOTE_USER': meta_data.get('REMOTE_USER', ''),
            'REQUEST_METHOD': meta_data.get('REQUEST_METHOD', ''),
        }

    def get_meta_data(self):
        return {
            **self._get_request_data(),
            **self._get_user_agent(),
        }

    def get_query_params(self):
        query_params = self.request.query_params.dict()
        ref_name = query_params.pop('referrername', None)
        return {
            'ref_name': ref_name,
            'params': query_params
        }

    def get_body_data(self):
        data = self.request.data
        if 'csrfmiddlewaretoken' in data:
            del data['csrfmiddlewaretoken']
        return data

    def valid_csrf_token__in_body(self):
        # csrf protect in session and cookies was checked before execute here
        # check csrf in headers and body again (code csrf header and body != session and cookies)
        if (
                hasattr(self.request, 'headers')
                and isinstance(self.request.headers, HttpHeaders)
                and 'X-CSRFToken' in self.request.headers
                and hasattr(self.request, 'data')
                and isinstance(self.request.data, dict)
                and 'csrfmiddlewaretoken' in self.request.data
        ):
            body_csrf_token = self.request.data.get('csrfmiddlewaretoken', None)
            header_csrf_token = self.request.headers.get('X-CSRFToken', None)
            if body_csrf_token and header_csrf_token:
                return body_csrf_token == header_csrf_token
        return False

    def get_full_body_data(self):
        params = self.get_query_params()
        return {
            'body_data': self.get_body_data(),
            'ref_name': params['ref_name'],
            'params': params['params'],
            'meta_data': self.get_meta_data(),
        }


class FormPostNewData(PostDataAbstract):
    def post_data(self):
        body_data = self.get_full_body_data()
        domain_code = HttpRequestControl(self.request).get_sub_domain()
        url = ApiURL.FORM_PUBLISHED_RUNTIME_DETAIL.fill_key(
            form_code=self.kwargs['form_code'],
            use_at=self.kwargs['use_at'],
            tenant_code=domain_code
        )
        resp = ServerAPI(request=self.request, user=self.request.user, url=url).post(data=body_data)
        return resp.auto_return(key_success='form_post')

    @mask_view(login_require=False, is_api=True)
    def post(self, request, *args, form_code, use_at, **kwargs):
        if request.data:
            if form_code and len(form_code) == FORM_CODE_LENGTH and use_at and use_at in ['view', 'iframe']:
                if self.valid_csrf_token__in_body():
                    return self.post_data()
        return RespData.resp_404()


class FormSubmittedUpdate(PostDataAbstract):
    def put_data(self):
        body_data = self.get_full_body_data()
        domain_code = HttpRequestControl(self.request).get_sub_domain()
        url = ApiURL.FORM_PUBLISHED_RUNTIME_DETAIL_WITH_SUBMITTED.fill_key(
            form_code=self.kwargs['form_code'],
            use_at=self.kwargs['use_at'],
            tenant_code=domain_code,
            pk=self.kwargs['pk']
        )
        resp = ServerAPI(request=self.request, user=self.request.user, url=url).put(data=body_data)
        return resp.auto_return(key_success='form_put')

    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, form_code, use_at, pk, **kwargs):
        if request.data:
            if (
                    form_code and len(form_code) == FORM_CODE_LENGTH
                    and use_at and use_at in ['view', 'iframe']
                    and TypeCheck.check_uuid(pk)
            ):
                if self.valid_csrf_token__in_body():
                    return self.put_data()
        return RespData.resp_404()


class FormPublishedRuntimeSubmitted(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, form_code, **kwargs):
        resp = get_submitted_data(request=request, form_code=form_code)
        if resp.state:
            if resp.status == 200:
                return resp.result, 200
        return {}, 204
