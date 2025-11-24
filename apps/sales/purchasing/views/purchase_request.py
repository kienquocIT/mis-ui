from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck, InputMappingProperties
from apps.shared.msg.purchasing import PurchasingMsg


# main
class PurchaseRequestList(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_list.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='PURCHASE_REQUEST_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_LIST, method='GET'),
        icon_cls='fas fa-file-upload',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseRequestCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_create.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='PURCHASE_REQUEST_CREATE_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_LIST, method='POST'),
        icon_cls='fas fa-file-upload',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'data': {'employee_current': request.user.employee_current_data},
                   'app_id': 'fbff9b3f-f7c9-414f-9959-96d3ec2fb8bf',
               }, status.HTTP_200_OK


class PurchaseRequestDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_detail.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='PURCHASE_REQUEST_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_DETAIL, method='GET', fill_key=['pk']),
        icon_cls='fas fa-file-upload',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {'app_id': 'fbff9b3f-f7c9-414f-9959-96d3ec2fb8bf',}, status.HTTP_200_OK


class PurchaseRequestUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_update.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='PURCHASE_REQUEST_UPDATE_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_DETAIL, method='PUT', fill_key=['pk']),
        icon_cls='fas fa-file-upload',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.PURCHASING_PURCHASE_REQUEST
        return {
            'data': {'employee_current': request.user.employee_current_data},
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'frm-detail-pr',
            'app_id': 'fbff9b3f-f7c9-414f-9959-96d3ec2fb8bf',
        }, status.HTTP_200_OK


class PurchaseRequestListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST).get(params)
        return resp.auto_return(key_success='purchase_request_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = PurchasingMsg.PURCHASE_REQUEST_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseRequestDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='purchase_request')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = PurchasingMsg.PURCHASE_REQUEST_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# config
class PurchaseRequestConfig(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_config.html',
        menu_active='menu_purchase_request_config',
        breadcrumb='PURCHASE_REQUEST_CONFIG_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_CONFIG, method='GET'),
        icon_cls='fas fa-file-upload',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseRequestConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_CONFIG).get()
        return resp.auto_return(key_success='config')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_CONFIG).put(request.data)
        return resp.auto_return()


# related
class SaleOrderListForPRAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PR_SO_LIST).get(params)
        return resp.auto_return(key_success='sale_order_list')


class SaleOrderProductListForPRAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PR_SO_PRD_LIST.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='so_product_list')


class DistributionPlanListForPRAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PR_DP_LIST).get(params)
        return resp.auto_return(key_success='distribution_plan_list')


class DistributionPlanProductListForPRAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PR_DP_PRD_LIST.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='dp_product_list')


class ServiceOrderListForPRAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PR_SVO_LIST).get(params)
        return resp.auto_return(key_success='service_order_list')


class ServiceOrderProductListForPRAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PR_SVO_PRD_LIST.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='svo_product_list')


class PurchaseRequestProductListAPI(APIView):
    """ Lấy sản phẩm trong Purchase Request """
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PR_PRD_LIST).get(data)
        return resp.auto_return(key_success='purchase_request_product_list')
