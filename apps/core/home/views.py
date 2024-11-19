import urllib.parse

from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ConditionFormset, ServerAPI, ApiURL, ServerMsg, TypeCheck, BreadcrumbView
from apps.core.home.utils import ReverseUrlCommon
from apps.shared.apps_code_to_txt import AppsCodeToList


class HomeView(View):
    @mask_view(
        login_require=True,
        template='core/home/home.html',
        breadcrumb='HOME_PAGE',
        menu_active='id_menu_home_page',
        jsi18n='home',
    )
    def get(self, request, *args, **kwargs):
        next_url = request.GET.get('next', '')
        if request.user:
            employee_current_data = getattr(request.user, 'employee_current_data', {})
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp.state is True:
                if next_url:
                    return redirect(next_url)
                ctx = {
                    'employee_current_data': employee_current_data,
                    'app_name_list': AppsCodeToList.get_data()
                }
                return ctx, status.HTTP_200_OK
            elif resp.status == 401:
                return redirect(resp.resp_401_redirect_url(next_url=next_url))
        return redirect(reverse('AuthLogin') + f'?next={next_url}')


class OutLayoutNotFoundView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'extends/systems/out-layout/404.html', {})


class OutLayoutServerOff(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'extends/systems/out-layout/503.html', {})


class TenantDisabledView(View):
    @mask_view(
        login_require=True, auth_require=False,
        template='extends/systems/404.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class NotFoundView(View):
    @mask_view(
        login_require=True, auth_require=False,
        template='extends/systems/404.html',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        if request.user:
            if request.user.company:
                ctx = {
                    'user_id': request.user.id.hex,
                    'company_code': request.user.company.code,
                    'company_title': request.user.company.title,
                }
        return ctx, status.HTTP_200_OK


def view_render_not_found(request, *args, **kwargs):
    ctx = {}
    if request.user:
        if request.user.company:
            ctx = {
                'user_id': request.user.id.hex,
                'company_code': request.user.company.code,
                'company_title': request.user.company.title,
            }
        return render(request, template_name='extends/systems/404.html', context=ctx)
    return redirect(reverse('OutLayoutNotFoundView'))


class ServerMaintainView(View):
    @mask_view(
        login_require=False, auth_require=False,
        template='extends/systems/503.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BookMarkListAPI(APIView):
    @mask_view(is_api=True, login_require=True, auth_require=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.BOOKMARKS_LIST, user=request.user).get()
        return resp.auto_return(key_success='bookmarks_list')

    @mask_view(is_api=True, login_require=True, auth_require=True)
    def post(self, request, *args, **kwargs):
        errors = {}
        kind = request.data.get('kind', 0)
        customize_url = request.data.get('customize_url', None)
        if kind == '1' or kind == 1:
            if 'http' in customize_url or 'https' in customize_url or '//' in customize_url:
                errors['customize_url'] = ServerMsg.URL_INVALID
            elif customize_url and not customize_url.startswith('/'):
                errors['customize_url'] = ServerMsg.URL_INVALID
        if not errors:
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.BOOKMARKS_LIST).post(request.data)
            return resp.auto_return()
        return {'errors': errors}, status.HTTP_400_BAD_REQUEST


class BookMarkDetailAPI(APIView):
    @mask_view(is_api=True, login_require=True, auth_require=True)
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BOOKMARKS_DETAIL.fill_key(pk=pk)).put(
            request.data
        )
        return resp.auto_return()

    @mask_view(is_api=True, login_require=True, auth_require=True)
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BOOKMARKS_DETAIL.fill_key(pk=pk)).delete()
        return resp.auto_return(key_success='result', status_success=status.HTTP_204_NO_CONTENT)


class DocPinedListAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.PIN_DOC_LIST, user=request.user).get()
        return resp.auto_return(key_success='pin_doc_list')

    @mask_view(login_require=True, auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PIN_DOC_LIST).post(request.data)
        return resp.auto_return()


class DocPinedDetailAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PIN_DOC_DETAIL.fill_key(pk=pk)).delete()
        return resp.auto_return(key_success='result', status_success=status.HTTP_204_NO_CONTENT)


class ComponentCollections(View):
    @mask_view(
        auth_require=True,
        template='core/utilities/components.html',
        breadcrumb='COMPONENTS_PAGE'
    )
    def get(self, request, *args, **kwargs):
        cond_formset = ConditionFormset()
        return {"form": cond_formset}, status.HTTP_200_OK


