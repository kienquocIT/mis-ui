import json
from datetime import datetime

from django.http import JsonResponse
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class HRMAttendanceList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/attendance/attendance/attendance_list.html',
        breadcrumb='HRM_ATTENDANCE_LIST_PAGE',
        menu_active='menu_attendance_list',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {'data': {'current_period': resp1.result[0]}}, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class LoadSampleAttendanceListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        # load data
        data = request.query_params.dict()
        if 'emp_list' not in data or 'date_range' not in data:
            return JsonResponse({'error': 'Missing required parameters', 'status': 400}, status=400)

        # load attendance data
        try:
            with open("apps/hrm/attendance/sample_attendance_data.json", encoding="utf-8") as file:
                attendance_data = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            return JsonResponse({'error': 'Failed to load attendance data', 'status': 500}, status=500)

        # filter by employee list
        employee_ids = set(data.get("emp_list", "").split(","))

        # Parse date range
        try:
            range_obj = json.loads(data['date_range'])
            start_day = range_obj['start']['day']
            end_day = range_obj['end']['day']
            month = range_obj['start']['month']
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            return JsonResponse({'error': 'Invalid date range format', 'status': 400}, status=400)

        # filter data
        filtered_data = []
        for record in attendance_data:
            try:
                if (record.get('employee_id') in employee_ids and
                        record.get('checkin')):

                    checkin_dt = datetime.fromisoformat(record['checkin'])
                    if (checkin_dt.month == month and
                            start_day <= checkin_dt.day <= end_day):
                        filtered_data.append(record)

            except (ValueError, KeyError):
                continue

        return JsonResponse({'data': filtered_data, 'status': 200})


# class AttendanceListAPI(APIView):
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def get(self, request, *args, **kwargs):
#         params = request.query_params.dict()
#         resp = ServerAPI(user=request.user, url=ApiURL.ATTENDANCE_LIST).get(params)
#         return resp.auto_return(key_success="attendance_list")

class AttendanceListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        raw_params = request.query_params.dict()
        # filters = {}
        #
        # # parse employee list
        # emp_list_str = raw_params.get('emp_list', '')
        # if emp_list_str:
        #     emp_list = emp_list_str.split(',')
        #     filters['employee_id__in'] = ','.join(emp_list)
        #
        # # parse date range
        # try:
        #     date_range = json.loads(raw_params.get("date_range", '{}'))
        #     start_date = date_range['start']['day']
        #     end_date = date_range['end']['day']
        #     month = date_range['start']['month']
        #     year = datetime.now().year
        #     filters['date__gte'] = f"{year}-{month:02}-{start_date:02}"
        #     filters['date__lte'] = f"{year}-{month:02}-{end_date:02}"
        # except (json.JSONDecodeError, KeyError, TypeError):
        #     pass

        resp = ServerAPI(user=request.user, url=ApiURL.ATTENDANCE_LIST).get(raw_params)
        return resp.auto_return(key_success='attendance_list')

