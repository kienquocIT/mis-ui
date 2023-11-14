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

    def get_hosts(self):
        return self.request.META['HTTP_HOST'].split(":")[0]

    def get(self, request, *args, path_sub, **kwargs):
        ctx = {}
        meta_hosts = self.get_hosts()
        if settings.UI_DOMAIN_SUB_DOMAIN in meta_hosts:
            company_code_arr = meta_hosts.split(settings.UI_DOMAIN_SUB_DOMAIN)

            if len(company_code_arr) == 2 and company_code_arr[0] and company_code_arr[1] == '':
                company_code = company_code_arr[0]
                try:
                    company_obj = Company.objects.get(sub_domain=company_code.lower())
                except Company.DoesNotExist:
                    url = ApiURL.BUILDER_PAGE_TENANT_GETTER.fill_key(company_sub_domain=company_code)
                    resp = ServerAPI(request=request, user=request.user, url=url).get()
                    if not resp.state:
                        return self.render_404(ctx=ctx)

                    if not (
                            'tenant' in resp.result
                            and isinstance(resp.result['tenant'], dict)
                            and 'id' in resp.result['tenant']
                            and 'title' in resp.result['tenant']
                            and 'code' in resp.result['tenant']

                            and 'id' in resp.result
                            and 'title' in resp.result
                            and 'code' in resp.result
                    ):
                        return self.render_404(ctx=ctx)

                    tenant_data = resp.result['tenant']
                    tenant_obj, _created = Tenant.objects.get_or_create(pk=tenant_data['id'], defaults={
                        'id': tenant_data['id'], 'title': tenant_data['title'], 'code': tenant_data['code'],
                    })

                    company_obj, _created = Company.objects.get_or_create(pk=resp.result['id'], defaults={
                        'id': resp.result['id'], 'title': resp.result['title'], 'code': resp.result['code'],
                        'tenant': tenant_obj,
                    })

                if company_obj and hasattr(company_obj, 'id'):
                    url = ApiURL.BUILDER_PAGE_VIEWER.fill_key(
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
