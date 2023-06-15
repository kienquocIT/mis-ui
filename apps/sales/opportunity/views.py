from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg


def create_update_opportunity(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    elif resp.status == 401:
        return {}, status.HTTP_401_UNAUTHORIZED
    return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class OpportunityList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_list.html',
        menu_active='menu_opportunity_list',
        breadcrumb='OPPORTUNITY_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
               }, status.HTTP_200_OK


class OpportunityListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        if resp.state:
            return {'opportunity_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_opportunity(
            request=request,
            url=ApiURL.OPPORTUNITY_LIST,
            msg=SaleMsg.OPPORTUNITY_CREATE
        )


class OpportunityExpenseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EXPENSE_LIST).get(data)
        if resp.state:
            return {'opportunity_expense_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST


class OpportunityDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_detail.html',
        menu_active='',
        breadcrumb='OPPORTUNITY_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
               }, status.HTTP_200_OK


class OpportunityDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DETAIL.fill_key(pk=pk)).get()
        if resp.state:
            return {'opportunity': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DETAIL.fill_key(pk=pk)).put(  # noqa
            request.data
        )
        if resp.state:
            return {'opportunity': resp.result}, status.HTTP_200_OK
        if resp.errors:  # noqa
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class OpportunityCustomerDecisionFactorListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR).get()
        if resp.state:
            return {'opportunity_decision_factor': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        response = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR).post(data)
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


class OpportunityCustomerDecisionFactorDetailAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user, url=ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR_DETAIL.fill_key(pk=pk)
        ).delete(request.data)
        if resp.state:
            return {}, status.HTTP_200_OK
        return {'detail': resp.errors}, status.HTTP_500_INTERNAL_SERVER_ERROR


class OpportunityConfig(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_config.html',
        menu_active='menu_opportunity_config',
        breadcrumb='OPPORTUNITY_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).get()
        if res.state:
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).put(request.data)
        if res.state:
            res.result['message'] = SaleMsg.OPPORTUNITY_CONFIG_UPDATE
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST
