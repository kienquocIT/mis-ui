from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg


class PurchaseQuotationRequestList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotationrequest/purchase_quotation_request_list.html',
        menu_active='id_menu_purchase_quotation_request_list',
        breadcrumb='PURCHASE_QUOTATION_REQUEST_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationRequestCreateFromPR(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotationrequest/purchase_quotation_request_create_from_PR.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_REQUEST_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST).get()
        return {
                   'data':
                       {
                           'employee_current_id': request.user.employee_current_data.get('id', None),
                           'tax_list': resp1.result,
                           'purchase_request_list': resp2.result,
                       }
               }, status.HTTP_200_OK


class PurchaseQuotationRequestDetailFromPR(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotationrequest/purchase_quotation_request_detail_from_PR.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_REQUEST_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST).get()
        return {
                   'data':
                       {
                           'employee_current_id': request.user.employee_current_data.get('id', None),
                           'tax_list': resp1.result,
                           'purchase_request_list': resp2.result,
                       }
               }, status.HTTP_200_OK


class PurchaseQuotationRequestDetailFromPRAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_DETAIL.push_id(pk)).get()
        return resp.auto_return(key_success='purchase_quotation_request_detail')


class PurchaseQuotationRequestCreateFromPRAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST).get()
        return resp.auto_return(key_success='purchase_quotation_request_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION_REQUEST
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()
