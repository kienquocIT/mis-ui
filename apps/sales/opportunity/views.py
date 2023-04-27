from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, WorkflowMsg, ConditionFormset, SaleMsg


def create_update_opportunity(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    elif resp.status == 401:
        return {}, status.HTTP_401_UNAUTHORIZED
    return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class OpportunityList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/opportunity/opportunity_list.html',
        menu_active='menu_opportunity_list',
        breadcrumb='OPPORTUNITY_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        if resp.state:
            return {'opportunity_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_opportunity(
            request=request,
            url=ApiURL.OPPORTUNITY_LIST,
            msg=SaleMsg.OPPORTUNITY_CREATE
        )
