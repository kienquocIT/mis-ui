from django.views import View
from apps.shared import ServerAPI, mask_view, SYSTEM_STATUS, ApiURL, SaleMsg, InputMappingProperties
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


def create(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()

def update(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()

class ListList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/partnercenter/list/list_list.html',
        menu_active='menu_partner_center_lists',
        breadcrumb='PARTNER_CENTER_LIST_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK

class ListCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/partnercenter/list/list_create.html',
        menu_active='menu_partner_center_lists',
        breadcrumb='PARTNER_CENTER_LIST_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            # "list_from_app": 'consulting.consulting.create',
            # 'input_mapping_properties': InputMappingProperties.CONSULTING_DATA_MAP,
            'form_id': 'form_partnercenter_list',
            # 'app_id': '3a369ba582a04c4da4473794b67d1d02'
        }
        return ctx, status.HTTP_200_OK

class ListDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/partnercenter/list/list_detail.html',
        menu_active='menu_partner_center_lists',
        breadcrumb='PARTNER_CENTER_LIST_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            # 'data': {'doc_id': pk},
            # 'input_mapping_properties': InputMappingProperties.CONSULTING_DATA_MAP,
            'form_id': 'form_partnercenter_list',
            # 'employee_current': request.user.employee_current_data,
        }, status.HTTP_200_OK

class ListUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/partnercenter/list/list_update.html',
        menu_active='menu_partner_center_lists',
        breadcrumb='PARTNER_CENTER_LIST_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            # 'data': {'doc_id': pk},
            # 'input_mapping_properties': InputMappingProperties.CONSULTING_DATA_MAP,
            'form_id': 'form_partnercenter_list',
            # 'employee_current': request.user.employee_current_data,
        }, status.HTTP_200_OK

class ResultList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/partnercenter/list/result_list.html',
        menu_active='menu_partner_center_lists',
        breadcrumb='PARTNER_CENTER_LIST_LIST_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            # 'data': {'doc_id': pk},
            # 'input_mapping_properties': InputMappingProperties.BIDDING_DATA_MAP,
            # 'form_id': 'frm_bidding_create',
            # 'employee_current': request.user.employee_current_data,
        }, status.HTTP_200_OK

class ListListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LIST_LIST).get(data)
        return resp.auto_return(key_success='list_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create(
            request=request,
            url=ApiURL.LIST_LIST,
            msg="PPLPPKKAKEWGWSGBSRBHJDRF BIKRB"
        )

class ListDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LIST_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update(
            request=request,
            url=ApiURL.LIST_DETAIL,
            pk=pk,
            msg='asfaeybfgaeuysbfyeiafa'
        )

class ListResultListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LIST_RESULT_LIST.push_id(pk)).get()
        return resp.auto_return()

class ListDataObjectListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PARTNER_CENTER_LIST_DATA_OBJ_LIST).get(None)
        return resp.auto_return(key_success='data_object_list')

class ListEmployeeListAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.LIST_EMPLOYEE_LIST, user=request.user).get()
        return resp.auto_return(key_success='employee_list')

class ListContactListAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.LIST_CONTACT_LIST, user=request.user).get()
        return resp.auto_return(key_success='contact_list')

class ListIndustryListAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.LIST_INDUSTRY_LIST, user=request.user).get()
        return resp.auto_return(key_success='industry_list')

class ListOpportunityConfigStageListAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.LIST_OPP_CONFIG_STAGE_LIST, user=request.user).get()
        return resp.auto_return(key_success='opp_config_stage_list')
