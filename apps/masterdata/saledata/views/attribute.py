from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, BaseView
from apps.shared.constant import SYSTEM_STATUS


class AttributeList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/attribute/attribute_list.html',
        menu_active='id_menu_master_data_attribute',
        breadcrumb='ATTRIBUTE_LIST_PAGE',
        icon_cls='fa-solid fa-cubes',
        icon_bg='bg-indigo',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class AttributeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return BaseView.run_list(
            request=request,
            url=ApiURL.ATTRIBUTE_LIST,
            key_success='attribute_list'
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.ATTRIBUTE_LIST,
        )


class AttributeDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.ATTRIBUTE_DETAIL,
            pk=pk,
        )


class ProductAttributeListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_ATTRIBUTE_LIST.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_attribute_list')