class UtilitiesView(View):
    @mask_view(
        auth_require=True,
        template='core/utilities/index.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DefaultDataView(View):
    @classmethod
    def default_data(cls, result):
        rs = []
        for plan, plan_data in result.items():
            for feature, feature_data in plan_data.items():
                row = []
                data_tmp = []
                for data in feature_data:
                    row_tmp = []
                    arr_tmp = []
                    for key in data.keys():
                        row_tmp.append(key)
                        arr_tmp.append(data[key])
                    if not row:
                        row = row_tmp
                    data_tmp.append(arr_tmp)
                rs.append(
                    {
                        'plan': plan,
                        'feature': feature,
                        'rows': row,
                        'data': data_tmp,
                    }
                )
        return rs

    @mask_view(
        auth_require=True,
        template='core/utilities/default_data.html',
    )
    def get(self, request, *args, **kwargs):
        resp_default_data = ServerAPI(request=request, user=request.user, url='private-system/default-data').get()
        resp_plan_app = ServerAPI(request=request, user=request.user, url='private-system/plan-app').get()
        return {
            'default_data': self.default_data(resp_default_data.result),
            'plan_app': resp_plan_app.result['plan_app'],
            'app_by_id': resp_plan_app.result['app_by_id']
        }


class TermsAndConditionsView(View):
    @mask_view(
        auth_require=True,
        template='core/terms/terms.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GatewayMiddleCreateView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, plan, app, **kwargs):
        params = request.query_params.dict()
        is_redirect = params.pop('redirect', False)
        link_data = ReverseUrlCommon.get_link(plan=plan.lower(), app=app.lower(), pk=None, is_create=True)
        if link_data:
            if is_redirect:
                return redirect(link_data + '?' + urllib.parse.urlencode(params))
            return {'url': link_data}, status.HTTP_200_OK
        if is_redirect:
            return redirect(reverse('NotFoundView'))
        return {}, status.HTTP_404_NOT_FOUND


class GatewayMiddleListView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, plan, app, **kwargs):
        params = request.query_params.dict()
        is_redirect = params.pop('redirect', False)
        link_data = ReverseUrlCommon.get_link(plan=plan.lower(), app=app.lower(), pk=None)
        if link_data:
            if is_redirect:
                return redirect(link_data + '?' + urllib.parse.urlencode(params))
            return {'url': link_data}, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND


class GatewayMiddleDetailView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, plan, app, pk, **kwargs):
        ReverseUrlCommon.update_done_notify(request.user, request.query_params.get('notify_id', None))
        is_redirect = TypeCheck.get_bool(
            request.query_params.get('redirect', False)
        )
        link_data = ReverseUrlCommon.get_link(plan=plan.lower(), app=app.lower(), pk=pk.lower())
        if link_data:
            if is_redirect is True:
                return redirect(link_data)
            return {'url': link_data}, status.HTTP_200_OK
        if is_redirect is True:
            return redirect('NotFoundView')
        return {}, status.HTTP_404_NOT_FOUND


class GatewayPKMiddleDetailView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, pk_app, pk_doc, **kwargs):
        ReverseUrlCommon.update_done_notify(request.user, request.query_params.get('notify_id', None))
        is_redirect = TypeCheck.get_bool(
            request.query_params.get('redirect', False)
        )
        link_data = ReverseUrlCommon.get_link_by_app_id(app_id=pk_app, pk=pk_doc.lower())
        if link_data:
            if is_redirect is True:
                return redirect(link_data)
            return {'url': link_data}, status.HTTP_200_OK
        if is_redirect is True:
            return redirect('NotFoundView')
        return {}, status.HTTP_404_NOT_FOUND


class GatewayViewNameListView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        return {
                   'views_name': BreadcrumbView.get_list_view(
                       search_txt=request.query_params.get('search', '')
                   )
               }, status.HTTP_200_OK


class GatewayViewNameParseView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, view_name, **kwargs):
        is_redirect = TypeCheck.get_bool(
            request.query_params.get('redirect', False)
        )
        if view_name:
            link_data = ReverseUrlCommon.get_link_by_name(view_name=view_name)
            if link_data:
                if is_redirect is True:
                    return redirect(link_data)
                return {'url': link_data}, status.HTTP_200_OK
        if is_redirect is True:
            return redirect(reverse('NotFoundView'))
        return {}, status.HTTP_404_NOT_FOUND


class ResolveNotifyItemAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        ReverseUrlCommon.update_done_notify(request.user, pk)
        return {}, status.HTTP_200_OK


class HomeCalendarAPI(APIView):
    @mask_view(is_api=True, login_require=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.HOME_CALENDAR).get()
        return resp.auto_return(key_success='home_calendar')


class TestView(View):
    @mask_view(
        login_require=True,
        template='core/test.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TestAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.TENANT_APPLICATION_LIST).get()
        return resp.auto_return(key_success='test')
