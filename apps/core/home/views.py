from django.shortcuts import redirect
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ConditionFormset, ServerAPI, ApiURL, ServerMsg, TypeCheck, BreadcrumbView
from apps.core.home.utils import ReverseUrlCommon


class HomeView(View):
    @mask_view(
        auth_require=True,
        template='core/home/home.html',
        breadcrumb='HOME_PAGE',
        menu_active='id_menu_home_page',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BookMarkListAPI(APIView):
    @mask_view(is_api=True, login_require=True, auth_require=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.BOOKMARKS_LIST, user=request.user).get()
        if resp.state:
            return {'bookmarks_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

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
            resp = ServerAPI(user=request.user, url=ApiURL.BOOKMARKS_LIST).post(request.data)
            if resp.state:
                return resp.result, status.HTTP_200_OK
            elif resp.status == 401:
                return {}, status.HTTP_401_UNAUTHORIZED
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
        return {'errors': errors}, status.HTTP_400_BAD_REQUEST


class BookMarkDetailAPI(APIView):
    @mask_view(is_api=True, login_require=True, auth_require=True)
    def put(self, request, *args, pk, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.BOOKMARKS_DETAIL.fill_key(pk=pk)).put(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR

    @mask_view(is_api=True, login_require=True, auth_require=True)
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BOOKMARKS_DETAIL.fill_key(pk=pk)).delete()
        if resp.state:
            return {'result': resp.result}, status.HTTP_204_NO_CONTENT
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class DocPinedListAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.PIN_DOC_LIST, user=request.user).get()
        if resp.state:
            return {'pin_doc_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(login_require=True, auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PIN_DOC_LIST).post(request.data)
        if resp.state:
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class DocPinedDetailAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PIN_DOC_DETAIL.fill_key(pk=pk)).delete()
        if resp.state:
            return {'result': resp.result}, status.HTTP_204_NO_CONTENT
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class ComponentCollections(View):
    @mask_view(
        auth_require=True,
        template='core/home/components.html',
        breadcrumb='COMPONENTS_PAGE'
    )
    def get(self, request, *args, **kwargs):
        cond_formset = ConditionFormset()
        return {"form": cond_formset}, status.HTTP_200_OK


class TermsAndConditionsView(View):
    @mask_view(
        auth_require=True,
        template='core/terms/terms.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class HelpAndSupportView(View):
    @mask_view(
        auth_require=True,
        template='core/help_support/help_support.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class UtilitiesView(View):
    @mask_view(
        auth_require=True,
        template='core/utilities/index.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GatewayMiddleListView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, plan, app, **kwargs):
        is_redirect = request.query_params.get('redirect', False)
        link_data = ReverseUrlCommon.get_link(plan=plan.lower(), app=app.lower(), pk=None)
        if link_data:
            if is_redirect:
                return redirect(link_data)
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
        return {}, status.HTTP_404_NOT_FOUND


class GatewayViewNameListView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        return {'views_name': BreadcrumbView.get_list_view()}, status.HTTP_200_OK


class GatewayViewNameParseView(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, view_name, **kwargs):
        if view_name:
            is_redirect = TypeCheck.get_bool(
                request.query_params.get('redirect', False)
            )
            link_data = ReverseUrlCommon.get_link_by_name(view_name=view_name)
            if link_data:
                if is_redirect is True:
                    return redirect(link_data)
                return {'url': link_data}, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND
