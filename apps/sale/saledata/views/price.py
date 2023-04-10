import requests
import xmltodict
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class PriceMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sale/saledata/masterdata/saledata_price.html',
        breadcrumb='CONTACT_LIST_PAGE',
        menu_active='menu_contact_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TaxCategoryListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_LIST).get()
        if resp.state:
            return {'tax_category_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        response = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class TaxListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        if resp.state:
            return {'tax_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        response = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class TaxDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_DETAIL + pk).get()
        if resp.state:
            return {'tax': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_DETAIL + pk).put(request.data)  # noqa
        if resp.state:
            return {'tax': resp.result}, status.HTTP_200_OK
        if resp.errors:
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class TaxCategoryDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_DETAIL + pk).get()
        if resp.state:
            return {'tax_category': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.TAX_CATEGORY_DETAIL + pk).put(request.data)  # noqa
        if resp.state:
            return {'tax': resp.result}, status.HTTP_200_OK
        if resp.errors:
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class CurrencyListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).get()
        if resp.state:
            return {'currency_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        response = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class CurrencyDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_DETAIL + pk).get()
        if resp.state:
            return {'currency': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_DETAIL + pk).put(request.data)  # noqa
        if resp.state:
            return {'tax': resp.result}, status.HTTP_200_OK
        if resp.errors:
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class SyncSellingRateWithVCB(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        all_currencies = None
        resp = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).get()
        if resp.state:
            all_currencies = resp.result

        if all_currencies:
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
                    resp = ServerAPI(user=request.user, url=ApiURL.SYNC_SELLING_RATE + abbreviation_currency_id[0]).put(
                        {'rate': sell}
                    )
                    if resp.state:
                        continue
                    if resp.errors: # noqa
                        if isinstance(resp.errors, dict):
                            err_msg = ""
                            for key, value in resp.errors.items():
                                err_msg += str(key) + ': ' + str(value)
                                break
                            return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
                        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
                    return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
            return {}, status.HTTP_200_OK
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class PriceList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sale/saledata/price/price_list.html',
        breadcrumb='PRICE_LIST_PAGE',
        menu_active='menu_contact_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PriceListDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sale/saledata/price/price_list_detail.html',
        breadcrumb='PRICE_LIST_DETAIL_PAGE',
        menu_active='menu_contact_list',
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PriceListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_LIST).get()
        if resp.state:
            return {'price_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        response = ServerAPI(user=request.user, url=ApiURL.PRICE_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class PriceDetailAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_DETAIL + pk).get() # noqa
        if resp.state:
            return {'price': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_DETAIL + pk).put(request.data)  # noqa
        if resp.state:
            return {'price': resp.result}, status.HTTP_200_OK
        if resp.errors: # noqa
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
