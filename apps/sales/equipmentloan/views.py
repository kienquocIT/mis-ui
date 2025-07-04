from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg


class EquipmentLoanList(View):
    @mask_view(
        auth_require=True,
        template='equipmentloan/equipment_loan_list.html',
        breadcrumb='EQUIPMENT_LOAN_LIST_PAGE',
        menu_active='id_menu_equipment_loan',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class EquipmentLoanListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_LOAN_LIST).get(params)
        return resp.auto_return(key_success='equipment_loan_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_LOAN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.EQUIPMENT_LOAN_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class EquipmentLoanCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='equipmentloan/equipment_loan_create.html',
        breadcrumb='EQUIPMENT_LOAN_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-create-product-modification',
        }, status.HTTP_200_OK


class EquipmentLoanDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='equipmentloan/equipment_loan_detail.html',
        breadcrumb='EQUIPMENT_LOAN_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class EquipmentLoanUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='equipmentloan/equipment_loan_update.html',
        breadcrumb='EQUIPMENT_LOAN_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-detail-product-modification',
        }, status.HTTP_200_OK


class EquipmentLoanDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_LOAN_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='equipment_loan_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.EQUIPMENT_LOAN_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.EQUIPMENT_LOAN_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

# related
class LoanProductListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LOAN_PRODUCT_LIST).get(params)
        return resp.auto_return(key_success='product_list')


class ELWarehouseListByProductAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST_BY_PRODUCT).get(params)
        return resp.auto_return(key_success='warehouse_list_by_product')


class ELProductLotListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LOT_LIST).get(params)
        return resp.auto_return(key_success='product_lot_list')


class ELProductSerialListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_SERIAL_LIST).get(params)
        return resp.auto_return(key_success='product_serial_list')
