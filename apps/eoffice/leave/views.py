from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PAID_BY, InputMappingProperties

from apps.shared.constant import SYSTEM_STATUS, LEAVE_ACTION

from apps.shared.msg import LeaveMsg

__all__ = ['LeaveConfigDetail', 'LeaveTypeConfigAPI', 'WorkingCalendarConfig', 'WorkingYearConfig',
           'WorkingHolidayConfig', 'WorkingCalendarConfigAPI', 'LeaveRequestList', 'LeaveRequestListAPI',
           'LeaveRequestCreate', 'LeaveRequestCreateAPI', 'LeaveAvailableList', 'LeaveAvailableListAPI',
           'LeaveRequestDetail', 'LeaveRequestDetailAPI', 'LeaveRequestEdit', 'LeaveRequestEditAPI',
           'LeaveAvailableHistoryAPI', 'LeaveRequestCalendarListAPI', 'LeaveAvailableDDListAPI'
           ]


class LeaveConfigDetail(View):

    @classmethod
    def callback_success(cls, result):
        return {
            'PAID_BY': PAID_BY,
            'config_data': result
        }

    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/config.html',
        menu_active='menu_leave_config',
        breadcrumb='LEAVE_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_CONFIG).get()
        return resp.auto_return(callback_success=self.callback_success)


class LeaveTypeConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_CREATE).post(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.LEAVE_TYPE_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.LEAVE_TYPE_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_DETAIL.fill_key(pk=pk)).delete({})
        if resp.state:
            return {'message': LeaveMsg.LEAVE_TYPE_DELETE}, status.HTTP_200_OK
        return resp.auto_return()


class WorkingCalendarConfig(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/working_calendar.html',
        menu_active='menu_working_calendar',
        breadcrumb='WORKING_CALENDAR_CONFIG',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_CONFIG).get()
        return resp.auto_return(key_success="wc_cfg")


class WorkingCalendarConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_CALENDAR_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class WorkingYearConfig(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_YEAR).post(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_YEAR_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_YEAR.push_id(pk)).delete({})
        if resp.state:
            return {'message': LeaveMsg.WORKING_YEAR_DELETE}, status.HTTP_200_OK
        return resp.auto_return()


class WorkingHolidayConfig(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_HOLIDAY).post(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_HOLIDAY_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_HOLIDAY.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_HOLIDAY_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_HOLIDAY.push_id(pk)).delete({})
        if resp.state:
            return {'message': LeaveMsg.WORKING_HOLIDAY_DELETE}, status.HTTP_200_OK
        return resp.auto_return()


class LeaveRequestList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/requests.html',
        menu_active='menu_leave_request',
        breadcrumb='LEAVE_REQUEST',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class LeaveRequestListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_REQUEST).get(request.query_params.dict())
        return resp.auto_return(key_success='leave_request')


class LeaveRequestCalendarListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        if 'self_employee' in params:
            del params['self_employee']
            employee_current_data = getattr(request.user, 'employee_current_data', {})
            params['leave_employee_list'] = employee_current_data.get('id', None)
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_REQUEST_CALENDAR).get(params)
        return resp.auto_return(key_success='leave_request_calendar')


class LeaveRequestCreate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/create.html',
        menu_active='menu_leave_request',
        breadcrumb='LEAVE_REQUEST_CREATE',
    )
    def get(self, request, *args, **kwargs):
        res_ws = []
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_CONFIG).get()
        reps_employee = ServerAPI(
            user=request.user, url=ApiURL.EMPLOYEE_DETAIL_PK.fill_key(pk=request.user.employee_current_data['id'])
        ).get({'list_from_app': 'leave.leaverequest.create', 'list_from_leave': '1'})
        current_emp = {}
        if resp.state:
            res_ws = resp.result
        if reps_employee.state:
            current_emp = reps_employee.result
        else:
            return {}, status.HTTP_404_NOT_FOUND
        return {
                   'working_shift': res_ws,
                   'employee': current_emp,
                   'list_from_app': 'leave.leaverequest.create'
               }, status.HTTP_200_OK


class LeaveRequestCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_REQUEST).post(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.LEAVE_REQUEST_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class LeaveRequestDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/detail.html',
        menu_active='menu_leave_request',
        breadcrumb='LEAVE_REQUEST_DETAIL',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'employee': request.user.employee_current_data,
                   'pk': pk,
                   'sys_status': SYSTEM_STATUS
               }, status.HTTP_200_OK


class LeaveRequestDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_REQUEST_DETAIL.fill_key(pk=pk)).get(
            request.query_params.dict()
        )
        return resp.auto_return(key_success='leave_request_detail')


class LeaveRequestEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/edit.html',
        menu_active='menu_leave_request',
        breadcrumb='LEAVE_REQUEST_EDIT',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.LEAVE_DATA_MAP
        res_ws = []
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_CONFIG).get()
        if resp.state:
            res_ws = resp.result
        return {
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'leave_edit',
                   'pk': pk,
                   'sys_status': SYSTEM_STATUS,
                   'list_from_app': 'leave.leaverequest.edit',
                   'working_shift': res_ws,
               }, status.HTTP_200_OK


class LeaveRequestEditAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_REQUEST_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_REQUEST_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return()


class LeaveAvailableList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/available.html',
        menu_active='menu_leave_available',
        breadcrumb='LEAVE_AVAILABLE',
    )
    def get(self, request, *args, **kwargs):
        return {'action': LEAVE_ACTION}, status.HTTP_200_OK


class LeaveAvailableListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        params['employee_inherit_id'] = params['employee']
        del params['employee']
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_AVAILABLE).get(params)
        return resp.auto_return(key_success='leave_available')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_AVAILABLE_UPDATE.fill_key(pk=data['id'])).put(
            data
        )
        if resp.state:
            resp.result['message'] = LeaveMsg.LEAVE_AVAILABLE_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class LeaveAvailableDDListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        params['employee_inherit_id'] = params['employee']
        del params['employee']
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_AVAILABLE_DDLIST).get(params)
        return resp.auto_return(key_success='leave_available')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_AVAILABLE_UPDATE.fill_key(pk=data['id'])).put(
            data
        )
        if resp.state:
            resp.result['message'] = LeaveMsg.LEAVE_AVAILABLE_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class LeaveAvailableHistoryAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_AVAILABLE_HISTORY.fill_key(pk=params['employee'])).get()
        return resp.auto_return(key_success='leave_available_history')
