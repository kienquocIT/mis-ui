from django.conf import settings
from django.views import View
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL

from apps.core.account.models import Company
from apps.web_builder.serializers import WebDesignUpdateSerializer


class TemplateList(APIView):
    @mask_view(
        is_api=True,
        auth_require=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BUILDER_PAGE_TEMPLATE).get()
        return resp.auto_return(key_success='template_list')


class TemplateDetail(APIView):
    @mask_view(
        is_api=True,
        auth_require=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(
            request=request, user=request.user, url=ApiURL.BUILDER_PAGE_TEMPLATE_DETAIL.fill_key(pk=pk)
        ).get()
        return resp.auto_return(key_success='template_detail')


class MyCompanyWebsiteList(View):
    def callback_success(self, result):
        try:
            company_id = self.request.user.company_current_data.get('id', None)
            company_obj = Company.objects.get(pk=company_id)
            return {
                'page_list': result,
                'page_viewer_domain': settings.UI_FULL_DOMAIN.format(sub_domain=company_obj.sub_domain)
            }
        except Exception as err:
            print(err)
        return {
            'page_list': result,
            'page_viewer_domain': '#',
        }

    @mask_view(
        auth_require=True,
        template='builder/pages.html',
        breadcrumb='MY_WEBSITE_LIST',
        # menu_active='menu_user_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BUILDER_PAGE_LIST).get()
        return resp.auto_return(key_success='page_list', callback_success=self.callback_success)


class AddNewCompanyWebsite(APIView):
    @mask_view(
        is_api=True,
        auth_require=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BUILDER_PAGE_LIST).post(request.data)
        return resp.auto_return()


class MyCompanyWebsiteDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(
            request=request,
            user=request.user,
            url=ApiURL.BUILDER_PAGE_DETAIL.fill_key(pk=pk)
        ).put(request.data)
        return resp.auto_return()

    @mask_view(
        is_api=True,
        auth_require=True,
    )
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(
            request=request,
            user=request.user,
            url=ApiURL.BUILDER_PAGE_DETAIL.fill_key(pk=pk)
        ).delete()
        return resp.auto_return()


class WebsiteDetailDesign(View):
    @mask_view(
        auth_require=True,
        template='builder/editor.html',
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BUILDER_PAGE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='page_detail')


class WebsiteDetailClone(APIView):
    @mask_view(is_api=True, auth_require=True)
    def post(self, request, *args, pk, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BUILDER_PAGE_DETAIL_CLONE.fill_key(pk=pk)).post(
            data={}
        )
        return resp.auto_return(key_success='page_detail')


class WebsiteDetailDesignSave(APIView):
    @mask_view(
        is_api=True,
        auth_require=True,
    )
    def put(self, request, *args, pk, **kwargs):
        ser = WebDesignUpdateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        url = ApiURL.BUILDER_PAGE_DETAIL.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).put(data=ser.data)
        return resp.auto_return()
