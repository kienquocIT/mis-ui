from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class CurrencyImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_CURRENCY, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='currency')


class AccountGroupImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_ACCOUNT_GROUP, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='account_group')


class AccountTypeImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_ACCOUNT_TYPE, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='account_type')


class IndustryImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_INDUSTRY, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='industry')


class PaymentTermImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_PAYMENT_TERM, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='payment_term')


class SalutationImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_SALUTATION, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='salutation')


class SaleDataContactImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_CONTACT, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='contact')


class SaleDataAccountImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_ACCOUNT, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='account')


class ProductUOMGroupImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_PRODUCT_UOMGROUP, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='product_uom_group')

class ProductProductTypeImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_PRODUCT_PRODUCT_TYPE, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='product_product_type')

class ProductProductCategoryImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_PRODUCT_PRODUCT_CATEGORY, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='product_product_category')

class PriceTaxCategoryImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_SALEDATA_PRICE_TAX_CATEGORY, user=request.user).post(
            data=request.data
        )
        return resp.auto_return(key_success='price_tax_category')
