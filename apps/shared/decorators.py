from functools import wraps

from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse

from rest_framework.response import Response

from .breadcrumb import BreadcrumbView
from .caches import CacheController, CacheKeyCollect

KEY_AUTH_REQUIRED = 'auth_require'
KEY_IS_API = 'is_api'
KEY_TEMPLATE = 'template'
KEY_BREADCRUMB = 'breadcrumb'


class ArgumentDecorator:
    def __init__(self, login_require, auth_require, **kwargs):
        self.login_require = login_require
        self.auth_require = auth_require
        self.is_api = kwargs.get('is_api', False)
        self.template_path = kwargs.get('template_path', None)
        self.breadcrumb_name = kwargs.get('breadcrumb_name', None)
        self.real_path = kwargs.get('real_path', None)

    def activate_auth_require(self, user) -> True or Response or redirect:
        if self.login_require:
            if not user or isinstance(user, AnonymousUser):
                if self.is_api:
                    return Response({'detail': 'Authentication is not credentials.'})
                if self.real_path:
                    return redirect(f"{reverse('AuthLogin')}?next={self.real_path}")
                return redirect(reverse('AuthLogin'))
        return True

    def parse_breadcrumb(self):
        data = []
        if self.breadcrumb_name:
            c_key = f'breadcrumb_{self.breadcrumb_name}'
            data = CacheController.get(c_key)
            if not data:
                data = BreadcrumbView.parsed(self.breadcrumb_name) if self.breadcrumb_name else []
                CacheController.set(c_key, data)
                CacheController().append_by_all(CacheKeyCollect.BREADCRUMB, c_key)
        return data

    @staticmethod
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

    @classmethod
    def parse_base(cls, user, cls_kwargs):
        c_key = f'space_{str(user.id)}_{".".join([f"{k}:{v}" for k, v in cls_kwargs.items()])}'
        data = CacheController.get(c_key)
        if not data:
            space_selected, space_list = cls.parse_spaces(cls_kwargs.get('space_code', None))
            data = {
                'fullname': user.get_full_name(),
                'email': user.email,
                'is_admin_tenant': user.is_admin_tenant,
                'space_selected': space_selected,
                'space_list': space_list
            }
            CacheController.set(c_key, data)
            CacheController().append_by_all(CacheKeyCollect.SPACES, c_key)
        return data


def mask_view(**parent_kwargs):
    # is_api: default False
    # auth_require: default False
    if not isinstance(parent_kwargs, dict):
        parent_kwargs = {}

    def decorated(func_view):
        def wrapper(self, request, *args, **kwargs):
            ctx = {}

            # check authenticated
            login_require = parent_kwargs.get('auth_require', False)
            auth_require = parent_kwargs.get('auth_require', False)
            is_api = parent_kwargs.get('is_api', False)
            template_path = parent_kwargs.get('template', None)
            breadcrumb_name = parent_kwargs.get('breadcrumb', None)
            cls_check = ArgumentDecorator(
                login_require=login_require,
                auth_require=auth_require,
                is_api=is_api,
                template_path=template_path,
                breadcrumb_name=breadcrumb_name,
                real_path=request.path,
            )

            state_auth = cls_check.activate_auth_require(request.user)
            if state_auth is not True:
                return state_auth

            # redirect or next step with is_auth
            view_return = func_view(self, request, *args, **kwargs)  # --> {'user_list': user_list}
            if isinstance(view_return, HttpResponse):
                return view_return
            elif cls_check.is_api:
                return Response({'data': view_return}, status=200)
            elif cls_check.template_path:
                if request.user and not isinstance(request.user, AnonymousUser):
                    ctx['base'] = cls_check.parse_base(request.user, cls_kwargs=kwargs)
                    ctx['data'] = view_return
                    ctx['breadcrumb'] = cls_check.parse_breadcrumb()
                    return render(request, cls_check.template_path, ctx)
                return redirect(reverse('AuthLogin'))
            raise ValueError(
                f'Return not map happy case. Over with: is_api={cls_check.is_api},template={cls_check.template_path}'
            )

        return wraps(func_view)(wrapper)

    return decorated
