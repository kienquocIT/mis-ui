from django.shortcuts import render, redirect
from django.urls import reverse
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.shared import ServerAPI, ApiURL, mask_view


class HomeView(APIView):
    spaces = {
        'sale': {'name': 'Sale', 'code': 'sale', 'icon': '<i class="fas fa-user-astronaut"></i>'},
        'e-office': {'name': 'E-Office', 'code': 'e-office', 'icon': '<i class="fas fa-rocket"></i>'},
        'hrm': {'name': 'HRM', 'code': 'hrm', 'icon': '<i class="fas fa-satellite"></i>'},
    }

    @staticmethod
    def parse_spaces(space_code: str, space_list: dict) -> (dict, list):
        space_selected = {}
        if space_code and space_code in space_list.keys():
            space_all_list = []
            space_selected = space_list[space_code]
            for key, value in space_list.items():
                if key != space_code:
                    space_all_list.append(value)
        else:
            space_all_list = [v for k, v in space_list.items()]
        return space_selected, space_all_list

    @mask_view(auth_require=True, template='core/home/home.html')
    def get(self, request, *args, **kwargs):
        return {}
        # resp = ServerAPI(user=request.user, url=ApiURL.my_profile).get()
        # if resp.state:
        #     company_current = resp.result.get('company_current', None)
        #     if True:
        #         resp.result['fullname'] = request.user.get_full_name()
        #         resp.result['is_admin_tenant'] = resp.result.get('is_admin_tenant', False)
        #
        #         space_selected, space_list = self.parse_spaces(kwargs.get('space_code', None), self.spaces)
        #         resp.result['space_selected'] = space_selected
        #         resp.result['space_list'] = space_list
        #         return render(request, template, resp.result)
        #
        #     return redirect(reverse('TenantCompany'))
        # return redirect(reverse('AuthLogout'))


class TenantCompany(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, )
    def get(self, request, template='core/company/company_list.html'):
        return render(request, template, {})
