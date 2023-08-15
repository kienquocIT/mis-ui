import requests
import xmltodict
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, MDConfigMsg, PermCheck

PAYMENTS_TERMS_UNIT = [
    {'value': 0, 'text': MDConfigMsg.PT_UNIT_PERCENT},
    {'value': 1, 'text': MDConfigMsg.PT_UNIT_AMOUNT},
    {'value': 2, 'text': MDConfigMsg.PT_UNIT_BALANCE},
]
PAYMENTS_TERMS_DAY_TYPE = [
    {'value': 1, 'text': MDConfigMsg.PT_DAY_TYPE_WK_DAY},
    {'value': 2, 'text': MDConfigMsg.PT_DAY_TYPE_CA_DAY},
]
PAYMENTS_TERMS_AFTER = [
    {'value': 1, 'text': MDConfigMsg.PT_AFTER_CONTRACT},
    {'value': 2, 'text': MDConfigMsg.PT_AFTER_DELIVERY},
    {'value': 3, 'text': MDConfigMsg.PT_AFTER_INVOICE},
    {'value': 4, 'text': MDConfigMsg.PT_AFTER_ACCEPTANCE},
    {'value': 5, 'text': MDConfigMsg.PT_AFTER_EOI_MONTH},
    {'value': 6, 'text': MDConfigMsg.PT_AFTER_ORDER_DATE},
]


class PriceMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/saledata_price.html',
        breadcrumb='MASTER_DATA_PRICE_PAGE',
        menu_active='id_menu_master_data_price',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'pay_terms_unit': PAYMENTS_TERMS_UNIT,
                   'pay_teams_type': PAYMENTS_TERMS_DAY_TYPE,
                   'pay_teams_after': PAYMENTS_TERMS_AFTER
               }, status.HTTP_200_OK


class TaxCategoryListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_LIST).get()
        return resp.auto_return(key_success='tax_category_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_LIST).post(request.data)
        return resp.auto_return()


class TaxListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        return resp.auto_return(key_success='tax_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).post(request.data)
        return resp.auto_return()


class TaxDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='tax')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='tax')


class TaxCategoryDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='tax_category')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='tax')


class CurrencyListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).get(params)
        return resp.auto_return(key_success='currency_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).post(request.data)
        return resp.auto_return()


class CurrencyDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='currency')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='tax')


class SyncSellingRateWithVCB(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).get()
        if resp.state:
            all_currencies = resp.result
            primary = filter(lambda x: x['is_primary'], all_currencies)
            primary_abbreviation = list(map(lambda x: x['abbreviation'], primary))

            response = requests.get('https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=1')
            data_dict = xmltodict.parse(response.content)
            data_dict['ExrateList']['Exrate'].append(
                {
                    '@CurrencyCode': 'VND',
                    '@CurrencyName': 'VIETNAM DONG   ',
                    '@Buy': '1.0',
                    '@Transfer': '1.0',
                    '@Sell': '1.0'
                }
            )

            primary_selling_rate = None
            if primary_abbreviation[0] != 'VND':
                filtered_primary = filter(
                    lambda x: x['@CurrencyCode'] == primary_abbreviation[0], data_dict['ExrateList']['Exrate']
                )
                primary_selling_rate = next(filtered_primary)['@Sell'].replace(',', '')

            for i in range(len(data_dict['ExrateList']['Exrate'])):
                item = data_dict['ExrateList']['Exrate'][i]
                abbreviation = item['@CurrencyCode']
                sell = item['@Sell'].replace(',', '')

                if primary_selling_rate and float(primary_selling_rate) > 0:
                    sell = float(sell) / float(primary_selling_rate)

                abbreviation_list = filter(lambda x: x['abbreviation'] == abbreviation, all_currencies)
                abbreviation_currency_id = list(map(lambda x: x['id'], abbreviation_list))

                if len(abbreviation_currency_id) > 0 and sell != '-':
                    resp = ServerAPI(user=request.user, url=ApiURL.SYNC_SELLING_RATE.fill_key(
                        pk=abbreviation_currency_id[0])
                    ).put(
                        {'rate': sell}
                    )
                    if not resp.state:
                        return resp.auto_return()
            return {}, status.HTTP_200_OK
        return resp.auto_return()


class PriceList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/price/price_list.html',
        breadcrumb='PRICE_LIST_PAGE',
        menu_active='id_menu_pricing_list',
        perm_check=PermCheck(url=ApiURL.PRICE_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PriceListDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/price/price_list_detail.html',
        breadcrumb='PRICE_LIST_DETAIL_PAGE',
        menu_active='menu_contact_list',
        perm_check=PermCheck(url=ApiURL.PRICE_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).get()
        if resp.state:
            return {'currency_list': resp.result}, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class PriceListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_LIST).get()
        return resp.auto_return(key_success='price_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_LIST).post(request.data)
        return resp.auto_return()


class PriceDetailAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='price')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='price')


class PriceDeleteAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_DELETE.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='price')


class UpdateProductForPriceListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTS_FOR_PRICE_LIST.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='price')


class PriceListDeleteProductAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_LIST_DELETE_PRODUCT.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='price')


class ProductAddFromPriceListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data  # noqa
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_ADD_FROM_PRICE_LIST.fill_key(pk=pk)).put(data)
        return resp.auto_return()


class DeleteCurrencyFromPriceListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELETE_CURRENCY_FROM_PRICE_LIST.fill_key(pk=pk)).put(
            request.data
        )
        return resp.auto_return()

