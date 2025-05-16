from django.views import View
from rest_framework import status
from apps.shared import mask_view, ServerAPI, ApiURL


# PAYMENT PLAN
class PaymentPlanList(View):

    @mask_view(
        auth_require=True,
        template='sales/paymentplan/payment_plan.html',
        menu_active='menu_payment_plan_list',
        breadcrumb='PAYMENT_PLAN_LIST_PAGE',
        icon_cls='fas fa-money-check-alt',
        icon_bg='bg-purple',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
