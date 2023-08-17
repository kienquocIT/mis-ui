from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, InputMappingProperties, PermCheck
from apps.shared.constant import COMPANY_SIZE, CUSTOMER_REVENUE


class ContactMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/saledata_contact_list.html',
        breadcrumb='CONTACT_MASTER_DATA_LIST_PAGE',
        menu_active='id_menu_master_data_contact',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class SalutationListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.SALUTATION_LIST).get()
        return resp.auto_return(key_success='salutation_list')


class SalutationCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.SALUTATION_LIST).post(data)
        return resp.auto_return()


class SalutationDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.SALUTATION_DETAIL_PK.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='salutation')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        url = ApiURL.SALUTATION_DETAIL_PK.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
        return resp.auto_return(key_success='salutation')


class InterestListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.INTERESTS_LIST).get()
        return resp.auto_return(key_success='interests_list')


class InterestCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.INTERESTS_LIST).post(data)
        return resp.auto_return()


class InterestDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.INTEREST_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='interest')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.INTEREST_DETAIL.fill_key(pk=pk)).put(
            request.data
        )
        return resp.auto_return(key_success='interest')


class ContactList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/accounts/contact_list.html',
        breadcrumb='CONTACT_LIST_PAGE',
        menu_active='id_menu_contact',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContactListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.CONTACT_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='contact_list')


class ContactCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/accounts/contact_create.html',
        breadcrumb='CONTACT_CREATE_PAGE',
        menu_active='menu_contact_list',
        perm_check=PermCheck(url=ApiURL.CONTACT_LIST, method='post'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContactCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).get()
        return resp.auto_return(key_success='contact_list')

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST).post(data)
        return resp.auto_return()


class ContactDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/accounts/contact_detail.html',
        breadcrumb='CONTACT_DETAIL_PAGE',
        menu_active='menu_contact_detail',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContactDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTACT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='contact_detail')


class ContactUpdate(View):
    @mask_view(
        auth_require=True, template='masterdata/saledata/accounts/contact_update.html',
        breadcrumb='CONTACT_UPDATE_PAGE',
        menu_active='menu_contact_detail',
        perm_check=PermCheck(url=ApiURL.CONTACT_DETAIL, method='put', fill_key=['pk']),
    )
    def get(self, request, *args, pk, **kwargs):
        input_mapping_properties = InputMappingProperties.SALE_DATA_CONTACT
        return {
                   'input_mapping_properties': input_mapping_properties, 'form_id': 'form-create-contact'
               }, status.HTTP_200_OK


class ContactUpdateAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTACT_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


class ContactListNotMapAccountAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTACT_LIST_NOT_MAP_ACCOUNT).get()
        return resp.auto_return(key_success='contact_list_not_map_account')


class AccountMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/saledata_account_list.html',
        breadcrumb='ACCOUNT_MASTER_DATA_LIST_PAGE',
        menu_active='id_menu_master_data_account',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AccountTypeListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_TYPE_LIST).get()
        return resp.auto_return(key_success='account_type_list')


class AccountTypeCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_TYPE_LIST).post(request.data)
        return resp.auto_return()


class AccountTypeDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_TYPE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='account_type')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_TYPE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='account_type')


class AccountGroupListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_GROUP_LIST).get()
        return resp.auto_return(key_success='account_group_list')


class AccountGroupCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_GROUP_LIST).post(request.data)
        return resp.auto_return()


class AccountGroupDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_GROUP_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='account_group')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_GROUP_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='account_group')


class IndustryListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INDUSTRY_LIST).get()
        return resp.auto_return(key_success='industry_list')


class IndustryCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INDUSTRY_LIST).post(request.data)
        return resp.auto_return()


class IndustryDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INDUSTRY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='industry')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INDUSTRY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='industry')


class AccountList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/accounts/account_list.html',
        breadcrumb='ACCOUNT_LIST_PAGE',
        menu_active='id_menu_account',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AccountListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        filter = request.query_params.dict()
        if 'account_types_mapped__account_type_order' in filter:
            filter['account_types_mapped__account_type_order'] = int(filter['account_types_mapped__account_type_order'])
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.ACCOUNT_LIST).get(filter)
        return resp.auto_return(key_success='account_list')


class AccountCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/accounts/account_create.html',
        breadcrumb='ACCOUNT_CREATE_PAGE',
        menu_active='menu_account_list',
        perm_check=PermCheck(url=ApiURL.ACCOUNT_LIST, method='post'),
    )
    def get(self, request, *args, **kwargs):
        return {'company_size': COMPANY_SIZE, 'customer_revenue': CUSTOMER_REVENUE}, status.HTTP_200_OK


class AccountCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).post(request.data)
        return resp.auto_return()


class AccountDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/accounts/account_detail.html',
        breadcrumb='ACCOUNT_DETAIL_PAGE',
        menu_active='menu_account_detail',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.SALE_DATA_ACCOUNT
        return {
                   'input_mapping_properties': input_mapping_properties, 'form_id': 'form-detail-update-account'
               }, status.HTTP_200_OK


class AccountUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/accounts/account_update.html',
        breadcrumb='ACCOUNT_UPDATE_PAGE',
        menu_active='menu_account_update',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.SALE_DATA_ACCOUNT
        return {
                   'input_mapping_properties': input_mapping_properties, 'form_id': 'form-detail-update-account'
               }, status.HTTP_200_OK


class AccountDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='account_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='account_detail')


class AccountsMapEmployeeAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNTS_MAP_EMPLOYEES).get()
        return resp.auto_return(key_success='accounts_map_employee')


# Account List use for Sale Apps
class AccountForSaleListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_SALE_LIST).get(data)
        return resp.auto_return(key_success='account_sale_list')
