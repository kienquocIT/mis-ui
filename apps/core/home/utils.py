__all__ = [
    'ReverseUrlCommon',
]

from django.urls import reverse, NoReverseMatch

from apps.shared import TypeCheck, ServerAPI, ApiURL


class ReverseUrlCommon:
    @classmethod
    def update_done_notify(cls, user, notify_id):
        if user and notify_id:
            try:
                url = ApiURL.LOG_MY_NOTIFY_DETAIL.fill_key(pk=notify_id)
                data = {'is_done': True}
                ServerAPI(user=user, url=url).put(data=data)
            except Exception as _err:
                pass
        return True

    @classmethod
    def get_link_by_name(cls, view_name):
        try:
            return reverse(view_name)
        except NoReverseMatch as _err:
            pass
        return None

    @classmethod
    def get_link(cls, plan, app, pk=None) -> any:
        if pk in [0, '0']:
            pk = None

        if pk is not None and not TypeCheck.check_uuid(pk):
            return None

        if plan and app:
            apps_of_plan = PLAN_APP_MAP_VIEW.get(plan, {})
            if apps_of_plan and isinstance(apps_of_plan, dict):
                views_of_app = apps_of_plan.get(app, {})
                if views_of_app and isinstance(views_of_app, dict):
                    try:
                        if pk:
                            return reverse(views_of_app['detail'], kwargs={views_of_app['key_pk']: pk})
                        return reverse(views_of_app['list'])
                    except NoReverseMatch as _err:
                        pass
        return None

    def __init__(self, list_view_name, detail_view_name, key_pk=None):
        self.list_view_name = list_view_name
        self.detail_view_name = detail_view_name
        self.key_pk = key_pk if key_pk else 'pk'

    @property
    def data(self):
        return {
            'list': self.list_view_name,
            'detail': self.detail_view_name,
            'key_pk': self.key_pk
        }


PLAN_APP_OF_SALE = {
    'saledata': {
        'contact': ReverseUrlCommon(list_view_name='ContactList', detail_view_name='ContactDetail').data,
        'account': ReverseUrlCommon(list_view_name='AccountList', detail_view_name='AccountDetail').data,
        'product': ReverseUrlCommon(list_view_name='ProductList', detail_view_name='ProductDetail').data,
        'expenses': ReverseUrlCommon(list_view_name='ExpenseList', detail_view_name='ExpenseDetail').data,
        'expenseitem': ReverseUrlCommon(list_view_name='ExpenseItemList', detail_view_name=None).data,
        'warehouse': ReverseUrlCommon(list_view_name='WareHouseList', detail_view_name='WareHouseDetail').data,
        'goodreceipt': ReverseUrlCommon(list_view_name='GoodReceiptList', detail_view_name='GoodReceiptDetail').data,
        'price': ReverseUrlCommon(list_view_name='PriceList', detail_view_name='PriceListDetail').data,
        'shipping': ReverseUrlCommon(list_view_name='ShippingList', detail_view_name='ShippingDetail').data,
        'paymentterm': ReverseUrlCommon(list_view_name=None, detail_view_name=None).data,
    },
    'opportunity': {
        'opportunity': ReverseUrlCommon(list_view_name='OpportunityList', detail_view_name='OpportunityDetail').data,
        'documentforcustomer': ReverseUrlCommon(
            list_view_name='OpportunityDocumentList', detail_view_name='OpportunityDocumentDetail',
        ).data,
        'opportunitycall': ReverseUrlCommon(
            list_view_name='OpportunityCallLogList', detail_view_name=None,
        ).data,
        'opportunityemail': ReverseUrlCommon(
            list_view_name='OpportunityEmailList', detail_view_name=None,
        ).data,
        'meetingwithcustomer': ReverseUrlCommon(
            list_view_name='OpportunityMeetingList', detail_view_name=None,
        ).data,
    },
    'task': {
        # Task.OpportunityTask not has page detail!
        # 'opportunitytask': ReverseUrlCommon(
        #     list_view_name='OpportunityTaskList', detail_view_name='OpportunityTaskDetailAPI'
        # ).data,
    },
    'quotation': {
        'quotation': ReverseUrlCommon(list_view_name='QuotationList', detail_view_name='QuotationDetail').data,
    },
    'saleorder': {
        'saleorder': ReverseUrlCommon(list_view_name='SaleOrderList', detail_view_name='SaleOrderDetail').data,
    },
    'delivery': {
        'orderpickingsub': ReverseUrlCommon(
            list_view_name='OrderDeliveryList', detail_view_name='OrderDeliveryDetail'
        ).data,
        'orderdeliverysub': ReverseUrlCommon(
            list_view_name='OrderPickingList', detail_view_name='OrderPickingDetail',
        ).data,
    },
    'promotion': {
        'promotion': ReverseUrlCommon(list_view_name='PromotionList', detail_view_name='PromotionDetail').data,
    },
    'cashoutflow': {
        'advancepayment': ReverseUrlCommon(
            list_view_name='AdvancePaymentList', detail_view_name='AdvancePaymentDetail'
        ).data,
        'payment': ReverseUrlCommon(
            list_view_name='PaymentList', detail_view_name='PaymentDetail',
        ).data,
        'returnadvance': ReverseUrlCommon(
            list_view_name='ReturnAdvanceList', detail_view_name='ReturnAdvanceDetail',
        ).data,
    },
    'contract': {
        'contract': ReverseUrlCommon(list_view_name=None, detail_view_name=None).data,
    },
    'purchasing': {
        'purchasequotationrequest': ReverseUrlCommon(
            list_view_name='PurchaseQuotationRequestList', detail_view_name='PurchaseQuotationRequestDetail',
        ).data,
        'purchasequotation': ReverseUrlCommon(
            list_view_name='PurchaseQuotationList', detail_view_name='PurchaseQuotationDetail',
        ).data,
        'purchaseorder': ReverseUrlCommon(
            list_view_name='PurchaseOrderList', detail_view_name='PurchaseOrderDetail',
        ).data,
        'purchaserequest': ReverseUrlCommon(
            list_view_name='PurchaseRequestList', detail_view_name='PurchaseRequestDetail',
        ).data,
    },
}

PLAN_APP_OF_E_OFFICE = {
    'leave': {
        'leaverequest': ReverseUrlCommon(
            list_view_name='LeaveRequestList', detail_view_name='LeaveRequestDetail'
        ).data,
    },
    'businesstrip': {
        'businessrequest': ReverseUrlCommon(
            list_view_name='BusinessTripRequestList', detail_view_name='BusinessTripRequestDetail'
        ).data,
    },
    'assettools': {
        'assettoolsprovide': ReverseUrlCommon(
            list_view_name='AssetToolsProvideRequestList', detail_view_name='AssetToolsProvideRequestDetail'
        ).data,
        'assettoolsdelivery': ReverseUrlCommon(
            list_view_name='AssetToolsDeliveryList', detail_view_name='AssetToolsProvideRequestDetail'
        ).data,
        'assettoolsreturn': ReverseUrlCommon(
            list_view_name='AssetToolsReturnList', detail_view_name='AssetToolsReturnDetail'
        ).data,
    }
}

PLAN_APP_MAP_VIEW = {
    **PLAN_APP_OF_SALE,
    **PLAN_APP_OF_E_OFFICE,
}
