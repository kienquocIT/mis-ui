from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg


class PurchaseQuotationList(View):

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotation/purchase_quotation_list.html',
        menu_active='id_menu_purchase_quotation_list',
        breadcrumb='PURCHASE_QUOTATION_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_LIST).get()
        return resp.auto_return(key_success='purchase_quotation_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseQuotationCreate(View):

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotation/purchase_quotation_create.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).get()
        resp5 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp6 = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).get()
        return {
                   'data':
                       {
                           'employee_current_id': request.user.employee_current_data.get('id', None),
                           'tax_list': resp1.result,
                           'purchase_quotation_request_list': resp2.result,
                           'account_list': resp3.result,
                           'product_list': resp4.result,
                           'contact_list': resp5.result,
                           'uom_list': resp6.result
                       }
               }, status.HTTP_200_OK


class PurchaseQuotationCreateAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseQuotationDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotation/purchase_quotation_detail.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST_FOR_PQR).get()
        return {
                   'data':
                       {
                           'employee_current_id': request.user.employee_current_data.get('id', None),
                           'tax_list': resp1.result,
                           'purchase_request_list': resp2.result,
                       }
               }, status.HTTP_200_OK


class PurchaseQuotationDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_DETAIL.push_id(pk)).get()
        return resp.auto_return(key_success='purchase_quotation_detail')
