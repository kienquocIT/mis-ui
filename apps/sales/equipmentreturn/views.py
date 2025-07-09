from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg


class EquipmentReturnList(View):
    @mask_view(
        auth_require=True,
        template='equipmentreturn/equipment_return_list.html',
        breadcrumb='EQUIPMENT_RETURN_LIST_PAGE',
        menu_active='id_menu_equipment_return',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class EquipmentReturnListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_RETURN_LIST).get(params)
        return resp.auto_return(key_success='equipment_return_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_RETURN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.EQUIPMENT_RETURN_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class EquipmentReturnCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='equipmentreturn/equipment_return_create.html',
        breadcrumb='EQUIPMENT_RETURN_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-create-equipment-return',
        }, status.HTTP_200_OK


class EquipmentReturnDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='equipmentreturn/equipment_return_detail.html',
        breadcrumb='EQUIPMENT_RETURN_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class EquipmentReturnUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='equipmentreturn/equipment_return_update.html',
        breadcrumb='EQUIPMENT_RETURN_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-detail-equipment-return',
        }, status.HTTP_200_OK


class EquipmentReturnDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_RETURN_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='equipment_return_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_RETURN_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.EQUIPMENT_RETURN_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

# related
class EREquipmentLoanListByAccountAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ER_EL_LIST_BY_ACCOUNT).get(params)
        return resp.auto_return(key_success='equipment_loan_list_by_account')
