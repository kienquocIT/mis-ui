import os
import shutil
from PIL import Image
import numpy as np
from django.conf import settings
from django.views import View
from rembg import remove
from requests_toolbelt import MultipartEncoder
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, PermCheck
from apps.shared.msg import MDMsg


class ProductMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/saledata_product_list.html',
        breadcrumb='PRODUCT_MASTER_DATA_LIST_PAGE',
        menu_active='id_menu_master_data_product',
        icon_cls='fas bi bi-diagram-2-fill',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductTypeListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_LIST).get(params)
        return resp.auto_return(key_success='product_type_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_LIST).post(request.data)
        return resp.auto_return()


class ProductTypeDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_type')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='product_type')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PRODUCT_TYPE_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return(key_success='product_type')


class ProductCategoryListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_LIST).get(params)
        return resp.auto_return(key_success='product_category_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_LIST).post(request.data)
        return resp.auto_return()


class ProductCategoryDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_category')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='product_category')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PRODUCT_CATEGORY_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return(key_success='product_category')


class ManufacturerListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.MANUFACTURER_LIST).get(params)
        return resp.auto_return(key_success='manufacturer_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MANUFACTURER_LIST).post(request.data)
        return resp.auto_return()


class ManufacturerDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MANUFACTURER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='manufacturer')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MANUFACTURER_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='manufacturer')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PRODUCT_CATEGORY_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return(key_success='manufacturer')


class BaseUnitListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ITEM_UNIT_LIST).get(params)
        return resp.auto_return(key_success='base_unit_list')


class UnitOfMeasureListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).get(params)
        return resp.auto_return(key_success='unit_of_measure')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).post(request.data)
        return resp.auto_return()


class UnitOfMeasureDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='unit_of_measure')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='unit_of_measure')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.UNIT_OF_MEASURE_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return(key_success='unit_of_measure')


class UnitOfMeasureGroupListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP).get(params)
        return resp.auto_return(key_success='unit_of_measure_group')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP).post(request.data)
        return resp.auto_return()


class UnitOfMeasureGroupDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='uom_group')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='uom_group')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP_DETAIL.fill_key(pk=pk)).delete(request.data)
        return resp.auto_return(key_success='uom_group')


class ProductList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_list.html',
        breadcrumb='PRODUCT_LIST_PAGE',
        menu_active='id_menu_product_list',
        icon_cls='fas bi bi-diagram-2-fill',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_create.html',
        breadcrumb='PRODUCT_CREATE_PAGE',
        menu_active='menu_product_list',
        perm_check=PermCheck(url=ApiURL.PRODUCT_LIST, method='post'),
        icon_cls='fas bi bi-diagram-2-fill',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductQuickCreateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_QUICK_CREATE).post(request.data)
        if resp.state:
            resp.result['message'] = MDMsg.PRODUCT_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class ProductListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        if 'asset_tools_filter' in params:
            prod_type = params.pop('asset_tools_filter', None)
            params['general_product_types_mapped__id'] = prod_type
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).get(params)
        return resp.auto_return(key_success='product_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).post(request.data)
        return resp.auto_return()


class ProductDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_detail.html',
        breadcrumb='PRODUCT_DETAIL_PAGE',
        menu_active='menu_product_detail',
        icon_cls='fas bi bi-diagram-2-fill',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        result = {}
        return result, status.HTTP_200_OK


class ProductUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_update.html',
        breadcrumb='PRODUCT_UPDATE_PAGE',
        menu_active='menu_product_update',
        icon_cls='fas bi bi-diagram-2-fill',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        result = {}
        return result, status.HTTP_200_OK


class ProductDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


# Products use for sale/ purchase/ inventory applications
class ProductForSaleListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_SALE_LIST).get(data)
        return resp.auto_return(key_success='product_sale_list')


class ProductForSaleDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_SALE_DETAIL.push_id(pk)).get()
        return resp.auto_return()


class UnitOfMeasureOfGroupLaborListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.UOM_OF_GROUP_LABOR_LIST).get(params)
        return resp.auto_return(key_success='uom_of_group_labor')


class ProductQuotationListLoadDBAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_QUOTATION_LOAD_DB).post(data)
        return resp.auto_return()


class ProductUploadAvatarAPI(APIView):
    parser_classes = [MultiPartParser]

    @staticmethod
    def clear_dir(dir_path):
        for item in os.listdir(dir_path):
            item_path = os.path.join(dir_path, item)
            if os.path.isfile(item_path) or os.path.islink(item_path):
                os.remove(item_path)
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)
        return

    @staticmethod
    def rembg(temp_dir, temp_file_name):
        input_path = os.path.join(temp_dir, temp_file_name)
        output_path = os.path.join(temp_dir, f"rembg_{temp_file_name}")
        with Image.open(input_path).convert("RGBA") as img:
            output = remove(img)
            background = Image.new("RGB", output.size, (255, 255, 255))
            background.paste(output, mask=output.split()[3])
            background.save(output_path, format="PNG")
        return output_path

    @staticmethod
    def for_rembg(uploaded_file, temp_dir, temp_file_name):
        os.makedirs(temp_dir, exist_ok=True)
        temp_file_path = os.path.join(temp_dir, temp_file_name)
        with open(temp_file_path, 'wb+') as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)
        rembg_path = ProductUploadAvatarAPI.rembg(temp_dir, temp_file_name)
        return rembg_path

    @mask_view(auth_require=True, login_require=True, is_api=True)
    def post(self, request, *args, pk, **kwargs):
        url = ApiURL.PRODUCT_UPLOAD_AVATAR.fill_key(pk=pk)
        uploaded_file = request.FILES.get('file')
        params = request.query_params.dict()
        if 'auto_rm_bg' in params and params.get('auto_rm_bg') == 'true':
            temp_dir = os.path.join(settings.BASE_DIR, 'apps/masterdata/saledata/static/assets/temp_img_rm_bg/')
            temp_file_name = f"{str(pk)}-{uploaded_file.name}"
            rembg_path = self.for_rembg(uploaded_file, temp_dir, temp_file_name)
            m = MultipartEncoder(fields={'avatar_img': (temp_file_name, open(rembg_path, "rb"), uploaded_file.content_type)})
        else:
            m = MultipartEncoder(fields={'avatar_img': (uploaded_file.name, uploaded_file, uploaded_file.content_type)})
        headers = {'content-type': m.content_type}
        resp = ServerAPI(request=request, user=request.user, url=url, cus_headers=headers).post(data=m)
        self.clear_dir(temp_dir)
        if resp.state:
            return {'detail': resp.result}, status.HTTP_200_OK
        return resp.auto_return()


class ProductSpecificIdentificationSerialNumberListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_SI_SERIAL_NUMBER_LIST).get(params)
        return resp.auto_return(key_success='product_si_serial_number_list')
