__all__ = ['AssetToolsProvideRequestList', 'AssetToolsProvideRequestListAPI', 'AssetToolsProvideRequestCreate',
           'AssetToolsProvideRequestCreateAPI', 'AssetToolsProvideRequestDetail', 'AssetToolsProvideRequestDetailAPI',
           'AssetToolsProvideRequestEdit', 'AssetToolsProvideRequestEditAPI', 'AssetProductListByProvideIDAPI'
           ]
import unicodedata
import re
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SYSTEM_STATUS, InputMappingProperties
from apps.shared.msg import BaseMsg
from apps.shared.msg.eoffice import AssetToolsMsg


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
        # print('user current', request.user.employee_current_data)
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
        return {
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
            resp.result['message'] = f'{AssetToolsMsg.PROVIDE} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
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
        return {
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'asset_provide_form',
                   'pk': pk,
                   'system_status': SYSTEM_STATUS,
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
            resp.result['message'] = f'{AssetToolsMsg.PROVIDE} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class AssetProductListByProvideIDAPI(APIView):
    @classmethod
    def get_callback_success(cls, result):
        compare_id = {}
        for item in result:
            product_id = item['product'].get('id')
            if (item['subtotal'] - item['delivered'] + item['is_returned']) > 0:  # nếu product này hết số lượng để giao
                continue
            if product_id:
                if product_id in compare_id:
                    compare_id[product_id]['quantity'] += item['quantity']
                    compare_id[product_id]['delivered'] += item['delivered']
                else:
                    compare_id[product_id] = item
            else:
                temp = unicodedata.normalize('NFD', item['product_remark'])
                temp = ''.join(c for c in temp if unicodedata.category(c) != 'Mn')
                key_word = re.sub(r'\s+', '_', temp.strip().lower())
                if key_word in compare_id:
                    compare_id[key_word]['quantity'] += item['quantity']
                    compare_id[key_word]['delivered'] += item['delivered']
                else:
                    compare_id[key_word] = item

        new_lst = sorted(compare_id.values(), key=lambda x: x['order'])
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
        return resp.auto_return(key_success='asset_provide_product_list')
