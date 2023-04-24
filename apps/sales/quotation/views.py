from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, ConditionFormset, SaleMsg


def create_update_quotation(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    elif resp.status == 401:
        return {}, status.HTTP_401_UNAUTHORIZED
    return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class QuotationList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_list.html',
        menu_active='',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class QuotationCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_create.html',
        breadcrumb='',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class QuotationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url='').get()
        if resp.state:
            return {'quotation_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_quotation(
            request=request,
            url='',
            msg=SaleMsg.QUOTATION_CREATE
        )
