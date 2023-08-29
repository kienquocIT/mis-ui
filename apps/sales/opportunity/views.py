from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared.constant import TYPE_CUSTOMER, ROLE_CUSTOMER

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, PermCheck


def create_update_opportunity(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class OpportunityList(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_list.html',
        menu_active='menu_opportunity_list',
        breadcrumb='OPPORTUNITY_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get(data)
        return resp.auto_return(key_success='opportunity_list')

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


class OpportunityDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_detail_page.html',
        menu_active='',
        breadcrumb='OPPORTUNITY_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_detail.html',
        menu_active='',
        breadcrumb='OPPORTUNITY_UPDATE_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DETAIL, method='PUT', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        result = {
            'employee_current_id': request.user.employee_current_data.get('id', None),
            'account_list': resp1.result,
            'contact_list': resp2.result,
            'opportunity_list': resp3.result,
            'employee_list': resp4.result,
            'type_customer': TYPE_CUSTOMER,
            'role_customer': ROLE_CUSTOMER,
        }
        return result, status.HTTP_200_OK


class OpportunityDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='opportunity')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='opportunity')


class OpportunityCustomerDecisionFactorListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR).get()
        return resp.auto_return(key_success='opportunity_decision_factor')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR).post(request.data)
        return resp.auto_return()


class OpportunityCustomerDecisionFactorDetailAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        url = ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR_DETAIL.fill_key(pk=pk)
        resp = ServerAPI(user=request.user, url=url).delete(request.data)
        return resp.auto_return()


class OpportunityConfig(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_config.html',
        menu_active='menu_opportunity_config',
        breadcrumb='OPPORTUNITY_CONFIG_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_CONFIG, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.APPLICATION_PROPERTY_OPPORTUNITY_LIST).get()
        return resp.auto_return(key_success='property_opportunity_list')


class OpportunityConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).get()
        return resp.auto_return(key_success='opportunity_config')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class OpportunityConfigStageListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
        login_require=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE).get()
        return resp.auto_return(key_success='opportunity_config_stage')

    @mask_view(
        auth_require=True,
        is_api=True,
        login_require=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE).post(request.data)
        return resp.auto_return()


class OpportunityConfigStageDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        url = ApiURL.OPPORTUNITY_CONFIG_STAGE_DETAIL.fill_key(pk=pk)
        resp = ServerAPI(user=request.user, url=url).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        url = ApiURL.OPPORTUNITY_CONFIG_STAGE_DETAIL.fill_key(pk=pk)
        resp = ServerAPI(user=request.user, url=url).delete(request.data)
        return resp.auto_return()


class RestoreDefaultStageAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        company_current_id = request.user.company_current_data.get('id', None)
        url = ApiURL.RESTORE_DEFAULT_OPPORTUNITY_CONFIG_STAGE.fill_key(pk=company_current_id)
        resp = ServerAPI(user=request.user, url=url).put(request.data)
        return resp.auto_return()


class OpportunityCallLogList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/call_log_list.html',
        menu_active='id_menu_log_a_call',
        breadcrumb='CALL_LOG_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        result = {
            'employee_current_id': request.user.employee_current_data.get('id', None),
            'account_list': resp1.result,
            'contact_list': resp2.result,
            'opportunity_list': resp3.result,
        }
        return result, status.HTTP_200_OK


class OpportunityCallLogListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_LIST).get()
        return resp.auto_return(key_success='call_log_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_opportunity(
            request=request, url=ApiURL.OPPORTUNITY_CALL_LOG_LIST, msg=SaleMsg.OPPORTUNITY_CALL_LOG_CREATE
        )


class OpportunityCallLogDeleteAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_DELETE.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return()


class OpportunityEmailList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/email_list.html',
        menu_active='id_menu_email',
        breadcrumb='EMAIL_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        result = {
            'employee_current_id': request.user.employee_current_data.get('id', None),
            'account_list': resp1.result,
            'contact_list': resp2.result,
            'opportunity_list': resp3.result,
        }
        return result, status.HTTP_200_OK


class OpportunityEmailListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_LIST).get()
        return resp.auto_return(key_success='email_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_opportunity(
            request=request, url=ApiURL.OPPORTUNITY_EMAIL_LIST, msg=SaleMsg.OPPORTUNITY_EMAIL_SEND
        )


class OpportunityEmailDeleteAPI(APIView):
    @mask_view(auth_require=True, is_api=True, )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_DELETE.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return()


class OpportunityMeetingList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/meeting_list.html',
        menu_active='id_menu_meeting',
        breadcrumb='MEETING_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        result = {
            'employee_current_id': request.user.employee_current_data.get('id', None),
            'account_list': resp1.result,
            'contact_list': resp2.result,
            'opportunity_list': resp3.result,
            'employee_list': resp4.result,
        }
        return result, status.HTTP_200_OK


class OpportunityMeetingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_LIST).get()
        return resp.auto_return(key_success='meeting_list')

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
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_DELETE.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return()


class OpportunityActivityLogListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_ACTIVITY_LOGS).get(params)
        return resp.auto_return(key_success='activity_logs_list')


class OpportunityDocumentList(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/document_list.html',
        menu_active='menu_opportunity_document',
        breadcrumb='OPPORTUNITY_DOCUMENT_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DOCUMENT_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityDocumentCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/document_create.html',
        menu_active='menu_opportunity_document',
        breadcrumb='OPPORTUNITY_DOCUMENT_CREATE_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DOCUMENT_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityDocumentDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/document_detail.html',
        menu_active='menu_opportunity_document',
        breadcrumb='OPPORTUNITY_DOCUMENT_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DOCUMENT_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityDocumentListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DOCUMENT_LIST).get()
        return resp.auto_return(key_success='document_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DOCUMENT_LIST).post(request.data)
        return resp.auto_return()


class OpportunityDocumentDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DOCUMENT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='opportunity_doc')


# Opportunity List use for Sale Apps
class OpportunityForSaleListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_SALE_LIST).get(data)
        return resp.auto_return(key_success='opportunity_sale_list')
