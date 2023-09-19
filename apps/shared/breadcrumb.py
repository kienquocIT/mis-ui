"""system module"""
from django.urls import reverse, NoReverseMatch
from django.utils.translation import gettext_lazy as _


class BreadcrumbChildren:  # pylint: disable=too-few-public-methods
    """prepare url breadcrumbs"""

    def __init__(self, title, url=None, arg_pattern=None, kw_pattern=None, is_append_code=False):
        self.title = title
        self.url = url if url else ''
        self.arg_pattern = arg_pattern if arg_pattern and isinstance(arg_pattern, list) else []
        self.kw_pattern = kw_pattern if kw_pattern and isinstance(kw_pattern, dict) else {}
        self.is_append_code = is_append_code

    @property
    def data(self):
        """template data"""
        return {
            'title': self.title if self.title else '#',
            'url': reverse(self.url, kwargs=self.kw_pattern) if self.url else '#',
            'is_append_code': self.is_append_code,
        }


class BreadcrumbItem:  # pylint: disable=too-few-public-methods
    """prepare text menu line"""
    # home
    HOME_PAGE = BreadcrumbChildren(
        _('Home Page'), 'HomeView'
    )

    # base
    BASTION_LIST = BreadcrumbChildren(_('List'))
    BASTION_CREATE = BreadcrumbChildren(_('Create'))
    BASTION_DETAIL = BreadcrumbChildren(_('Detail'), is_append_code=True)
    BASTION_UPDATE = BreadcrumbChildren(_('Update'), is_append_code=True)

    # hr
    EMPLOYEE_LIST_PAGE = BreadcrumbChildren(_('Employee'), 'EmployeeList')
    EMPLOYEE_CREATE_PAGE = BreadcrumbChildren(_('Employee Create'), 'EmployeeCreate')
    GROUP_LEVEL_LIST_PAGE = BreadcrumbChildren(_('Organization Level'), 'GroupLevelList')
    GROUP_LIST_PAGE = BreadcrumbChildren(_('Organization Group'), 'GroupList')
    ROLE_LIST_PAGE = BreadcrumbChildren(_('Role'), 'RoleList')
    ROLE_CREATE_PAGE = BreadcrumbChildren(_("Create Role"), 'RoleCreate')

    # user
    USER_LIST_PAGE = BreadcrumbChildren(_('User'), 'UserList')
    USER_CREATE_PAGE = BreadcrumbChildren(_('User Create'), 'UserCreate')
    USER_DETAIL_PAGE = BreadcrumbChildren(_('User detail'))
    USER_EDIT_PAGE = BreadcrumbChildren(_('Edit user'))

    # company
    COMPANY_PAGE = BreadcrumbChildren(_('Company'), 'CompanyList')
    COMPANY_OVERVIEW_PAGE = BreadcrumbChildren(_('Company Overview'), 'CompanyListOverviewList')
    COMPANY_OVERVIEW_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))
    COMPANY_DIAGRAM = BreadcrumbChildren(_('Company Diagram'), 'TenantDiagramView')

    # TENANT_INFORMATION_PAGE = BreadcrumbChildren('Tenant Information', 'TenantInformation')

    # components
    COMPONENTS_PAGE = BreadcrumbChildren(_('Component'), 'ComponentCollections')

    # Workflow
    WORKFLOW_LIST_PAGE = BreadcrumbChildren(_('Workflow'), 'WorkflowList')
    WORKFLOW_CREATE_PAGE = BreadcrumbChildren(_('Workflow create'), 'WorkflowCreate')
    WORKFLOW_DETAIL_PAGE = BreadcrumbChildren(_('Workflow detail'))

    # Contact, Account
    CONTACT_LIST_PAGE = BreadcrumbChildren(_('Contact'), 'ContactList')
    CONTACT_CREATE_PAGE = BreadcrumbChildren(_('Contact create'), 'ContactCreate')
    CONTACT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))
    CONTACT_UPDATE_PAGE = BreadcrumbChildren(_('Update'))

    ACCOUNT_LIST_PAGE = BreadcrumbChildren(_('Account'), 'AccountList')
    ACCOUNT_CREATE_PAGE = BreadcrumbChildren(_('Account create'), 'AccountCreate')
    ACCOUNT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))
    ACCOUNT_UPDATE_PAGE = BreadcrumbChildren(_('Update'))

    # Master data config
    MASTER_DATA_PRICE_PAGE = BreadcrumbChildren(_('Master data price'), 'PriceMasterDataList')

    # Master Data
    CONTACT_MASTER_DATA_LIST_PAGE = BreadcrumbChildren(_('Master Data Contact'), 'ContactMasterDataList')
    ACCOUNT_MASTER_DATA_LIST_PAGE = BreadcrumbChildren(_('Master Data Account'), 'AccountMasterDataList')
    PRODUCT_MASTER_DATA_LIST_PAGE = BreadcrumbChildren(_('Master Data Product'), 'ProductMasterDataList')

    # Product
    PRODUCT_LIST_PAGE = BreadcrumbChildren(_('Product'), 'ProductList')
    PRODUCT_CREATE_PAGE = BreadcrumbChildren(_('Product create'), 'ProductCreate')
    PRODUCT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))
    PRODUCT_UPDATE_PAGE = BreadcrumbChildren(_('Update'))

    # Advance
    ADVANCE_PAYMENT_LIST_PAGE = BreadcrumbChildren(_('Advance Payment'), 'AdvancePaymentList')
    ADVANCE_PAYMENT_CREATE_PAGE = BreadcrumbChildren(_('Advance Payment create'), 'AdvancePaymentCreate')
    ADVANCE_PAYMENT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Payment
    PAYMENT_LIST_PAGE = BreadcrumbChildren(_('Payment'), 'PaymentList')
    PAYMENT_CREATE_PAGE = BreadcrumbChildren(_('Payment create'), 'PaymentCreate')
    PAYMENT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Price
    PRICE_LIST_PAGE = BreadcrumbChildren(_('Price'), 'PriceList')
    PRICE_LIST_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Expense
    EXPENSE_LIST_PAGE = BreadcrumbChildren(_('Expense'), 'ExpenseList')

    # Promotion
    PROMOTION_LIST_PAGE = BreadcrumbChildren(_('Promotion'), 'PromotionList')
    PROMOTION_CREATE_PAGE = BreadcrumbChildren(_('Promotion create'), 'PromotionCreate')
    PROMOTION_DETAIL_PAGE = BreadcrumbChildren(_('Promotion detail'))
    PROMOTION_EDIT_PAGE = BreadcrumbChildren(_('Promotion edit'))

    # Opportunity
    OPPORTUNITY_LIST_PAGE = BreadcrumbChildren(_('Opportunity'), 'OpportunityList')

    # Quotation
    QUOTATION_CONFIG_PAGE = BreadcrumbChildren(_('Quotation'), 'QuotationConfigDetail')
    QUOTATION_LIST_PAGE = BreadcrumbChildren(_('Quotation'), 'QuotationList')
    QUOTATION_CREATE_PAGE = BreadcrumbChildren(_('Quotation create'), 'QuotationCreate')
    QUOTATION_DETAIL_PAGE = BreadcrumbChildren(_('Quotation detail'))
    QUOTATION_UPDATE_PAGE = BreadcrumbChildren(_('Quotation update'))

    # Shipping
    SHIPPING_LIST_PAGE = BreadcrumbChildren(_('Shipping'), 'ShippingList')
    SHIPPING_CREATE_PAGE = BreadcrumbChildren(_('Shipping create'), 'ShippingCreate')
    SHIPPING_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Sale order
    SALE_ORDER_CONFIG_PAGE = BreadcrumbChildren(_('Sale order'), 'SaleOrderConfigDetail')
    SALE_ORDER_LIST_PAGE = BreadcrumbChildren(_('Sale order'), 'SaleOrderList')
    SALE_ORDER_CREATE_PAGE = BreadcrumbChildren(_('Sale order create'), 'SaleOrderCreate')
    SALE_ORDER_DETAIL_PAGE = BreadcrumbChildren(_('Sale order detail'))
    SALE_ORDER_UPDATE_PAGE = BreadcrumbChildren(_('Sale order update'))

    # WareHouse
    WAREHOUSE_LIST_PAGE = BreadcrumbChildren(_('WareHouse'), 'WareHouseList')

    # Good receipt
    GOOD_RECEIPT_LIST_PAGE = BreadcrumbChildren(_('Good receipt'), 'GoodReceiptList')
    GOOD_RECEIPT_CREATE_PAGE = BreadcrumbChildren(_('Good receipt create'), 'GoodReceiptCreate')
    GOOD_RECEIPT_EDIT_PAGE = BreadcrumbChildren(_('Good receipt edit'))
    GOOD_RECEIPT_DETAIL_PAGE = BreadcrumbChildren(_('Good receipt detail'))

    # Inventory Adjustment
    INVENTORY_ADJUSTMENT_LIST_PAGE = BreadcrumbChildren(_('Inventory Adjustment'), 'InventoryAdjustmentList')
    INVENTORY_ADJUSTMENT_CREATE_PAGE = BreadcrumbChildren(_('Inventory Adjustment create'), 'InventoryAdjustmentCreate')
    INVENTORY_ADJUSTMENT_EDIT_PAGE = BreadcrumbChildren(_('Inventory Adjustment edit'))
    INVENTORY_ADJUSTMENT_DETAIL_PAGE = BreadcrumbChildren(_('Inventory Adjustment detail'))

    # Transition Data Config
    DELIVERY_CONFIG_PAGE = BreadcrumbChildren(_('Delivery'), 'DeliveryConfigDetail')
    DELIVERY_PICKING_LIST_PAGE = BreadcrumbChildren(_('Picking'), 'OrderPickingList')
    DELIVERY_PICKING_DETAIL_PAGE = BreadcrumbChildren(_('Picking detail'))
    DELIVERY_PICKING_EDIT_PAGE = BreadcrumbChildren(_('Picking edit'))
    DELIVERY_LIST_PAGE = BreadcrumbChildren(_('Delivery list'), 'OrderDeliveryList')
    DELIVERY_DETAIL_PAGE = BreadcrumbChildren(_('Delivery Detail'))
    DELIVERY_EDIT_PAGE = BreadcrumbChildren(_('Delivery edit'))

    # Return Advance
    RETURN_ADVANCE_LIST_PAGE = BreadcrumbChildren(_('Return Advance'), 'ReturnAdvanceList')
    RETURN_ADVANCE_CREATE_PAGE = BreadcrumbChildren(_('Return Advance create'), 'ReturnAdvanceCreate')
    RETURN_ADVANCE_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Opportunity Detail
    OPPORTUNITY_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Opportunity Config
    OPPORTUNITY_CONFIG_PAGE = BreadcrumbChildren(_('Opportunity'), 'OpportunityConfig')

    # Payment Config
    PAYMENT_CONFIG_PAGE = BreadcrumbChildren(_('Payment Config'), 'PaymentConfigList')

    # Task
    OPPORTUNITY_TASK_CONFIG_PAGE = BreadcrumbChildren(_('Task config'), 'OpportunityTaskConfig')
    OPPORTUNITY_TASK_LIST_PAGE = BreadcrumbChildren(_('Task'), 'OpportunityTaskList')

    # Sale Activities
    CALL_LOG_LIST_PAGE = BreadcrumbChildren(_('Call log'), 'OpportunityCallLogList')
    EMAIL_LIST_PAGE = BreadcrumbChildren(_('Send email'), 'OpportunityEmailList')
    MEETING_LIST_PAGE = BreadcrumbChildren(_('Meeting'), 'OpportunityMeetingList')

    OPPORTUNITY_DOCUMENT_LIST_PAGE = BreadcrumbChildren(_('Document'), 'OpportunityDocumentList')

    # Purchase
    # PURCHASE_REQUEST_LIST_PAGE = BreadcrumbChildren(_('Purchase Request List'), 'PurchaseRequestList'),
    # Purchase Quotation Request
    PURCHASE_QUOTATION_REQUEST = BreadcrumbChildren(
        _('Purchase Quotation Request'), 'PurchaseQuotationRequestList'
    )
    PURCHASE_QUOTATION_REQUEST_CREATE_FROM_PR = BreadcrumbChildren(
        _('Purchase Quotation Request create (From PR)'), 'PurchaseQuotationRequestCreateFromPR'
    )
    PURCHASE_QUOTATION_REQUEST_CREATE_MANUAL = BreadcrumbChildren(
        _('Purchase Quotation Request create (Manual)'), 'PurchaseQuotationRequestCreateManual'
    )
    PURCHASE_QUOTATION_REQUEST_DETAIL = BreadcrumbChildren(
        _('Purchase Quotation Request detail'),
    )

    PURCHASE_QUOTATION = BreadcrumbChildren(
        _('Purchase Quotation'), 'PurchaseQuotationList'
    )
    PURCHASE_QUOTATION_CREATE = BreadcrumbChildren(
        _('Purchase Quotation create '), 'PurchaseQuotationCreate'
    )
    PURCHASE_QUOTATION_DETAIL = BreadcrumbChildren(
        _('Purchase Quotation detail'),
    )

    PURCHASE_REQUEST_LIST = BreadcrumbChildren(
        _('Purchase Request'), 'PurchaseRequestList'
    )

    SALE_PROCESS_PAGE = BreadcrumbChildren(
        _('Sale Process'), 'SaleProcess'
    )

    # Expense item

    EXPENSE_ITEM_LIST_PAGE = BreadcrumbChildren(
        _('Expense List'), 'ExpenseItemList'
    )

    # Purchase order
    PURCHASE_ORDER_LIST_PAGE = BreadcrumbChildren(_('Purchase order'), 'PurchaseOrderList')
    PURCHASE_ORDER_CREATE_PAGE = BreadcrumbChildren(_('Purchase order create'), 'PurchaseOrderCreate')
    PURCHASE_ORDER_DETAIL_PAGE = BreadcrumbChildren(_('Purchase order detail'))
    PURCHASE_ORDER_UPDATE_PAGE = BreadcrumbChildren(_('Purchase order update'))

    # Goods receipt
    GOODS_RECEIPT_LIST_PAGE = BreadcrumbChildren(_('Goods receipt'), 'GoodsReceiptList')
    GOODS_RECEIPT_CREATE_PAGE = BreadcrumbChildren(_('Goods receipt create'), 'GoodsReceiptCreate')
    GOODS_RECEIPT_DETAIL_PAGE = BreadcrumbChildren(_('Goods receipt detail'))
    GOODS_RECEIPT_UPDATE_PAGE = BreadcrumbChildren(_('Goods receipt update'))

    # Purchase request config
    PURCHASE_REQUEST_CONFIG_PAGE = BreadcrumbChildren(_('Purchase Request'), 'PurchaseRequestConfig')

    # E-Office
    # Leave
    LEAVE_CONFIG = BreadcrumbChildren(
        _('Leave Config'), 'LeaveConfigDetail'
    )



