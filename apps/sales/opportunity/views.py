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
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).get()
        if resp.state:
            return {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'config': resp.result
                   }, status.HTTP_200_OK
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
               }, status.HTTP_200_OK


class OpportunityListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get(data)
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
        resp0 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).get()
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        resp5 = ServerAPI(user=request.user, url=ApiURL.ACCOUNTS_MAP_EMPLOYEES).get()
        if resp0.state and resp1.state and resp2.state and resp3.state and resp4.state and resp5.state:
            return {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'config': resp0.result,
                       'account_list': resp1.result,
                       'contact_list': resp2.result,
                       'opportunity_list': resp3.result,
                       'employee_list': resp4.result,
                       'account_map_employees': resp5.result
            }, status.HTTP_200_OK
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
        resp = ServerAPI(user=request.user, url=ApiURL.APPLICATION_PROPERTY_OPPORTUNITY_LIST).get()
        if resp.state:
            return {'property_opportunity_list': resp.result[::-1]}, status.HTTP_200_OK
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


class OpportunityConfigStageListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
        login_require=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE).get()
        if resp.state:
            return {'opportunity_config_stage': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
        login_require=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        response = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE).post(data)
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


class OpportunityConfigStageDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, pk, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE_DETAIL.fill_key(pk=pk)).get()
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
    def put(self, request, pk, *args, **kwargs):
        res = ServerAPI(
            user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE_DETAIL.fill_key(pk=pk)
        ).put(request.data)
        if res.state:
            res.result['message'] = SaleMsg.OPPORTUNITY_CONFIG_UPDATE
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE_DETAIL.fill_key(pk=pk)
        ).delete(request.data)
        if resp.state:
            return {}, status.HTTP_200_OK
        return {'detail': resp.errors}, status.HTTP_500_INTERNAL_SERVER_ERROR


class RestoreDefaultStageAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        company_current_id = request.user.company_current_data.get('id', None)
        resp = ServerAPI(
            user=request.user,
            url=ApiURL.RESTORE_DEFAULT_OPPORTUNITY_CONFIG_STAGE.fill_key(pk=company_current_id)
        ).put(  # noqa
            request.data
        )
        if resp.state:
            return resp.result, status.HTTP_200_OK
        if resp.errors:  # noqa
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class OpportunityCallLogList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/call_log_list.html',
        menu_active='id_menu_log_a_call',
        breadcrumb='CALL_LOG_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).get()
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_LIST).get()
        if resp0.state and resp1.state and resp2.state and resp3.state and resp4.state:
            return {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'account_list': resp1.result,
                       'contact_list': resp2.result,
                       'opportunity_list': resp3.result,
                       'call_log_list': resp4.result,
                   }, status.HTTP_200_OK
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
               }, status.HTTP_200_OK


class OpportunityCallLogListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_LIST).get()
        if resp.state:
            return {'call_log_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_opportunity(
            request=request, url=ApiURL.OPPORTUNITY_CALL_LOG_LIST, msg=SaleMsg.OPPORTUNITY_CALL_LOG_CREATE
        )


class OpportunityCallLogDeleteAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_DELETE.fill_key(pk=pk)).put(request.data)
        if resp.state:
            return {'opportunity_call_log': resp.result}, status.HTTP_200_OK
        if resp.errors:  # noqa
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class OpportunityEmailList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/email_list.html',
        menu_active='id_menu_email',
        breadcrumb='EMAIL_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).get()
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_LIST).get()
        if resp0.state and resp1.state and resp2.state and resp3.state and resp4.state:
            return {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'account_list': resp1.result,
                       'contact_list': resp2.result,
                       'opportunity_list': resp3.result,
                       'email_list': resp4.result,
                   }, status.HTTP_200_OK
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
               }, status.HTTP_200_OK


class OpportunityEmailListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_LIST).get()
        if resp.state:
            return {'email_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_opportunity(
            request=request, url=ApiURL.OPPORTUNITY_EMAIL_LIST, msg=SaleMsg.OPPORTUNITY_EMAIL_SEND
        )


class OpportunityEmailDeleteAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_DELETE.fill_key(pk=pk)).put(request.data)
        if resp.state:
            return {'opportunity_email': resp.result}, status.HTTP_200_OK
        if resp.errors:  # noqa
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class OpportunityMeetingList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/meeting_list.html',
        menu_active='id_menu_meeting',
        breadcrumb='MEETING_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).get()
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_LIST).get()
        resp5 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        resp6 = ServerAPI(user=request.user, url=ApiURL.ACCOUNTS_MAP_EMPLOYEES).get()
        if resp0.state and resp1.state and resp2.state and resp3.state and resp4.state and resp5.state and resp6.result:
            return {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'account_list': resp1.result,
                       'contact_list': resp2.result,
                       'opportunity_list': resp3.result,
                       'meeting_list': resp4.result,
                       'employee_list': resp5.result,
                       'account_map_employees': resp6.result
                   }, status.HTTP_200_OK
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
               }, status.HTTP_200_OK


class OpportunityMeetingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_LIST).get()
        if resp.state:
            return {'meeting_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_opportunity(
            request=request, url=ApiURL.OPPORTUNITY_MEETING_LIST, msg=SaleMsg.OPPORTUNITY_MEETING_CREATED
        )


class OpportunityMeetingDeleteAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_DELETE.fill_key(pk=pk)).put(request.data)
        if resp.state:
            return {'opportunity_meeting': resp.result}, status.HTTP_200_OK
        if resp.errors:  # noqa
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
