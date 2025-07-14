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
    def get_link(cls, plan, app, pk=None, is_create=None) -> any:
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
                        if is_create:
                            if views_of_app.get('create', None):
                                return reverse(views_of_app['create'])
                            return None
                        return reverse(views_of_app['list'])
                    except NoReverseMatch as _err:
                        pass
        return None

    @classmethod
    def get_link_by_app_id(cls, app_id, pk=None):
        if app_id in APP_ID_MAP_PLAN_APP:
            return cls.get_link(plan=APP_ID_MAP_PLAN_APP[app_id]['plan'], app=APP_ID_MAP_PLAN_APP[app_id]['app'], pk=pk)
        return None

    def __init__(self, list_view_name, detail_view_name, create_view_name=None, key_pk=None):
        self.list_view_name = list_view_name
        self.detail_view_name = detail_view_name
        self.create_view_name = create_view_name
        self.key_pk = key_pk if key_pk else 'pk'

    @property
    def data(self):
        return {
            'list': self.list_view_name,
            'detail': self.detail_view_name,
            'create': self.create_view_name,
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
            create_view_name='OpportunityCallLogList',
        ).data,
        'opportunityemail': ReverseUrlCommon(
            list_view_name='OpportunityEmailList',
            detail_view_name=None,
            create_view_name='OpportunityEmailList',
        ).data,
        'meetingwithcustomer': ReverseUrlCommon(
            list_view_name='OpportunityMeetingList',
            detail_view_name=None,
            create_view_name='OpportunityMeetingList',
        ).data,
    },
    'task': {
        'opportunitytask': ReverseUrlCommon(
            list_view_name='OpportunityTaskList',
            detail_view_name=None,
            create_view_name='OpportunityTaskList',
        ).data,
    },
    'quotation': {
        'quotation': ReverseUrlCommon(
            list_view_name='QuotationList',
            detail_view_name='QuotationDetail',
            create_view_name='QuotationCreate',
        ).data,
    },
    'saleorder': {
        'saleorder': ReverseUrlCommon(
            list_view_name='SaleOrderList',
            detail_view_name='SaleOrderDetail',
            create_view_name='SaleOrderCreate',
        ).data,
    },
    'delivery': {
        'orderpickingsub': ReverseUrlCommon(
            list_view_name='OrderPickingList', detail_view_name='OrderPickingDetail',
        ).data,
        'orderdeliverysub': ReverseUrlCommon(
            list_view_name='OrderDeliveryList',
            detail_view_name='OrderDeliveryDetail',
            create_view_name='OrderDeliveryCreate',
        ).data,
    },
    'promotion': {
        'promotion': ReverseUrlCommon(list_view_name='PromotionList', detail_view_name='PromotionDetail').data,
    },
    'cashoutflow': {
        'advancepayment': ReverseUrlCommon(
            list_view_name='AdvancePaymentList',
            detail_view_name='AdvancePaymentDetail',
            create_view_name='AdvancePaymentCreate',
        ).data,
        'payment': ReverseUrlCommon(
            list_view_name='PaymentList',
            detail_view_name='PaymentDetail',
            create_view_name='PaymentCreate',
        ).data,
        'returnadvance': ReverseUrlCommon(
            list_view_name='ReturnAdvanceList',
            detail_view_name='ReturnAdvanceDetail',
            create_view_name='ReturnAdvanceCreate',
        ).data,
    },
    'contract': {
        'contractapproval': ReverseUrlCommon(
            list_view_name='ContractApprovalList',
            detail_view_name='ContractApprovalDetail',
            create_view_name='ContractApprovalCreate',
        ).data,
    },
    'distributionplan': {
        'distributionplan': ReverseUrlCommon(
            list_view_name='DistributionPlanList', detail_view_name='DistributionPlanDetail',
        ).data,
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
    'project': {
        'project': ReverseUrlCommon(
            list_view_name='ProjectList',
            detail_view_name='ProjectDetail',
            create_view_name='ProjectCreate',
        ).data,
        'projectbaseline': ReverseUrlCommon(
            list_view_name='ProjectList',
            detail_view_name='ProjectBaselineDetail'
        ).data,
        'activities': ReverseUrlCommon(
            list_view_name='ProjectActivities',
            detail_view_name='ProjectActivitiesCommentDetail'
        ).data,
    },
    'production': {
        'bom': ReverseUrlCommon(list_view_name='BOMList', detail_view_name='BOMDetail').data,
        'productionorder': ReverseUrlCommon(
            list_view_name='ProductionOrderList', detail_view_name='ProductionOrderDetail'
        ).data,
        'workorder': ReverseUrlCommon(
            list_view_name='WorkOrderList', detail_view_name='WorkOrderDetail'
        ).data,
    },
    'bidding': {
        'bidding': ReverseUrlCommon(
            list_view_name='BiddingList',
            detail_view_name='BiddingDetail',
            create_view_name='BiddingCreate').data,
    },
    'consulting': {
        'consulting': ReverseUrlCommon(
            list_view_name='ConsultingList',
            detail_view_name='ConsultingDetail',
            create_view_name='ConsultingCreate').data,
    },
    'productmodification': {
        'productmodification': ReverseUrlCommon(
            list_view_name='ProductModificationList',
            detail_view_name='ProductModificationDetail',
            create_view_name='ProductModificationCreate').data,
    },
    'equipmentloan': {
        'equipmentloan': ReverseUrlCommon(
            list_view_name='EquipmentLoanList',
            detail_view_name='EquipmentLoanDetail',
            create_view_name='EquipmentLoanCreate').data,
    },
    'equipmentreturn': {
        'equipmentreturn': ReverseUrlCommon(
            list_view_name='EquipmentReturnList',
            detail_view_name='EquipmentReturnDetail',
            create_view_name='EquipmentReturnCreate').data,
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

PLAN_APP_OF_HRM = {
    'employeeinfo': {
        'employeecontractruntime': ReverseUrlCommon(
            list_view_name='HRMEmployeeList', detail_view_name='HRMRuntimeSignatureDetail'
        ).data,
    },
}

PLAN_APP_OF_KMS = {
    'documentapproval': {
        'kmsdocumentapproval': ReverseUrlCommon(
            list_view_name='KMSDocumentApprovalList', detail_view_name='KMSDocumentApprovalDetail'
        ).data,
    },
    'incomingdocument': {
        'kmsincomingdocument': ReverseUrlCommon(
            list_view_name='IncomingDocumentList', detail_view_name='IncomingDocumentDetail'
        ).data,
    },
}

PLAN_APP_MAP_VIEW = {
    **PLAN_APP_OF_SALE,
    **PLAN_APP_OF_E_OFFICE,
    **PLAN_APP_OF_HRM,
    **PLAN_APP_OF_KMS,
}

APP_ID_MAP_PLAN_APP = {
    'e66cfb5a-b3ce-4694-a4da-47618f53de4c': {'plan': 'task', 'app': 'OpportunityTask'},
    'b9650500-aba7-44e3-b6e0-2542622702a3': {'plan': 'quotation', 'app': 'quotation'},
}
