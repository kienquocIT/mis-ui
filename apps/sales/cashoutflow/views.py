from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class AdvancePaymentList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_list.html',
        breadcrumb='ADVANCE_PAYMENT_LIST_PAGE',
        menu_active='menu_advance_payment_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AdvancePaymentCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_create.html',
        breadcrumb='ADVANCE_PAYMENT_CREATE_PAGE',
        menu_active='menu_advance_payment_list',
    )
    def get(self, request, *args, **kwargs):
        return {'data': {'employee_current_id': request.user.employee_current_data.get('id', None)}}, status.HTTP_200_OK


class AdvancePaymentListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    # @mask_view(
    #     auth_require=True,
    #     is_api=True,
    # )
    # def get(self, request, *args, **kwargs):
    #     resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).get()
    #     if resp.state:
    #         return {'product_list': resp.result}, status.HTTP_200_OK
    #     elif resp.status == 401:
    #         return {}, status.HTTP_401_UNAUTHORIZED
    #     return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
#
#
# class AdvanceDetail(View):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         template='masterdata/saledata/product/product_detail.html',
#         breadcrumb='PRODUCT_DETAIL_PAGE',
#         menu_active='menu_product_detail',
#     )
#     def get(self, request, *args, **kwargs):
#         return {}, status.HTTP_200_OK
#
#
# class AdvanceDetailAPI(APIView):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def get(self, request, pk, *args, **kwargs):
#         resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_DETAIL + pk).get()
#         if resp.state:
#             return {'product': resp.result}, status.HTTP_200_OK
#         elif resp.status == 401:
#             return {}, status.HTTP_401_UNAUTHORIZED
#         return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
#
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def put(self, request, pk, *arg, **kwargs):
#         data = request.data
#         response = ServerAPI(user=request.user, url=ApiURL.PRODUCT_DETAIL + pk).put(data)
#         if response.state:
#             return response.result, status.HTTP_200_OK
#         if response.errors:
#             if isinstance(response.errors, dict):
#                 err_msg = ""
#                 for key, value in response.errors.items():
#                     err_msg += str(key) + ': ' + str(value)
#                     break
#                 return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
#             return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
#         return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
