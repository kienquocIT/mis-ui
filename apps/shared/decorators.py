"""needed module import"""
import datetime

from functools import wraps

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.apps import apps

from rest_framework import status
from rest_framework.response import Response

from .apis import RespData, PermCheck
from .exceptions import handle_exception_all_view
from .msg import AuthMsg, ServerMsg
from .breadcrumb import BreadcrumbView
from .menus import SpaceItem, SpaceGroup
from .caches import CacheController, CacheKeyCollect
from .constant import WORKFLOW_ACTION
from .utils import RandomGenerate

__all__ = [
    'mask_view',
    'OutLayoutRender',
]

HEADERS_KEY_CACHED_ENABLE = 'HTTP_ENABLEXCACHECONTROL'


class ArgumentDecorator:
    """argument decorator"""

    @classmethod
    def get_headers_cached_enable(cls, request):
        if (
                request.method == 'GET' and
                hasattr(request, 'META') and
                isinstance(request.META, dict) and
                request.META.get(HEADERS_KEY_CACHED_ENABLE, None) == 'true'
        ):
            expires_string = (
                    datetime.datetime.now() + datetime.timedelta(minutes=1)
            ).strftime('%a, %d %b %Y %H:%M:%S GMT')
            return {
                'Cache-Control': 'public, max-age=60',  # 1 minutes
                'Expires': expires_string,
                'ETag': RandomGenerate.get_string(length=32),
            }
        return {}

    def __init__(self, login_require, auth_require, **kwargs):
        self.login_require = login_require
        self.auth_require = auth_require
        self.is_api = kwargs.get('is_api', False)
        self.template_path = kwargs.get('template_path', None)
        self.breadcrumb_name = kwargs.get('breadcrumb_name', None)
        self.real_path = kwargs.get('real_path', None)

    def activate_auth_require(self, user) -> True or Response or redirect:
        """active authentication request"""
        if self.login_require:
            if not user or isinstance(user, AnonymousUser):
                if self.is_api:
                    return Response({'detail': 'Authentication is not credentials.'})
                if self.real_path:
                    return redirect(f"{reverse('AuthLogin')}?next={self.real_path}")
                return redirect(reverse('AuthLogin'))
        return True

    def parse_breadcrumb(self):
        """parse menu breadcrumbs"""
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
    def parse_spaces(space_code: str) -> (list, list):
        """default parse space list"""
        return SpaceGroup.get_space_all(), SpaceItem.get_space_detail(space_code), SpaceItem.get_menus_of_space(
            space_code
        )

    @classmethod
    def parse_base(cls, user) -> dict:
        """parse base link"""
        if isinstance(user, get_user_model()):
            space_list, space_current_detail, space_menus = cls.parse_spaces(user.ui_space_selected)
            return {
                'id': str(user.id),
                'user_id': str(user.user_id),
                'first_name': str(user.first_name),
                'last_name': str(user.last_name),
                'fullname': user.get_full_name(),
                'username_auth': user.username_auth,
                'email': user.email,
                'is_admin_tenant': user.is_admin_tenant,
                'tenant_current_data': user.tenant_current_data,
                'company_current_data': user.company_current_data,
                'space_current_data': user.space_current_data,
                'employee_current_data': user.employee_current_data,
                'companies_data': user.companies_data,
                'language': user.language,
                # data display menus and space
                'space_list': space_list,
                'space_current_detail': space_current_detail,
                'menus': space_menus,
                'avatar': user.avatar_url,
                'domain_cloud': f'{settings.MEDIA_PUBLIC_DOMAIN}',
                'avatar_prefix': 'p/f/avatar/',
            }
        return {}

    @classmethod
    def parse_url_pattern(cls, url_pattern_keys: list[str], cls_kwargs: dict[str, str]) -> dict[str, str]:
        result = {}
        if isinstance(url_pattern_keys, list) and isinstance(cls_kwargs, dict):
            for key in url_pattern_keys:
                result[key] = cls_kwargs[key] if key in cls_kwargs else None

            if 'pk' in cls_kwargs:
                result['pk'] = cls_kwargs['pk']
        return result


class OutLayoutRender:
    def __init__(self, request):
        self.request = request

    def render_404(self):
        return render(self.request, 'extends/systems/out-layout/404.html', {})

    def render_503(self):
        return render(self.request, 'extends/systems/out-layout/503.html', {})


