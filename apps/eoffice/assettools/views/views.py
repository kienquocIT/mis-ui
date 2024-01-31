__all__ = ['AssetToolsConfigView', 'AssetToolsConfigViewAPI', 'AssetToolsProvideRequestList',
           'AssetToolsProvideRequestListAPI', 'AssetToolsProvideRequestCreate', 'AssetToolsProvideRequestCreateAPI',
           'AssetToolsProvideRequestDetail', 'AssetToolsProvideRequestDetailAPI', 'AssetToolsProvideRequestEdit',
           'AssetToolsProvideRequestEditAPI', 'AssetProductListByProvideIDAPI'
           ]

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SYSTEM_STATUS, InputMappingProperties
from apps.shared.msg import BaseMsg
from apps.shared.msg.eoffice import AssetToolsMsg


class AssetToolsConfigView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/config.html',
        menu_active='menu_asset_tools_config',
        breadcrumb='ASSET_TOOLS_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AssetToolsConfigViewAPI(APIView):
    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_CONFIG).get()
        if resp.state:
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = f'{BaseMsg.UPDATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class AssetToolsProvideRequestList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/provide/list.html',
        menu_active='menu_asset_provide',
        breadcrumb='ASSET_TOOLS_PROVIDE_LIST',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class AssetToolsProvideRequestListAPI(APIView):
    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_PROVIDE).get(request.query_params.dict())
        return resp.auto_return(key_success='asset_provide_list')


class AssetToolsProvideRequestCreate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/provide/create.html',
        menu_active='menu_asset_provide',
        breadcrumb='ASSET_TOOLS_PROVIDE_CREATE',
    )
    def get(self, request, *args, **kwargs):
        reps_employee = ServerAPI(
            user=request.user, url=ApiURL.EMPLOYEE_DETAIL_PK.fill_key(pk=request.user.employee_current_data['id'])
        ).get({'list_from_app': 'assettools.assettoolsprovide.create'})
        current_emp = {}
        if reps_employee.state:
            current_emp = {
                'id': reps_employee.result['id'],
                'full_name': reps_employee.result['full_name'],
                'selected': 'true',
                'group': reps_employee.result['group']
            }
        response = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_CONFIG).get()
        resp_config = response.result if response.state else {}
        return {
                   'product_type': resp_config['product_type']['id'] if 'product_type' in resp_config else '',
                   'employee': current_emp,
                   'list_from_app': 'assettools.assettoolsprovide.create'
               }, status.HTTP_200_OK


class AssetToolsProvideRequestCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_PROVIDE).post(request.data)
        if resp.state:
            resp.result['message'] = f'{AssetToolsMsg.PROVIDE} {BaseMsg.CREATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class AssetToolsProvideRequestDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/provide/detail.html',
        menu_active='menu_asset_provide',
        breadcrumb='ASSET_TOOLS_PROVIDE_DETAIL',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'system_status': SYSTEM_STATUS,
                   'pk': pk,
               }, status.HTTP_200_OK


class AssetToolsProvideRequestDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_PROVIDE_DETAIL.push_id(pk)).get()
        return resp.auto_return()


class AssetToolsProvideRequestEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/provide/edit.html',
        menu_active='menu_asset_provide',
        breadcrumb='ASSET_TOOLS_PROVIDE_EDIT',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.ASSET_PROVIDE_DATA_MAP
        response = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_CONFIG).get()
        resp_config = response.result if response.state else {}
        return {
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'asset_provide_form',
                   'pk': pk,
                   'system_status': SYSTEM_STATUS,
                   'product_type': resp_config['product_type']['id'],
               }, status.HTTP_200_OK


class AssetToolsProvideRequestEditAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_PROVIDE_DETAIL.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{AssetToolsMsg.PROVIDE} {BaseMsg.UPDATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class AssetProductListByProvideIDAPI(APIView):
    @classmethod
    def get_callback_success(cls, result):
        new_lst = []
        compare_id = {}
        for item in result:
            if item['product']['id'] in compare_id:
                current_item = compare_id[item['product']['id']]
                current_item['quantity'] += item['quantity']
                current_item['delivered'] += item['delivered']
            else:
                compare_id[item['product']['id']] = item
        for idx in compare_id:
            new_lst.append(compare_id[idx])
        new_lst.sort(key=lambda x: x['order'])
        return {
            'asset_provide_product_list': new_lst,
        }

    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_PRODUCT_LIST_BY_PROVIDE).get(
            request.query_params.dict()
        )
        return resp.auto_return(callback_success=self.get_callback_success)
