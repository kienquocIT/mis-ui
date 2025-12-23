from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

# JE document type
class JEDocumentTypeList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/je_document_type.html',
        breadcrumb='JE_DOCUMENT_TYPE_LIST_PAGE',
        menu_active='menu_je_document_type',
        icon_cls='fa-solid fa-infinity',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class JEDocumentTypeListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_DOCUMENT_TYPE_LIST).get(params)
        return resp.auto_return(key_success='je_document_type')


class JEDocumentTypeDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_DOCUMENT_TYPE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()

# JE posting group
class JEPostingGroupList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/je_posting_group.html',
        breadcrumb='JE_POSTING_GROUP_LIST_PAGE',
        menu_active='menu_je_posting_group',
        icon_cls='fa-solid fa-layer-group',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        je_group_type_resp = ServerAPI(user=request.user, url=ApiURL.JE_GROUP_TYPE).get()
        return {
            'data': {
                'je_group_type': je_group_type_resp.result
            }
        }, status.HTTP_200_OK


class JEPostingGroupListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_GROUP_LIST).get(params)
        return resp.auto_return(key_success='je_posting_group')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_GROUP_LIST).post(request.data)
        if resp.state:
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class JEPostingGroupDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_GROUP_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_GROUP_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return()

# JE posting group - role key
class JEPostingGroupRoleKeyListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_GROUP_ROLE_KEY_LIST).get(params)
        return resp.auto_return(key_success='je_posting_group_role_key')

# JE group assigment
class JEGroupAssignmentListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_GROUP_ASSIGNMENT_LIST).get(params)
        return resp.auto_return(key_success='je_group_assignment')

# JE account mapping
class JEGLAccountMappingList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/je_gl_account_mapping.html',
        breadcrumb='JE_GL_ACCOUNT_MAPPING_LIST_PAGE',
        menu_active='menu_je_gl_account_mapping',
        icon_cls='fa-solid fa-circle-nodes',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        je_group_type_resp = ServerAPI(user=request.user, url=ApiURL.JE_GROUP_TYPE).get()
        return {
            'data': {
                'je_group_type': je_group_type_resp.result
            }
        }, status.HTTP_200_OK


class JEGLAccountMappingListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_GL_ACCOUNT_MAPPING_LIST).get(params)
        return resp.auto_return(key_success='je_gl_account_mapping')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_GL_ACCOUNT_MAPPING_LIST).post(request.data)
        if resp.state:
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class JEGLAccountMappingDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_GL_ACCOUNT_MAPPING_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_GL_ACCOUNT_MAPPING_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return()

# JE posting rule
class JEPostingRuleList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/je_posting_rule.html',
        breadcrumb='JE_POSTING_RULE_LIST_PAGE',
        menu_active='menu_je_posting_rule',
        icon_cls='fa-solid fa-pen-ruler',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        je_document_type_resp = ServerAPI(user=request.user, url=ApiURL.JE_DOCUMENT_TYPE).get()
        je_group_type_resp = ServerAPI(user=request.user, url=ApiURL.JE_GROUP_TYPE).get()
        return {
            'data': {
                'je_document_type': je_document_type_resp.result,
                'je_group_type': je_group_type_resp.result
            }
        }, status.HTTP_200_OK


class JEPostingRuleListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_RULE_LIST).get(params)
        return resp.auto_return(key_success='je_posting_rule')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_RULE_LIST).post(request.data)
        if resp.state:
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class JEPostingRuleDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_RULE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_RULE_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return()


class JEAmountSourceListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        je_amount_source_resp = ServerAPI(user=request.user, url=ApiURL.JE_AMOUNT_SOURCE).get(params)
        return je_amount_source_resp.auto_return(key_success='je_amount_source')

# Auto JE Configure Guide
class JEConfigureGuidePage(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/guide.html',
        breadcrumb='AUTO_JE_CONFIGURE_GUIDE_PAGE',
        menu_active='menu_auto_je_guide_page',
        icon_cls='fa-regular fa-circle-question',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
