from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI

from .urls_map import ApiPublicURL


class PublicProductListAPI(APIView):
    @mask_view(auth_require=False, login_require=False)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiPublicURL.PUBLIC_PRODUCT_LIST).get(data=request.data)
        return resp.auto_return(key_success='product_list')


class PublicProductDetailAPI(APIView):
    @mask_view(auth_require=False, login_require=False)
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(url=ApiPublicURL.PUBLIC_PRODUCT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_detail')
