from django.views import View
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, TypeCheck, ServerAPI, ApiURL
from apps.shared.apis import RespData


class ApplicationPropertyForPrintListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.APPLICATION_PROPERTY_PRINT_LIST, user=request.user).get(
            data={
                'ordering': 'title',
                'application__in': request.query_params.get('application__in', ''),
            }
        )
        return resp.auto_return(key_success='application_property_list')


class PrintApplicationTemplateSample(APIView):
    @staticmethod
    def parse_template_detail(title, url, remarks=''):
        return {
            'title': title,
            'url': url,
            'description': remarks,
        }

    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, app_id, **kwargs):
        base_url = 'printer/template/'
        result = []
        if app_id == 'b9650500-aba7-44e3-b6e0-2542622702a3':  # Quotation
            base_url += 'quotation/'
            result = [
                self.parse_template_detail(f"{_('Quotation')} 1", base_url + 'quotation_1.html'),
                self.parse_template_detail(f"{_('Quotation')} 2", base_url + 'quotation_2.html'),
            ]
        return RespData.resp_200(data={'templates': result})


class PrintTemplatesListView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='printer/list.html',
        breadcrumb='PRINTER_CONFIG_LIST_PAGE',
        menu_active='menu_print_template',
    )
    def get(self, request, *args, **kwargs):
        templates_apps_list = ServerAPI(
            request=request, user=request.user,
            url=ApiURL.PRINT_TEMPLATES_APPS_LIST
        ).get(
            data={
                'pageSize': -1,  # full records
            }
        )
        if templates_apps_list.state:
            ctx = {
                'templates_apps_list': templates_apps_list.result,
            }
            return ctx, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND


class PrintTemplatesListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        templates_list = ServerAPI(
            request=request, user=request.user,
            url=ApiURL.PRINT_TEMPLATES_LIST
        ).get(data=request.query_params.dict())
        return templates_list.auto_return(key_success='templates_list')


class PrintTemplateCreateView(View):
    @mask_view(
        login_require=True,
        auth_require=False,
        template='printer/create.html',
        breadcrumb='PRINTER_CONFIG_CREATE_PAGE',
        # menu_active='menu_company_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PrintTemplateCreateAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        print_template_detail = ServerAPI(request=request, user=request.user, url=ApiURL.PRINT_TEMPLATES_LIST).post(
            data=request.data
        )
        return print_template_detail.auto_return(key_success='print_template_detail')


class PrintTemplateUsingDetail(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, application_id, **kwargs):
        if application_id and TypeCheck.check_uuid(application_id):
            template_detail = ServerAPI(
                request=request, user=request.user,
                url=ApiURL.PRINT_TEMPLATES_USING.fill_key(application_id=application_id)
            ).get()
            return template_detail.auto_return(key_success='template_detail')
        return RespData.resp_404()


class PrintTemplateDetailUsingAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            template_detail = ServerAPI(
                request=request, user=request.user,
                url=ApiURL.PRINT_TEMPLATES_USING_DETAIL.fill_key(pk=pk)
            ).get()
            return template_detail.auto_return(key_success='template_detail')
        return RespData.resp_404()


class PrintTemplateDetailView(View):
    @mask_view(
        login_require=True,
        auth_require=False,
        template='printer/detail.html',
        breadcrumb='PRINTER_CONFIG_DETAIL_PAGE',
        # menu_active='menu_company_list',
    )
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            return {}, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND


class PrintTemplateDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            template_detail = ServerAPI(
                request=request, user=request.user,
                url=ApiURL.PRINT_TEMPLATES_DETAIL.fill_key(pk=pk)
            ).get()
            return template_detail.auto_return(key_success='template_detail')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            template_update = ServerAPI(
                request=request, user=request.user,
                url=ApiURL.PRINT_TEMPLATES_DETAIL.fill_key(pk=pk)
            ).put(data=request.data)
            return template_update.auto_return()
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def delete(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            template_update = ServerAPI(
                request=request, user=request.user,
                url=ApiURL.PRINT_TEMPLATES_DETAIL.fill_key(pk=pk)
            ).delete()
            return template_update.auto_return()
        return RespData.resp_404()


class PrintTemplateUpdateView(View):
    @mask_view(
        login_require=True,
        auth_require=False,
        template='printer/update.html',
        breadcrumb='PRINTER_CONFIG_UPDATE_PAGE',
        # menu_active='menu_company_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
