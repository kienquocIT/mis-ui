from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class InitialBalanceList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='accountingsettings/initial_balance/create.html',
        menu_active='menu_initial_balance',
        breadcrumb='INITIAL_BALANCE_LIST_PAGE',
        icon_cls='fas fa-chart-bar',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PERIODS_CONFIG_LIST).get()
        for item in resp.result:
            if item['software_start_using_time']:
                return {
                    'data': {
                        'period_setup_sw_start_using_time': item['id'],
                    },
                }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class InitialBalanceListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INITIAL_BALANCE_LIST).get(params)
        return resp.auto_return(key_success='initial_balance_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INITIAL_BALANCE_LIST).post(request.data)
        if resp.state:
            # resp.result['message'] = HRMMsg.ABSENCE_EXPLANATION_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()
