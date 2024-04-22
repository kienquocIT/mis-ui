from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class CoreAccountUserImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_CORE_ACCOUNT_USER, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='group_level')


class HrGroupLevelImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_HR_GROUP_LEVEL, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='group_level')


class HrGroupImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_HR_GROUP, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='group')


class HrRoleImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_HR_ROLE, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='role')


class HrEmployeeImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_HR_EMPLOYEE, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='employee')
