from functools import wraps

from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from rest_framework.response import Response


def parse_spaces(space_code: str) -> (dict, list):
    space_list = {
        'sale': {'name': 'Sale', 'code': 'sale', 'icon': '<i class="fas fa-user-astronaut"></i>'},
        'e-office': {'name': 'E-Office', 'code': 'e-office', 'icon': '<i class="fas fa-rocket"></i>'},
        'hrm': {'name': 'HRM', 'code': 'hrm', 'icon': '<i class="fas fa-satellite"></i>'},
    }

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


def mask_view(**parent_kwargs):
    # is_api: default False
    # auth_require: default False
    if not isinstance(parent_kwargs, dict):
        parent_kwargs = {}

    def decorated(func_view):
        def wrapper(self, request, *args, **kwargs):
            ctx = {}

            # check authenticated
            auth_require = parent_kwargs.get('auth_require', False)
            is_api = parent_kwargs.get('is_api', False)
            template_path = parent_kwargs.get('template', None)
            if auth_require:
                if not request.user or isinstance(request.user, AnonymousUser):
                    if is_api:
                        return Response({'detail': 'Authentication is not credentials.'})
                    return redirect(reverse('AuthLogin'))

            # redirect or next step with is_auth
            view_return = func_view(self, request, *args, **kwargs) # --> {'user_list': user_list}
            if isinstance(view_return, HttpResponse):
                return view_return
            elif is_api:
                return Response({'data': view_return}, status=200)
            elif template_path:
                if request.user and not isinstance(request.user, AnonymousUser):
                    ctx['base'] = {}
                    ctx['base']['fullname'] = request.user.get_full_name()
                    ctx['base']['email'] = request.user.email
                    ctx['base']['is_admin_tenant'] = request.user.is_admin_tenant

                    space_selected, space_list = parse_spaces(kwargs.get('space_code', None))
                    ctx['base']['space_selected'] = space_selected
                    ctx['base']['space_list'] = space_list

                    ctx['data'] = view_return
                    return render(request, template_path, ctx)
                return redirect(reverse('AuthLogin'))
            raise ValueError(f'Return not map happy case. Over with: is_api={is_api},template={template_path}')

        return wraps(func_view)(wrapper)

    return decorated
