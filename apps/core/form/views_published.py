from django.shortcuts import render
from django.views import View
from django.views.decorators.clickjacking import xframe_options_exempt
from rest_framework.views import APIView

from apps.core.form.views import publish_data, get_ctx_user_current
from apps.shared import mask_view, TypeCheck, ApiURL, ServerAPI
from apps.shared.apis import RespData
from apps.shared.decorators import OutLayoutRender
from apps.shared.exceptions import handle_exception_all_view


class FormPublishDetailFromFormAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, pk_form, **kwargs):
        if pk_form and TypeCheck.check_uuid(pk_form):
            url = ApiURL.FORM_PUBLISHED_FORM_DETAIL.fill_key(pk=pk_form)
            resp = ServerAPI(request=request, user=request.user, url=url).get(request.data)
            return resp.auto_return(key_success='form_published')
        return RespData.resp_404()


class FormPublishDetailAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_PUBLISHED_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
            return resp.auto_return(key_success='form_published')
        return RespData.resp_404()


class FormDetailThemeAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_DETAIL_THEME.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
            return resp.auto_return(key_success='form_published')
        return RespData.resp_404()


class FormPublishDetailView(View):
    @mask_view(login_require=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_PUBLISHED_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            if resp.state:
                try:
                    ctx = publish_data(resp=resp, code='iframe-editing', request=request, use_at='view')
                    return render(request, 'form/runtime/preview.html', ctx)
                except ValueError:
                    pass
        return OutLayoutRender(request=request).render_404()


class FormPublishDetailViewIFrame(View):
    @xframe_options_exempt
    @mask_view(login_require=True, is_api=False)
    def get(self, request, *args, **kwargs):
        try:
            return render(
                request,
                'form/runtime/preview.html',
                {
                    'use_at': 'iframe',
                    'prevent_submit_form': True,
                    'code': 'iframe-editing',
                    'user_current': get_ctx_user_current(request),
                }
            )
        except Exception as err:
            handle_exception_all_view(err, self)

        return OutLayoutRender(request=request).render_404()
