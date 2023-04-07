from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, ConditionFormset


class QuotationCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_create.html',
        breadcrumb='',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
