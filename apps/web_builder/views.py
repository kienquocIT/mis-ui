from django.conf import settings
from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL

from apps.core.account.models import Tenant, Company
from apps.web_builder.serializers import WebDesignUpdateSerializer


class MyCompanyWebsiteList(View):
    @mask_view(
        auth_require=True,
        template='builder/pages.html',
        breadcrumb='MY_WEBSITE_LIST',
        # menu_active='menu_user_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BUILDER_PAGE_LIST).get()
        return resp.auto_return(key_success='page_list')


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


class CompanyWebsitePathView(View):
    def render_404(self, ctx=None):
        if not ctx:
            ctx = {}
        return render(self.request, 'extends/systems/out-layout/company_page_not_found.html', ctx)

    def get(self, request, *args, path_sub, **kwargs):
        ctx = {}
        meta_hosts = request.META['HTTP_HOST']
        if settings.UI_DOMAIN in meta_hosts:
            tenant_company = meta_hosts.split(settings.UI_DOMAIN)[0]
            if tenant_company and '.' in tenant_company:
                tenant_company_arr = tenant_company.split(".")
                tenant_code = tenant_company_arr[1]
                company_code = tenant_company_arr[0]
                try:
                    tenant_obj = Tenant.objects.get(code=tenant_code)
                except Tenant.DoesNotExist:
                    return self.render_404(ctx=ctx)

                ctx['tenant_title'] = tenant_obj.title

                try:
                    company_obj = Company.objects.get(tenant=tenant_obj, code=company_code)
                except Company.DoesNotExist:
                    return self.render_404(ctx=ctx)

                ctx['company_title'] = company_obj.title

                if tenant_obj.is_active is True:
                    url = ApiURL.BUILDER_PAGE_VIEWER.fill_key(
                        tenant_id=tenant_obj.id,
                        company_id=company_obj.id,
                        path_sub=path_sub if path_sub else '-',
                    )
                    resp = ServerAPI(request=request, user=request.user, url=url).get()
                    if resp.state:
                        ctx_passed = {
                            'data': resp.result
                        }
                        return render(request, 'builder/viewer.html', ctx_passed)

        return self.render_404(ctx=ctx)
