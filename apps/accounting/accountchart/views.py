from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, PermCheck, InputMappingProperties


class AccountChartList(View):

    @mask_view(
        auth_require=True,
        template='accountchart/accountchart_list.html',
        breadcrumb='ACCOUNT_CHART_LIST_PAGE',
        menu_active='accountchart',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AccountChartListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_CHART_LIST).get(params)
        return resp.auto_return(key_success='account_chart_list')

    # @mask_view(
    #     auth_require=True,
    #     is_api=True,
    # )
    # def post(self, request, *arg, **kwargs):
    #     resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).post(request.data)
    #     if resp.state:
    #         resp.result['message'] = SaleMsg.ADVANCE_PAYMENT_CREATE
    #         return resp.result, status.HTTP_201_CREATED
    #     return resp.auto_return()
#
#
# class AccountChartCreate(View):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         template='advancepayment/advance_payment_create.html',
#         breadcrumb='ADVANCE_PAYMENT_CREATE_PAGE',
#         menu_active='menu_advance_payment_list',
#     )
#     def get(self, request, *args, **kwargs):
#         input_mapping_properties = InputMappingProperties.CASHOUTFLOW_ADVANCE
#         return {
#             'data': {'employee_current': request.user.employee_current_data},
#             'list_from_app': 'cashoutflow.advancepayment.create',
#             'input_mapping_properties': input_mapping_properties,
#             'form_id': 'form-create-advance'
#         }, status.HTTP_200_OK
#
#
# class AccountChartDetail(View):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         template='advancepayment/advance_payment_detail.html',
#         breadcrumb='ADVANCE_PAYMENT_DETAIL_PAGE',
#         menu_active='menu_advance_payment_detail',
#     )
#     def get(self, request, *args, **kwargs):
#         input_mapping_properties = InputMappingProperties.CASHOUTFLOW_ADVANCE
#         return {
#             'data': {'employee_current': request.user.employee_current_data},
#             'input_mapping_properties': input_mapping_properties,
#             'form_id': 'form-detail-advance'
#         }, status.HTTP_200_OK
#
#
# class AccountChartUpdate(View):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         template='advancepayment/advance_payment_update.html',
#         breadcrumb='ADVANCE_PAYMENT_UPDATE_PAGE',
#         menu_active='menu_advance_payment_detail',
#     )
#     def get(self, request, *args, **kwargs):
#         input_mapping_properties = InputMappingProperties.CASHOUTFLOW_ADVANCE
#         return {
#             'data': {'employee_current': request.user.employee_current_data},
#             'input_mapping_properties': input_mapping_properties,
#             'list_from_app': 'cashoutflow.advancepayment.edit',
#             'form_id': 'form-detail-advance'
#         }, status.HTTP_200_OK
#
#
# class AccountChartDetailAPI(APIView):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def get(self, request, pk, *args, **kwargs):
#         resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_DETAIL.fill_key(pk=pk)).get()
#         return resp.auto_return(key_success='advance_payment_detail')
#
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def put(self, request, pk, *arg, **kwargs):
#         data = request.data
#         resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_DETAIL.fill_key(pk=pk)).put(data)
#         if resp.state:
#             resp.result['message'] = SaleMsg.ADVANCE_PAYMENT_UPDATE
#             return resp.result, status.HTTP_200_OK
#         return resp.auto_return()