def mask_view(**parent_kwargs):
    """mask func before api method call form client to UI"""
    # is_api: default False
    # auth_require: default False
    if not isinstance(parent_kwargs, dict):
        parent_kwargs = {}

    def decorated(func_view):

        # pylint: disable=R0911
        def wrapper(self, request, *args, **kwargs):
            if settings.IS_SERVER_MAINTAINING is True:
                return OutLayoutRender(request=request).render_503()

            if settings.UI_ALLOW_AUTO_TENANT:
                url_skip_check = ['/404', '/503', '/introduce', '/terms', '/help-and-support']
                if request.path not in url_skip_check:
                    meta_hosts = request.META['HTTP_HOST']
                    if meta_hosts and settings.UI_DOMAIN in meta_hosts:
                        sub_code = meta_hosts.split(settings.UI_DOMAIN)[0]
                        if sub_code.endswith("."):
                            sub_code = sub_code[:-1]

                        if "*" not in settings.UI_SUB_ALLOWED and sub_code not in settings.UI_SUB_ALLOWED:
                            return OutLayoutRender(request=request).render_404()

                        if sub_code in settings.UI_SUB_DENIED:
                            return OutLayoutRender(request=request).render_404()
                    else:
                        return OutLayoutRender(request=request).render_404()

            ctx = {}
            pk = kwargs.get('pk', None)

            # check authenticated
            login_require = parent_kwargs.get('login_require', False)
            auth_require = parent_kwargs.get('auth_require', False)
            if auth_require:
                login_require = True
            # is_notify_key = parent_kwargs.get('is_notify_key', settings.DEBUG_NOTIFY_KEY)  # default: True
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
            url_pattern_keys = parent_kwargs.get('url_pattern_keys', [])

            # check login with request.user | auto redirect login page when expired
            if login_require:
                if not request.user or isinstance(request.user, AnonymousUser):
                    if is_api:
                        return Response(
                            {'data': AuthMsg.AUTH_EXPIRE, 'status': status.HTTP_401_UNAUTHORIZED},
                            status=status.HTTP_200_OK
                        )

                    path_redirect = reverse('AuthLogin')
                    if cls_check.real_path:
                        path_redirect += f"?next={cls_check.real_path}"
                    request.session.flush()
                    request.user = AnonymousUser
                    return redirect(path_redirect)

            # fake call check permission to post, put, delete
            # fake call to URL then handle resp
            # call don't change or new data, API will return resp after check perm
            check_perm_state, check_perm_return = True, (None, 200)
            perm_check_cls: PermCheck = parent_kwargs.get('perm_check', None)
            if perm_check_cls and is_api is False:
                check_perm_state, check_perm_return = perm_check_cls.valid(
                    request=request,
                    view_kwargs=kwargs,
                )
                if check_perm_state is False:
                    if isinstance(check_perm_return, Response):
                        return check_perm_return
                    elif not (
                            check_perm_return and isinstance(check_perm_return, tuple) and len(check_perm_return) == 2
                    ):
                        check_perm_return = RespData.resp_403()

            # redirect or next step with is_auth
            # must be return ({Data|Dict}, {Http Status|Number}) or HttpResponse
            try:
                if check_perm_state:
                    view_return = func_view(self, request, *args, **kwargs)  # --> {'user_list': user_list}
                else:
                    view_return = check_perm_return
            except Exception as err:
                print(self, err)
                handle_exception_all_view(err, self)
                raise err

            if isinstance(view_return, HttpResponse):  # pylint: disable=R1705
                return view_return
            else:
                data, http_status = None, 200
                # parse data
                if isinstance(view_return, (list, tuple)) and len(view_return) == 2:
                    data, http_status = view_return
                else:
                    data = view_return
                data['status'] = http_status

                # [], 200 <--- accept
                # {'results': [], 'status_tmp': 201} <--- accept
                # [] <--- error

                # handle return HTTP
                if cls_check.is_api:
                    match http_status:
                        case status.HTTP_401_UNAUTHORIZED:
                            return Response(
                                {
                                    'data': AuthMsg.AUTH_EXPIRE,
                                    'status': status.HTTP_401_UNAUTHORIZED
                                },
                                status=status.HTTP_401_UNAUTHORIZED
                            )
                        case status.HTTP_500_INTERNAL_SERVER_ERROR:
                            return Response(
                                {
                                    'data': ServerMsg.SERVER_ERR,
                                    'status': status.HTTP_500_INTERNAL_SERVER_ERROR
                                },
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )
                        case status.HTTP_400_BAD_REQUEST:
                            return Response(
                                {
                                    'data': data,
                                    'status': status.HTTP_400_BAD_REQUEST
                                },
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        case _:
                            return Response(
                                {
                                    'data': data,
                                    'status': http_status
                                },
                                headers=cls_check.get_headers_cached_enable(request=request),
                                status=http_status
                            )
                elif cls_check.template_path:
                    if request.user and not isinstance(request.user, AnonymousUser) and request.user.is_authenticated:
                        match http_status:
                            case status.HTTP_401_UNAUTHORIZED:
                                request.session.flush()
                                request.user = AnonymousUser
                                return redirect(reverse('AuthLogin'))
                            case status.HTTP_500_INTERNAL_SERVER_ERROR:
                                return HttpResponse(status=500)
                            case _:
                                ctx['pk'] = pk
                                ctx['is_ga_enabled'] = settings.GA_COLLECTION_ENABLED
                                ctx['is_debug'] = settings.DEBUG_JS
                                # ctx['is_notify_key'] = 1 if is_notify_key is True else 0
                                ctx['base'] = cls_check.parse_base(request.user)
                                ctx['base_workflow'] = WORKFLOW_ACTION if pk else {}
                                ctx['domain'] = {'media': settings.MEDIA_DOMAIN}
                                ctx['data'] = data
                                ctx['breadcrumb'] = cls_check.parse_breadcrumb()
                                ctx['url_pattern'] = cls_check.parse_url_pattern(url_pattern_keys, kwargs)
                                ctx['nav'] = {
                                    'menu_id_current': parent_kwargs.get('menu_active', None),
                                    'space_code_current': 1,
                                }
                                return render(request, cls_check.template_path, ctx)
                    if login_require is True:
                        return redirect(reverse('AuthLogin'))
                    return render(request, cls_check.template_path, ctx)
            raise ValueError(
                f'Return not map happy case. Over with: is_api={cls_check.is_api},'
                f'template={cls_check.template_path}'
            )

        return wraps(func_view)(wrapper)

    return decorated
