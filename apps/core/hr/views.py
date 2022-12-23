from django.shortcuts import redirect
from django.urls import reverse
from django.views import View

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL


class EmployeeList(View):
    @mask_view(auth_require=True, template='core/hr/employee/employee_list.html', breadcrumb='EMPLOYEE_LIST_PAGE')
    def get(self, request, *args, **kwargs):
        return {}


class EmployeeListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.EMPLOYEE_LIST, user=request.user).get()
        if resp.state:
            return {'employee_list': resp.result}
        elif resp.status == 401:
            request.session.flush()
            return redirect(reverse('AuthLogin'))
        return {'errors': resp.errors}


class EmployeeCreate(View):
    @mask_view(auth_require=True, template='core/hr/employee/employee_create.html', breadcrumb='EMPLOYEE_CREATE_PAGE')
    def get(self, request, *args, **kwargs):
        return {}