class BreadcrumbView:
    """menu vertical item view"""

    @staticmethod
    def get_list_view():
        arr = []
        for att in dir(BreadcrumbItem()):
            if not att.startswith('__'):
                child = getattr(BreadcrumbItem, att)
                if child.url:
                    arr.append(
                        {
                            'view_name': child.url,
                            'title': child.title,
                        }
                    )
        return arr

    @staticmethod
    def check_view_name():
        """
        Check view was used in BreadcrumbItem that is exists
        Returns:
            True : Nothing happened
            or NoReverseMatch : raise Error and interrupt runtime process
        """
        view_errs = {}
        for att in dir(BreadcrumbItem()):
            if not att.startswith('__'):
                child = getattr(BreadcrumbItem, att)
                try:
                    if child.url:
                        if child.kw_pattern and child.arg_pattern:
                            reverse(child.url, args=child.arg_pattern, kwargs=child.kw_pattern)
                        elif child.arg_pattern:
                            reverse(child.url, args=child.arg_pattern)
                        elif child.kw_pattern:
                            reverse(child.url, kwargs=child.kw_pattern)
                        else:
                            reverse(child.url)

                except NoReverseMatch as err:
                    view_errs[att] = str(err)

        if view_errs:
            msg = 'Some view was used in Breadcrumb does not exist. It is: \n'
            msg += '************************************************************\n'
            for k, value in view_errs.items():
                msg += f'* {k}: {value}\n'
            msg += '************************************************************\n'
            raise NoReverseMatch(msg)
        return True

    @classmethod
    def parsed(cls, name: str) -> list:
        """method parsed data custom"""
        result = []
        data = getattr(cls, name, [])
        if data and isinstance(data, list):
            has_append_code = False
            for item in data[::-1]:
                item_data = item.data
                if item_data['is_append_code'] is True:
                    if has_append_code is False:
                        has_append_code = True
                    else:
                        item_data['is_append_code'] = False
                result.append(item_data)
        return result[::-1]

    HOME_PAGE = [
        BreadcrumbItem.HOME_PAGE,
    ]

    EMPLOYEE_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.EMPLOYEE_LIST_PAGE,
    ]

    EMPLOYEE_CREATE_PAGE = EMPLOYEE_LIST_PAGE + [BreadcrumbItem.EMPLOYEE_CREATE_PAGE]

    EMPLOYEE_UPDATE_PAGE = EMPLOYEE_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]
    EMPLOYEE_DETAIL_PAGE = EMPLOYEE_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]

    USER_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.USER_LIST_PAGE,
    ]

    USER_CREATE_PAGE = USER_LIST_PAGE + [BreadcrumbItem.USER_CREATE_PAGE]

    USER_DETAIL_PAGE = USER_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]

    USER_EDIT_PAGE = USER_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    GROUP_LEVEL_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.GROUP_LEVEL_LIST_PAGE,
    ]

    GROUP_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.GROUP_LIST_PAGE,
    ]
    GROUP_CREATE = GROUP_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    GROUP_DETAIL = GROUP_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    GROUP_UPDATE = GROUP_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    COMPANY_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_PAGE,
    ]
    COMPANY_DETAIL_PAGE = COMPANY_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    COMPANY_UPDATE_PAGE = COMPANY_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    COMPANY_DIAGRAM = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_DIAGRAM,
    ]

    COMPANY_OVERVIEW_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_PAGE,
        BreadcrumbItem.COMPANY_OVERVIEW_PAGE,
    ]

    COMPANY_OVERVIEW_DETAIL_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_PAGE,
        BreadcrumbItem.COMPANY_OVERVIEW_PAGE,
        BreadcrumbItem.COMPANY_OVERVIEW_DETAIL_PAGE,
    ]

    ROLE_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.ROLE_LIST_PAGE,
    ]

    ROLE_CREATE_PAGE = ROLE_LIST_PAGE + [BreadcrumbItem.ROLE_CREATE_PAGE]
    ROLE_DETAIL_PAGE = ROLE_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    ROLE_UPDATE_PAGE = ROLE_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # TENANT_INFORMATION_PAGE = [BreadcrumbItem.HOME_PAGE, BreadcrumbItem.TENANT_INFORMATION_PAGE]
    WORKFLOW_LIST_PAGE = [
        BreadcrumbItem.WORKFLOW_LIST_PAGE
    ]

    WORKFLOW_CREATE_PAGE = WORKFLOW_LIST_PAGE + [BreadcrumbItem.WORKFLOW_CREATE_PAGE]
    WORKFLOW_DETAIL_PAGE = WORKFLOW_LIST_PAGE + [BreadcrumbItem.WORKFLOW_DETAIL_PAGE]

    CONTACT_LIST_PAGE = [
        BreadcrumbItem.CONTACT_LIST_PAGE
    ]
    CONTACT_CREATE_PAGE = CONTACT_LIST_PAGE + [BreadcrumbItem.CONTACT_CREATE_PAGE]
    CONTACT_DETAIL_PAGE = CONTACT_LIST_PAGE + [BreadcrumbItem.CONTACT_DETAIL_PAGE]
    CONTACT_UPDATE_PAGE = CONTACT_LIST_PAGE + [BreadcrumbItem.CONTACT_UPDATE_PAGE]

    ACCOUNT_LIST_PAGE = [
        BreadcrumbItem.ACCOUNT_LIST_PAGE
    ]
    ACCOUNT_CREATE_PAGE = ACCOUNT_LIST_PAGE + [BreadcrumbItem.ACCOUNT_CREATE_PAGE]
    ACCOUNT_DETAIL_PAGE = ACCOUNT_LIST_PAGE + [BreadcrumbItem.ACCOUNT_DETAIL_PAGE]
    ACCOUNT_UPDATE_PAGE = ACCOUNT_LIST_PAGE + [BreadcrumbItem.ACCOUNT_UPDATE_PAGE]

    MASTER_DATA_PRICE_PAGE = [
        BreadcrumbItem.MASTER_DATA_PRICE_PAGE
    ]

    CONTACT_MASTER_DATA_LIST_PAGE = [
        BreadcrumbItem.CONTACT_MASTER_DATA_LIST_PAGE
    ]
    ACCOUNT_MASTER_DATA_LIST_PAGE = [
        BreadcrumbItem.ACCOUNT_MASTER_DATA_LIST_PAGE
    ]
    PRODUCT_MASTER_DATA_LIST_PAGE = [
        BreadcrumbItem.PRODUCT_MASTER_DATA_LIST_PAGE
    ]

    PRODUCT_LIST_PAGE = [
        BreadcrumbItem.PRODUCT_LIST_PAGE
    ]
    PRODUCT_CREATE_PAGE = PRODUCT_LIST_PAGE + [BreadcrumbItem.PRODUCT_CREATE_PAGE]
    PRODUCT_DETAIL_PAGE = PRODUCT_LIST_PAGE + [BreadcrumbItem.PRODUCT_DETAIL_PAGE]
    PRODUCT_UPDATE_PAGE = PRODUCT_LIST_PAGE + [BreadcrumbItem.PRODUCT_UPDATE_PAGE]

    ADVANCE_PAYMENT_LIST_PAGE = [
        BreadcrumbItem.ADVANCE_PAYMENT_LIST_PAGE
    ]
    ADVANCE_PAYMENT_CREATE_PAGE = ADVANCE_PAYMENT_LIST_PAGE + [BreadcrumbItem.ADVANCE_PAYMENT_CREATE_PAGE]
    ADVANCE_PAYMENT_DETAIL_PAGE = ADVANCE_PAYMENT_LIST_PAGE + [BreadcrumbItem.ADVANCE_PAYMENT_DETAIL_PAGE]

    PAYMENT_LIST_PAGE = [
        BreadcrumbItem.PAYMENT_LIST_PAGE
    ]
    PAYMENT_CREATE_PAGE = PAYMENT_LIST_PAGE + [BreadcrumbItem.PAYMENT_CREATE_PAGE]
    PAYMENT_DETAIL_PAGE = PAYMENT_LIST_PAGE + [BreadcrumbItem.PAYMENT_DETAIL_PAGE]

    PRICE_LIST_PAGE = [
        BreadcrumbItem.PRICE_LIST_PAGE
    ]
    PRICE_LIST_DETAIL_PAGE = PRICE_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    PRICE_LIST_UPDATE_PAGE = PRICE_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    EXPENSE_LIST_PAGE = [BreadcrumbItem.EXPENSE_LIST_PAGE]
    EXPENSE_CREATE_PAGE = EXPENSE_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    EXPENSE_DETAIL_PAGE = EXPENSE_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    EXPENSE_UPDATE_PAGE = EXPENSE_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    PROMOTION_LIST_PAGE = [
        BreadcrumbItem.PROMOTION_LIST_PAGE
    ]

    PROMOTION_CREATE_PAGE = PROMOTION_LIST_PAGE + [BreadcrumbItem.PROMOTION_CREATE_PAGE]
    PROMOTION_DETAIL_PAGE = PROMOTION_LIST_PAGE + [BreadcrumbItem.PROMOTION_DETAIL_PAGE]
    PROMOTION_EDIT_PAGE = PROMOTION_LIST_PAGE + [BreadcrumbItem.PROMOTION_EDIT_PAGE]

    # Opportunity
    OPPORTUNITY_LIST_PAGE = [
        BreadcrumbItem.OPPORTUNITY_LIST_PAGE
    ]

    # Quotation
    QUOTATION_LIST_PAGE = [
        BreadcrumbItem.QUOTATION_LIST_PAGE
    ]
    QUOTATION_CREATE_PAGE = QUOTATION_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    QUOTATION_DETAIL_PAGE = QUOTATION_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    QUOTATION_UPDATE_PAGE = QUOTATION_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # Shipping
    SHIPPING_LIST_PAGE = [
        BreadcrumbItem.SHIPPING_LIST_PAGE
    ]
    SHIPPING_CREATE_PAGE = SHIPPING_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    SHIPPING_DETAIL_PAGE = SHIPPING_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    SHIPPING_UPDATE_PAGE = SHIPPING_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # Sale order
    SALE_ORDER_LIST_PAGE = [
        BreadcrumbItem.SALE_ORDER_LIST_PAGE
    ]
    SALE_ORDER_CREATE_PAGE = SALE_ORDER_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    SALE_ORDER_DETAIL_PAGE = SALE_ORDER_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    SALE_ORDER_UPDATE_PAGE = SALE_ORDER_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # Warehouse
    WAREHOUSE_LIST_PAGE = [
        BreadcrumbItem.WAREHOUSE_LIST_PAGE,
    ]
    WAREHOUSE_CREATE_PAGE = WAREHOUSE_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    WAREHOUSE_DETAIL_PAGE = WAREHOUSE_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    WAREHOUSE_UPDATE_PAGE = WAREHOUSE_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # Good receipt
    GOOD_RECEIPT_LIST_PAGE = [
        BreadcrumbItem.GOOD_RECEIPT_LIST_PAGE
    ]
    GOOD_RECEIPT_CREATE_PAGE = GOOD_RECEIPT_LIST_PAGE + [BreadcrumbItem.GOOD_RECEIPT_CREATE_PAGE]
    GOOD_RECEIPT_EDIT_PAGE = GOOD_RECEIPT_LIST_PAGE + [BreadcrumbItem.GOOD_RECEIPT_EDIT_PAGE]
    GOOD_RECEIPT_DETAIL_PAGE = GOOD_RECEIPT_LIST_PAGE + [BreadcrumbItem.GOOD_RECEIPT_DETAIL_PAGE]

    # Inventory Adjustment
    INVENTORY_ADJUSTMENT_LIST_PAGE = [
        BreadcrumbItem.INVENTORY_ADJUSTMENT_LIST_PAGE
    ]
    INVENTORY_ADJUSTMENT_CREATE_PAGE = INVENTORY_ADJUSTMENT_LIST_PAGE + [BreadcrumbItem.INVENTORY_ADJUSTMENT_CREATE_PAGE]
    INVENTORY_ADJUSTMENT_EDIT_PAGE = INVENTORY_ADJUSTMENT_LIST_PAGE + [BreadcrumbItem.INVENTORY_ADJUSTMENT_EDIT_PAGE]
    INVENTORY_ADJUSTMENT_DETAIL_PAGE = INVENTORY_ADJUSTMENT_LIST_PAGE + [BreadcrumbItem.INVENTORY_ADJUSTMENT_DETAIL_PAGE]

    # Return Advance
    RETURN_ADVANCE_LIST_PAGE = [
        BreadcrumbItem.RETURN_ADVANCE_LIST_PAGE
    ]
    RETURN_ADVANCE_CREATE_PAGE = RETURN_ADVANCE_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    RETURN_ADVANCE_DETAIL_PAGE = RETURN_ADVANCE_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    RETURN_ADVANCE_UPDATE_PAGE = RETURN_ADVANCE_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # Delivery
    ORDER_PICKING_LIST_PAGE = [
        BreadcrumbItem.DELIVERY_PICKING_LIST_PAGE,
    ]
    ORDER_PICKING_DETAIL_PAGE = ORDER_PICKING_LIST_PAGE + [BreadcrumbItem.DELIVERY_PICKING_DETAIL_PAGE]
    ORDER_PICKING_EDIT_PAGE = ORDER_PICKING_LIST_PAGE + [BreadcrumbItem.DELIVERY_PICKING_EDIT_PAGE]
    ORDER_DELIVERY_LIST_PAGE = [
        BreadcrumbItem.DELIVERY_LIST_PAGE,
    ]
    ORDER_DELIVERY_DETAIL_PAGE = ORDER_DELIVERY_LIST_PAGE + [BreadcrumbItem.DELIVERY_DETAIL_PAGE]
    ORDER_DELIVERY_EDIT_PAGE = ORDER_DELIVERY_LIST_PAGE + [BreadcrumbItem.DELIVERY_EDIT_PAGE]

    # Transition Data Config
    DELIVERY_CONFIG = [
        BreadcrumbItem.DELIVERY_CONFIG_PAGE
    ]
    QUOTATION_CONFIG = [
        BreadcrumbItem.QUOTATION_CONFIG_PAGE
    ]
    SALE_ORDER_CONFIG = [
        BreadcrumbItem.SALE_ORDER_CONFIG_PAGE
    ]

    # Opportunity detail
    OPPORTUNITY_DETAIL_PAGE = OPPORTUNITY_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    OPPORTUNITY_UPDATE_PAGE = OPPORTUNITY_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # Opportunity Config
    OPPORTUNITY_CONFIG_PAGE = [BreadcrumbItem.OPPORTUNITY_CONFIG_PAGE]
    PAYMENT_CONFIG_PAGE = [BreadcrumbItem.PAYMENT_CONFIG_PAGE]

    # Task
    OPPORTUNITY_TASK_CONFIG_PAGE = [BreadcrumbItem.OPPORTUNITY_TASK_CONFIG_PAGE]
    OPPORTUNITY_TASK_LIST_PAGE = [BreadcrumbItem.OPPORTUNITY_TASK_LIST_PAGE]

    # Sale Activities
    CALL_LOG_LIST_PAGE = [
        BreadcrumbItem.CALL_LOG_LIST_PAGE
    ]
    EMAIL_LIST_PAGE = [
        BreadcrumbItem.EMAIL_LIST_PAGE
    ]
    MEETING_LIST_PAGE = [
        BreadcrumbItem.MEETING_LIST_PAGE
    ]

    OPPORTUNITY_DOCUMENT_LIST_PAGE = [
        BreadcrumbItem.OPPORTUNITY_DOCUMENT_LIST_PAGE
    ]

    OPPORTUNITY_DOCUMENT_CREATE_PAGE = OPPORTUNITY_DOCUMENT_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    OPPORTUNITY_DOCUMENT_DETAIL_PAGE = OPPORTUNITY_DOCUMENT_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]

    # Purchase
    # PURCHASE_REQUEST_LIST_PAGE = [
    #     BreadcrumbItem.PURCHASE_REQUEST_LIST_PAGE
    # ]
    # PURCHASE_REQUEST_CREATE_PAGE = PURCHASE_REQUEST_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]

    PURCHASE_QUOTATION_REQUEST_LIST_PAGE = [
        BreadcrumbItem.PURCHASE_QUOTATION_REQUEST
    ]
    PURCHASE_QUOTATION_REQUEST_CREATE_PAGE_FROM_PR = PURCHASE_QUOTATION_REQUEST_LIST_PAGE + [
        BreadcrumbItem.PURCHASE_QUOTATION_REQUEST_CREATE_FROM_PR
    ]
    PURCHASE_QUOTATION_REQUEST_CREATE_PAGE_MANUAL = PURCHASE_QUOTATION_REQUEST_LIST_PAGE + [
        BreadcrumbItem.PURCHASE_QUOTATION_REQUEST_CREATE_MANUAL
    ]
    PURCHASE_QUOTATION_REQUEST_DETAIL_PAGE = PURCHASE_QUOTATION_REQUEST_LIST_PAGE + [
        BreadcrumbItem.PURCHASE_QUOTATION_REQUEST_DETAIL
    ]

    PURCHASE_QUOTATION_LIST_PAGE = [
        BreadcrumbItem.PURCHASE_QUOTATION
    ]
    PURCHASE_QUOTATION_CREATE_PAGE = PURCHASE_QUOTATION_LIST_PAGE + [
        BreadcrumbItem.PURCHASE_QUOTATION_CREATE
    ]
    PURCHASE_QUOTATION_DETAIL_PAGE = PURCHASE_QUOTATION_LIST_PAGE + [
        BreadcrumbItem.PURCHASE_QUOTATION_DETAIL
    ]

    PURCHASE_REQUEST_LIST_PAGE = [
        BreadcrumbItem.PURCHASE_REQUEST_LIST
    ]

    PURCHASE_REQUEST_CREATE_PAGE = PURCHASE_REQUEST_LIST_PAGE + [
        BreadcrumbItem.BASTION_CREATE
    ]
    PURCHASE_REQUEST_DETAIL_PAGE = PURCHASE_REQUEST_LIST_PAGE + [
        BreadcrumbItem.BASTION_DETAIL
    ]

    # process
    SALE_PROCESS_PAGE = [
        BreadcrumbItem.SALE_PROCESS_PAGE
    ]

    # expense item
    EXPENSE_ITEM_LIST_PAGE = [
        BreadcrumbItem.EXPENSE_ITEM_LIST_PAGE
    ]

    # Purchase order
    PURCHASE_ORDER_LIST_PAGE = [BreadcrumbItem.PURCHASE_ORDER_LIST_PAGE]
    PURCHASE_ORDER_CREATE_PAGE = PURCHASE_ORDER_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    PURCHASE_ORDER_DETAIL_PAGE = PURCHASE_ORDER_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    PURCHASE_ORDER_UPDATE_PAGE = PURCHASE_ORDER_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # Goods receipt
    GOODS_RECEIPT_LIST_PAGE = [BreadcrumbItem.GOODS_RECEIPT_LIST_PAGE]
    GOODS_RECEIPT_CREATE_PAGE = GOODS_RECEIPT_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    GOODS_RECEIPT_DETAIL_PAGE = GOODS_RECEIPT_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    GOODS_RECEIPT_UPDATE_PAGE = GOODS_RECEIPT_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

    # e-office Leave
    LEAVE_CONFIG_PAGE = [
        BreadcrumbItem.LEAVE_CONFIG
    ]

    # Purchase request config
    PURCHASE_REQUEST_CONFIG_PAGE = [BreadcrumbItem.PURCHASE_REQUEST_CONFIG_PAGE]

    # Inventory Adjustment
    INVENTORY_ADJUSTMENT_LIST_PAGE = [BreadcrumbItem.INVENTORY_ADJUSTMENT_LIST_PAGE]
    INVENTORY_ADJUSTMENT_CREATE_PAGE = INVENTORY_ADJUSTMENT_LIST_PAGE + [BreadcrumbItem.BASTION_CREATE]
    INVENTORY_ADJUSTMENT_DETAIL_PAGE = INVENTORY_ADJUSTMENT_LIST_PAGE + [BreadcrumbItem.BASTION_DETAIL]
    INVENTORY_ADJUSTMENT_UPDATE_PAGE = INVENTORY_ADJUSTMENT_LIST_PAGE + [BreadcrumbItem.BASTION_UPDATE]

