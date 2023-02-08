from functools import wraps

from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from rest_framework import status

from rest_framework.response import Response

from .msg import AuthMsg, ServerMsg
from .breadcrumb import BreadcrumbView
from .caches import CacheController, CacheKeyCollect


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
            login_require = parent_kwargs.get('login_require', False)
            auth_require = parent_kwargs.get('auth_require', False)
            if auth_require:
                login_require = True
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

            if login_require:
                if not request.user or isinstance(request.user, AnonymousUser):
                    if is_api:
                        return Response({'detail': 'Authentication is not credentials.'})

                    path_redirect = reverse('AuthLogin')
                    if cls_check.real_path:
                        path_redirect += f"?next={cls_check.real_path}"
                    request.session.flush()
                    request.user = AnonymousUser
                    return redirect(path_redirect)

            # redirect or next step with is_auth
            # must be return ({Data|Dict}, {Http Status|Number}) or HttpResponse
            view_return = func_view(self, request, *args, **kwargs)  # --> {'user_list': user_list}
            if isinstance(view_return, HttpResponse):
                return view_return
            else:
                # parse data
                data, http_status = None, 200
                if isinstance(view_return, (list, tuple)) and len(view_return) == 2:
                    data, http_status = view_return
                else:
                    data = view_return
                data['status'] = http_status

                # handle return HTTP
                if cls_check.is_api:
                    match http_status:
                        case status.HTTP_401_UNAUTHORIZED:
                            return Response(
                                {'data': AuthMsg.AUTH_EXPIRE, 'status': status.HTTP_401_UNAUTHORIZED},
                                status=status.HTTP_401_UNAUTHORIZED
                            )
                        case status.HTTP_500_INTERNAL_SERVER_ERROR:
                            return Response(
                                {'data': ServerMsg.SERVER_ERR, 'status': status.HTTP_500_INTERNAL_SERVER_ERROR},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )
                        case status.HTTP_400_BAD_REQUEST:
                            return Response(
                                {'data': data, 'status': status.HTTP_400_BAD_REQUEST},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        case _:
                            return Response({'data': data, 'status': http_status}, status=http_status)
                elif cls_check.template_path:
                    if request.user and not isinstance(request.user, AnonymousUser):
                        match http_status:
                            case status.HTTP_401_UNAUTHORIZED:
                                request.session.flush()
                                request.user = AnonymousUser
                                return redirect(reverse('AuthLogin'))
                            case status.HTTP_500_INTERNAL_SERVER_ERROR:
                                return HttpResponse(status=500)
                            case _:
                                ctx['base'] = cls_check.parse_base(request.user, cls_kwargs=kwargs)
                                ctx['data'] = data
                                ctx['breadcrumb'] = cls_check.parse_breadcrumb()
                                ctx['nav'] = {
                                    'menu_id_current': parent_kwargs.get('menu_active', None),
                                    'space_code_current': 1,
                                }
                                return render(request, cls_check.template_path, ctx)
                    return redirect(reverse('AuthLogin'))
            raise ValueError(
                f'Return not map happy case. Over with: is_api={cls_check.is_api},template={cls_check.template_path}'
            )

        return wraps(func_view)(wrapper)

    return decorated
