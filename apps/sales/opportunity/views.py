from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared.apis import RespData
from apps.shared.constant import TYPE_CUSTOMER, ROLE_CUSTOMER, SYSTEM_STATUS
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, PermCheck, TypeCheck


# main
class OpportunityList(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_list.html',
        menu_active='menu_opportunity_list',
        breadcrumb='OPPORTUNITY_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_LIST, method='GET'),
        icon_cls='fas far fa-lightbulb',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_detail.html',
        menu_active='',
        breadcrumb='OPPORTUNITY_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DETAIL, method='GET', fill_key=['pk']),
        icon_cls='fas far fa-lightbulb',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
                   'type_customer': TYPE_CUSTOMER,
                   'role_customer': ROLE_CUSTOMER,
                   'list_from_app': 'task.opportunitytask.create',
                   'list_from_app_id': 'e66cfb5a-b3ce-4694-a4da-47618f53de4c',
                   'stt_sys': SYSTEM_STATUS,
               }, status.HTTP_200_OK


class OpportunityUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_update.html',
        menu_active='',
        breadcrumb='OPPORTUNITY_UPDATE_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DETAIL, method='PUT', fill_key=['pk']),
        icon_cls='fas far fa-lightbulb',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        # "list_from_app" this field for task form, who field choice employee follow by permission in opps.
        result = {
            'employee_current_id': request.user.employee_current_data.get('id', None),
            'type_customer': TYPE_CUSTOMER,
            'role_customer': ROLE_CUSTOMER,
            'list_from_app': 'task.opportunitytask.create',
            'list_from_app_id': 'e66cfb5a-b3ce-4694-a4da-47618f53de4c',
            'stt_sys': SYSTEM_STATUS,
        }
        return result, status.HTTP_200_OK


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
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class OpportunityDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DETAIL.fill_key(pk=pk)).get(data)
        return resp.auto_return(key_success='opportunity')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='opportunity')


# activities
class OpportunityCallLogList(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/call_log/call_log_list.html',
        menu_active='id_menu_log_a_call',
        breadcrumb='CALL_LOG_LIST_PAGE',
        icon_cls='fas fa-phone-volume',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        result = {
            'list_from_app': 'opportunity.opportunitycall.create',
            'app_id': '14dbc606-1453-4023-a2cf-35b1cd9e3efd',
        }
        return result, status.HTTP_200_OK


class OpportunityCallLogListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_LIST).get(params)
        return resp.auto_return(key_success='call_log_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_CALL_LOG_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class OpportunityCallLogDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='opportunity_call_log_detail')

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CALL_LOG_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


class OpportunityEmailList(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/email/email_list.html',
        menu_active='id_menu_email',
        breadcrumb='EMAIL_LIST_PAGE',
        icon_cls='fas bi bi-envelope-fill',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        result = {
            'list_from_app': 'opportunity.opportunityemail.create',
            'app_id': 'dec012bf-b931-48ba-a746-38b7fd7ca73b',
        }
        return result, status.HTTP_200_OK


class OpportunityEmailListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_LIST).get(params)
        return resp.auto_return(key_success='email_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_EMAIL_SEND
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class OpportunityEmailDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_DETAIL.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='opportunity_email_detail')

    @mask_view(auth_require=True, is_api=True, )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_EMAIL_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


class OpportunityMeetingList(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/meeting/meeting_list.html',
        menu_active='id_menu_meeting',
        breadcrumb='MEETING_LIST_PAGE',
        icon_cls='fas bi bi-person-workspace',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        result = {
            'list_from_app': 'opportunity.meetingwithcustomer.create',
            'app_id': '2fe959e3-9628-4f47-96a1-a2ef03e867e3',
        }
        return result, status.HTTP_200_OK


class OpportunityMeetingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        if 'self_employee' in params:
            del params['self_employee']
            employee_current_data = getattr(request.user, 'employee_current_data', {})
            params['employee_in_list'] = employee_current_data.get("id", None)
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_LIST).get(params)
        return resp.auto_return(key_success='meeting_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_MEETING_CREATED
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class OpportunityMeetingDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_DETAIL.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='opportunity_meeting_detail')

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEETING_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


class OpportunityDocumentList(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/document/document_list.html',
        menu_active='menu_opportunity_document',
        breadcrumb='OPPORTUNITY_DOCUMENT_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DOCUMENT_LIST, method='GET'),
        icon_cls='fas bi bi-file-earmark',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityDocumentCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/document/document_create.html',
        menu_active='menu_opportunity_document',
        breadcrumb='OPPORTUNITY_DOCUMENT_CREATE_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_DOCUMENT_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityDocumentDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/activities/document/document_detail.html',
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
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_DOCUMENT_LIST).get(params)
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


class OpportunityActivityLogListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_ACTIVITY_LOGS).get(params)
        return resp.auto_return(key_success='activity_logs_list')


