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
