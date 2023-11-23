from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import render
from django.utils import translation
from django.views import View
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.shared import ServerAPI, ApiURL

from apps.core.account.models import Tenant, Company

from apps.web_builder.apis.urls_map import ApiPublicURL


class PublicViewerMixin:
    @classmethod
    def render_404(cls, request, ctx=None):
        if not ctx:
            ctx = {}
        return render(request, 'extends/systems/out-layout/company_page_not_found.html', ctx)

    @classmethod
    def get_hosts(cls, request):
        return request.META['HTTP_HOST'].split(":")[0]

    @classmethod
    def check_and_set_company(cls, request):
        meta_hosts = cls.get_hosts(request=request)
        if settings.UI_DOMAIN_SUB_DOMAIN in meta_hosts:
            company_code_arr = meta_hosts.split(settings.UI_DOMAIN_SUB_DOMAIN)

            if len(company_code_arr) == 2 and company_code_arr[0] and company_code_arr[1] == '':
                return company_code_arr[0]
        return None


class CompanyWebsitePathView(View):
    def render_404(self, ctx=None):
        if not ctx:
            ctx = {}
        return render(self.request, 'extends/systems/out-layout/company_page_not_found.html', ctx)

    def active_language(self):
        if self.request.user and hasattr(self.request.user, 'id') and not isinstance(self.request.user, AnonymousUser):
            language = getattr(self.request.user, 'language', 'vi')
            translation.activate(language)
        return True

    def get_hosts(self):
        return self.request.META['HTTP_HOST'].split(":")[0]

    def get_view_draft(self):
        return self.request.GET.dict().get('view_draft', '0') == '1'

    def get(self, request, *args, path_sub, **kwargs):
        # active primary language
        self.active_language()

        # filter page customize
        api_filter = {}
        is_view_draft = self.get_view_draft()
        if is_view_draft is True:
            if not (self.request.user and not isinstance(self.request.user, AnonymousUser)):
                return self.render_404()
            api_filter['view_draft'] = '1'

        # handler
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
                    tenant_obj, _created = Tenant.objects.get_or_create(
                        pk=tenant_data['id'], defaults={
                            'id': tenant_data['id'], 'title': tenant_data['title'], 'code': tenant_data['code'],
                        }
                    )

                    company_obj, _created = Company.objects.get_or_create(
                        pk=resp.result['id'], defaults={
                            'id': resp.result['id'], 'title': resp.result['title'], 'code': resp.result['code'],
                            'tenant': tenant_obj,
                        }
                    )

                if company_obj and hasattr(company_obj, 'id'):
                    url = ApiURL.BUILDER_PAGE_VIEWER.fill_key(
                        company_id=company_obj.id,
                        path_sub=path_sub if path_sub else '-',
                    )
                    resp = ServerAPI(request=request, user=request.user, url=url).get(data=api_filter)
                    if resp.state:
                        ctx_passed = {
                            'data': resp.result
                        }
                        return render(request, 'builder/viewer.html', ctx_passed)

        return self.render_404(ctx=ctx)


class PublicProductListAPI(APIView, PublicViewerMixin):
    def get(self, request, *args, **kwargs):
        company_sub_domain = self.check_and_set_company(request=request)
        if company_sub_domain:
            url = ApiPublicURL.PUBLIC_PRODUCT_LIST.fill_key(sub_domain=company_sub_domain.lower())
            resp = ServerAPI(url=url).get(data=request.query_params.dict())
            result, _status = resp.auto_return(key_success='data')
            return Response(
                result,
                status=status.HTTP_200_OK
            )
        return Response(
            {
                'data': [],
                'status': status.HTTP_200_OK
            },
            status=status.HTTP_200_OK
        )