# config
class OpportunityConfigDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_config.html',
        menu_active='menu_opportunity_config',
        breadcrumb='OPPORTUNITY_CONFIG_PAGE',
        perm_check=PermCheck(url=ApiURL.OPPORTUNITY_CONFIG_DETAIL, method='GET'),
        icon_cls='fas far fa-lightbulb',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.APPLICATION_PROPERTY_OPPORTUNITY_LIST).get()
        return resp.auto_return(key_success='property_opportunity_list')


class OpportunityConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_DETAIL).get()
        return resp.auto_return(key_success='opportunity_config')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_DETAIL).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# stages
class OpportunityConfigStageListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
        login_require=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE_LIST).get(params)
        return resp.auto_return(key_success='opportunity_config_stage')

    @mask_view(
        auth_require=True,
        is_api=True,
        login_require=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONFIG_STAGE_LIST).post(request.data)
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


class OpportunityStageCheckingAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_STAGE_CHECKING).get(data)
        return resp.auto_return(key_success='opportunity_stage_checking')


# related
class OpportunityCustomerDecisionFactorListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR_LIST).get(params)
        return resp.auto_return(key_success='opportunity_decision_factor')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR_LIST).post(request.data)
        return resp.auto_return()


class OpportunityCustomerDecisionFactorDetailAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        url = ApiURL.OPPORTUNITY_CUSTOMER_DECISION_FACTOR_DETAIL.fill_key(pk=pk)
        resp = ServerAPI(user=request.user, url=url).delete(request.data)
        return resp.auto_return()


class OpportunityMemberListAPI(APIView):
    @mask_view(is_api=True, auth_require=True)
    def post(self, request, *args, pk_opp, **kwargs):
        if TypeCheck.check_uuid(pk_opp):
            resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_MEMBER_LIST.fill_key(pk_opp=pk_opp)).post(
                data=request.data
            )
            return resp.auto_return(key_success='member')
        return RespData.resp_404()


class OpportunityMemberDetailAPI(APIView):
    @mask_view(is_api=True, auth_require=True)
    def get(self, request, *args, pk_opp, pk_member, **kwargs):
        if TypeCheck.check_uuid(pk_opp) and TypeCheck.check_uuid(pk_member):
            resp = ServerAPI(
                user=request.user, url=ApiURL.OPPORTUNITY_MEMBER_DETAIL.fill_key(pk_opp=pk_opp, pk_member=pk_member)
            ).get()
            return resp.auto_return(key_success='member')
        return RespData.resp_404()

    @mask_view(is_api=True, auth_require=True)
    def put(self, request, *args, pk_opp, pk_member, **kwargs):
        if TypeCheck.check_uuid(pk_opp) and TypeCheck.check_uuid(pk_member):
            resp = ServerAPI(
                user=request.user, url=ApiURL.OPPORTUNITY_MEMBER_DETAIL.fill_key(pk_opp=pk_opp, pk_member=pk_member)
            ).put(data=request.data)
            return resp.auto_return(key_success='member')
        return RespData.resp_404()

    @mask_view(is_api=True, auth_require=True)
    def delete(self, request, *args, pk_opp, pk_member, **kwargs):
        if TypeCheck.check_uuid(pk_opp) and TypeCheck.check_uuid(pk_member):
            resp = ServerAPI(
                user=request.user, url=ApiURL.OPPORTUNITY_MEMBER_DETAIL.fill_key(pk_opp=pk_opp, pk_member=pk_member)
            ).delete()
            return resp.auto_return(key_success='member')
        return RespData.resp_404()


class OpportunityContractSummary(View):
    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_contract_summary.html',
        menu_active='',
        breadcrumb='OPPORTUNITY_CONTRAT_SUMMARY_PAGE',
        icon_cls='fas fa-pager',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityContractSummaryAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_CONTRACT_SUMMARY).get(data)
        return resp.auto_return(key_success='opportunity_contract_summary')


# table API
class OppProductListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_SALE_LIST).get(data)
        return resp.auto_return(key_success='product_list')


class OppProductCategoryListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_LIST).get(data)
        return resp.auto_return(key_success='product_category_list')


class OppTaxListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get(data)
        return resp.auto_return(key_success='tax_list')


class OppUOMListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).get(data)
        return resp.auto_return(key_success='unit_of_measure')


class OppCompetitorListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get(data)
        return resp.auto_return(key_success='account_list')


class OppContactListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get(data)
        return resp.auto_return(key_success='contact_list')
