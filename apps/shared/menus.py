__all__ = [
    'SpaceGroup',
    'SpaceItem',
]

from typing import Union

from django.urls import reverse
from .utils import RandomGenerate


# Menus Setup
class MenuCommon:
    name: str
    code: str
    view_name: Union[str, None]
    icon: str
    child: list

    def __init__(
            self, name: str, code: str, view_name: Union[str, None] = None, icon: str = None,
            child: list = None
    ):
        self.name = name
        self.code = code
        self.view_name = view_name
        self.icon = icon if icon else ''
        self.child = child if isinstance(child, list) else []

    @property
    def data(self):
        return {
            'name': self.name,
            'code': self.code if self.code else RandomGenerate.get_string(length=32),
            'view_name': self.view_name,
            'url': reverse(self.view_name) if self.view_name and self.view_name != '#' else '#',
            'icon': self.icon,
            'child': [
                x.data for x in self.child
            ]
        }


class MenusCompanySystem:
    COMPANY_LIST = MenuCommon(
        name='Company', code='menu_company_list', view_name='CompanyList', icon='<i class="fas fa-building"></i>'
    )
    USER_LIST = MenuCommon(
        name='User', code='menu_user_list', view_name='UserList', icon='<i class="fas fa-user"></i>'
    )
    ORG_CHART = MenuCommon(
        name='Org Chart',
        code='menu_org_child',
        icon='<i class="fas fa-sitemap"></i>',
        child=[
            MenuCommon(
                name='Employee', code='menu_employee_list', view_name='EmployeeList',
                icon='<i class="fas fa-user-tie"></i>'
            ),
            MenuCommon(
                name='Role', code='menu_role_list', view_name='RoleList', icon='<i class="fas fa-users-cog"></i>'
            ),
            MenuCommon(
                name='Group', code='menu_group_list', view_name='GroupList', icon='<i class="fas fa-users"></i>'
            ),
            MenuCommon(
                name='Org Charts', code='menu_company_diagram', view_name='TenantDiagramView',
                icon='<i class="fa-solid fa-diagram-project"></i>',
            ),
        ]
    )
    WORKING_CALENDAR = MenuCommon(
        name='Working calendar', code='menu_working_calendar', view_name='WorkingCalendarConfig',
        icon='<i class="fa-regular fa-calendar-days"></i>',
    )
    WORKFLOW_PROCESS = MenuCommon(
        name='Process Management', code='menu_process_management', icon='<i class="fab fa-stumbleupon-circle"></i>',
        child=[
            MenuCommon(
                name='Workflow', code='menu_workflow_list', view_name='WorkflowList',
                icon='<i class="fas fa-shapes"></i>'
            ),
            MenuCommon(
                name='Business Process', code='menu_sale_process', view_name='SaleProcess',
                icon='<i class="fab fa-phabricator"></i>',
            ),
            MenuCommon(
                name='Automation', code='', view_name='#', icon='<i class="fas fa-robot"></i>',
            ),
        ]
    )
    TENANT_MANAGE = MenuCommon(
        name='Tenant', code='menu_company_overview_list', view_name='CompanyListOverviewList',
        icon='<i class="fa-solid fa-city"></i>',
    )
    COMPANY_SITE_BUILDER = MenuCommon(
        name='Site Config', code='menu_site_config_builder', view_name='MyCompanyWebsiteList',
        icon='<i class="fa-solid fa-globe"></i>',
    )


class MenusCoreConfigurations:
    MASTER_DATA_CONFIG = MenuCommon(
        name='Master data config', code='menu_masterdata', view_name='#', icon='<i class="bi bi-mastodon"></i>',
        child=[
            MenuCommon(
                name='Contact', code='id_menu_master_data_contact', view_name='ContactMasterDataList',
                icon='<i class="bi bi-journal-bookmark-fill"></i>',
            ),
            MenuCommon(
                name='Account', code='id_menu_master_data_account', view_name='AccountMasterDataList',
                icon='<i class="bi bi-person-rolodex"></i>',
            ),
            MenuCommon(
                name='Items', code='id_menu_master_data_product', view_name='ProductMasterDataList',
                icon='<i class="bi bi-diagram-2-fill"></i>',
            ),
            MenuCommon(
                name='Price', code='id_menu_master_data_price', view_name='PriceMasterDataList',
                icon='<i class="bi bi-currency-exchange"></i>',
            ),
        ]
    )
    TRANSITION_DATA_CONFIG = MenuCommon(
        name='Transition Data Config', code='menu_transition_data_config', view_name='#',
        icon='<i class="fas fa-file-invoice-dollar"></i>',
        child=[
            MenuCommon(
                name='Delivery', code='menu_delivery_config', view_name='DeliveryConfigDetail',
                icon='<i class="fas fa-truck"></i>',
            ),
            MenuCommon(
                name='Sale Order', code='menu_quotation_config', view_name='QuotationConfigDetail',
                icon='<i class="fas fa-file-invoice-dollar"></i>',
            ),
            # MenuCommon(
            #     name='Sale Order', code='menu_sale_order_config', view_name='SaleOrderConfigDetail',
            #     icon='<i class="fas fa-file-invoice"></i>',
            # ),
            MenuCommon(
                name='Opportunity', code='menu_opportunity_config', view_name='OpportunityConfig',
                icon='<i class="fa-solid fa-lightbulb"></i>',
            ),
            MenuCommon(
                name='Task', code='menu_opportunity_task_config', view_name='OpportunityTaskConfig',
                icon='<i class="fa-solid fa-clipboard-check"></i>',
            ),
            # MenuCommon(
            #     name='Payment', code='menu_payment_config', view_name='PaymentConfigList',
            #     icon='<i class="bi bi-credit-card-fill"></i>',
            # ),
            MenuCommon(
                name='Expense Items', code='id_menu_expense_item_list', view_name='ExpenseItemList',
                icon='<i class="bi bi-wallet2"></i>',
            ),
            MenuCommon(
                name='Internal Labor Items', code='id_menu_expense_list', view_name='ExpenseList',
                icon='<i class="bi bi-cash-coin"></i>',
            ),
            MenuCommon(
                name='Leave', code='menu_leave_config', view_name='LeaveConfigDetail',
                icon='<i class="fa-solid fa-arrow-right-from-bracket"></i>',
            ),
            MenuCommon(
                name='Purchase Request Config', code='menu_purchase_request_config', view_name='PurchaseRequestConfig',
                icon='<i class="fas fa-shopping-cart"></i>',
            ),
        ]
    )


class MenusCRM:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )
    CONTACT = MenuCommon(
        name='Contact', code='id_menu_contact', view_name='ContactList',
        icon='<i class="bi bi-journal-bookmark-fill"></i>',
    )
    ACCOUNT = MenuCommon(
        name='Account', code='id_menu_account', view_name='AccountList', icon='<i class="bi bi-person-rolodex"></i>',
    )
    LEAD = MenuCommon(
        name='Lead', code='', view_name='', icon='<i class="fa-solid fa-users-viewfinder"></i>',
    )
    OPPORTUNITY = MenuCommon(
        name='Opportunity', code='menu_opportunity_list', view_name='OpportunityList',
        icon='<i class="far fa-lightbulb"></i>',
    )
    QUOTATION = MenuCommon(
        name='Quotation', code='menu_quotation_list', view_name='QuotationList',
        icon='<i class="fas fa-file-invoice-dollar"></i>',
    )
    SALE_ORDER = MenuCommon(
        name='Sale Order', code='menu_sale_order_list', view_name='SaleOrderList',
        icon='<i class="fas fa-file-invoice"></i>',
    )
    FINAL_ACCEPTANCE = MenuCommon(
        name='Final acceptance', code='menu_final_acceptance_list', view_name='FinalAcceptanceList',
        icon='<i class="fas fa-file-alt"></i>',
    )
    PRODUCT = MenuCommon(
        name='Product', code='id_menu_product_list', view_name='ProductList', icon='<i class="bi bi-archive-fill"></i>',
    )
    INVENTORY = MenuCommon(
        name='Inventory', code='menu_inventory', view_name='#', icon='<i class="fas fa-clipboard-list"></i>',
        child=[
            MenuCommon(
                name='WareHouse', code='menu_warehouse_list', view_name='WareHouseList',
                icon='<i class="fas fa-warehouse"></i>',
            ),
            # MenuCommon(
            #     name='Good receipt', code='menu_good_receipt_list', view_name='GoodReceiptList',
            #     icon='<i class="bi bi-receipt"></i>',
            # ),
            MenuCommon(
                name='Picking', code='menu_order_picking_list', view_name='OrderPickingList',
                icon='<i class="fas fa-box"></i>',
            ),
            MenuCommon(
                name='Delivery', code='menu_order_delivery_list', view_name='OrderDeliveryList',
                icon='<i class="fas fa-truck-pickup"></i>',
            ),
        ],
    )
    PRICING = MenuCommon(
        name='Pricing', code='menu_pricing', view_name='', icon='<i class="bi bi-tags-fill"></i>',
        child=[
            MenuCommon(
                name='Price List', code='id_menu_pricing_list', view_name='PriceList',
                icon='<i class="far fa-money-bill-alt"></i>',
            ),
            MenuCommon(
                name='Shipping list', code='id_menu_shipping_list', view_name='ShippingList',
                icon='<i class="fas fa-truck"></i>',
            ),
            MenuCommon(
                name='Promotion List', code='id_menu_promotion_list', view_name='PromotionList',
                icon='<i class="fas fa-shopping-cart"></i>',
            ),
        ]
    )
    CASH_OUTFLOW = MenuCommon(
        name='Cash Outflow', code='menu_cash_outflow', view_name='', icon='<i class="bi bi-currency-exchange"></i>',
        child=[
            MenuCommon(
                name='Advance Payment', code='id_menu_advance_payment', view_name='AdvancePaymentList',
                icon='<i class="bi bi-piggy-bank-fill"></i>',
            ),
            MenuCommon(
                name='Payment', code='id_menu_payment', view_name='PaymentList',
                icon='<i class="bi bi-credit-card-fill"></i>',
            ),
            MenuCommon(
                name='Return Advance', code='id_menu_return_advance', view_name='ReturnAdvanceList',
                icon='<i class="bi bi-piggy-bank"></i>',
            ),
        ],
    )
    SALE_ACTIVITIES = MenuCommon(
        name='Sale Activities', code='menu_sale_activities', view_name='', icon='<i class="bi bi-ui-checks-grid"></i>',
        child=[
            MenuCommon(
                name='Log a call', code='id_menu_log_a_call', view_name='OpportunityCallLogList',
                icon='<i class="bi bi-telephone-fill"></i>',
            ),
            MenuCommon(
                name='Send email', code='id_menu_email', view_name='OpportunityEmailList',
                icon='<i class="bi bi-envelope-fill"></i>',
            ),
            MenuCommon(
                name='Meeting', code='id_menu_meeting', view_name='OpportunityMeetingList',
                icon='<i class="bi bi-person-workspace"></i>',
            ),
            MenuCommon(
                name='Document For Customer', code='menu_opportunity_document',
                view_name='OpportunityDocumentList',
                icon='<i class="bi bi-file-earmark"></i>',
            ),

        ],
    )

    TASK = MenuCommon(
        name='Task', code='menu_opportunity_task', view_name='OpportunityTaskList',
        icon='<i class="fa-solid fa-list-check"></i>',
        child=[
        ],
    )


class MenusPurchase:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )

    PURCHASE = MenuCommon(
        name='Purchasing', code='menu_purchase_activities', view_name='', icon='<i class="fas fa-cart-arrow-down"></i>',
        child=[
            MenuCommon(
                name='Purchase Request',
                code='menu_purchase_request_list',
                view_name='PurchaseRequestList',
                icon='<i class="fas fa-file-upload"></i>',
            ),
            MenuCommon(
                name='Purchase quotation request',
                code='id_menu_purchase_quotation_request_list',
                view_name='PurchaseQuotationRequestList',
                icon='<i class="fas fa-file-invoice-dollar"></i>',
            ),
            MenuCommon(
                name='Purchase quotation',
                code='id_menu_purchase_quotation_list',
                view_name='PurchaseQuotationList',
                icon='<i class="fas fa-file-alt"></i>',
            ),
            MenuCommon(
                name='Purchase order', code='menu_purchase_order_list', view_name='PurchaseOrderList',
                icon='<i class="fas fa-file-contract"></i>',
            ),
        ],
    )

    INVENTORY = MenuCommon(
        name='Inventory', code='menu_inventory_activities', view_name='', icon='<i class="fas fa-store"></i>',
        child=[
            MenuCommon(
                name='Goods receipt',
                code='menu_goods_receipt_list',
                view_name='GoodsReceiptList',
                icon='<i class="fas fa-file-import"></i>',
            ),
            MenuCommon(
                name='Inventory adjustment',
                code='menu_inventory_adjustment_list',
                view_name='InventoryAdjustmentList',
                icon='<i class="bi bi-sliders"></i>',
            ),
            MenuCommon(
                name='Goods Transfer',
                code='menu_goods_transfer_list',
                view_name='GoodsTransferList',
                icon='<i class="fas fa-exchange-alt"></i>',
            ),
            MenuCommon(
                name='Goods issue',
                code='menu_goods_issue_list',
                view_name='GoodsIssueList',
                icon='<i class="fas fa-file-export"></i>',
            ),
        ],
    )


class MenuEOffice:
    LEAVE = MenuCommon(
        name='Leave', code='menu_leave', icon='<i class="fa-solid fa-arrow-right-from-bracket"></i>',
        child=[
            MenuCommon(
                name='Leave request', code='menu_leave_request', view_name='LeaveRequestList',
                icon='<i class="fa-solid fa-arrow-right-from-bracket"></i>'
            ),
            MenuCommon(
                name='Available list', code='menu_leave_available', view_name='LeaveAvailableList',
                icon='<i class="fa-regular fa-calendar-check"></i>',
            )
        ]
    )
    BUSINESS_TRIP = MenuCommon(
        name='Business trip', code='menu_business', view_name='BusinessTripRequestList',
        icon='<i class="fa-solid fa-business-time"></i>',
    )


class MenusReport:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )
    SALE_REPORT = MenuCommon(
        name='Sale reports', code='menu_sale_reports', view_name='', icon='<i class="fas fa-chart-line"></i>',
        child=[
            MenuCommon(
                name='Revenue report',
                code='menu_report_revenue_list',
                view_name='ReportRevenueList',
                icon='<i class="fas fa-file-invoice-dollar"></i>',
            ),
            MenuCommon(
                name='Product report',
                code='menu_report_product_list',
                view_name='ReportProductList',
                icon='<i class="fas fa-box-open"></i>',
            ),
            MenuCommon(
                name='Customer report',
                code='menu_report_customer_list',
                view_name='ReportCustomerList',
                icon='<i class="fas fa-user-tie"></i>',
            ),
        ],
    )


# Space Setup
class SpaceCommon:
    name: str  # 'Sale'
    code: str  # 'sale'
    icon: str  # '<i class="fas fa-user-astronaut"></i>'
    child: list  # []
    menus: list  # []

    def __init__(self, name: str, code: str, icon: str = None, child: list = None, menus: list = None):
        self.name = name
        self.code = code
        self.icon = icon if icon else ''
        self.child = child if isinstance(child, list) else []
        self.menus = menus if isinstance(menus, list) else []

    @property
    def data_minimal(self):
        return {
            'name': self.name,
            'code': self.code,
            'icon': self.icon,
        }

    @property
    def data(self):
        return {
            'name': self.name,
            'code': self.code,
            'icon': self.icon,
            'child': [x.data for x in self.child],
        }

    @property
    def data_menus(self):
        return [x.data for x in self.menus]


class SpaceItem:
    mapping = {
        'crm': SpaceCommon(
            'CRM',
            'crm',
            icon='<i class="fa-solid fa-users-gear"></i>',
            menus=[
                MenusCRM.HOME,
                MenusCRM.CONTACT,
                MenusCRM.ACCOUNT,
                MenusCRM.LEAD,
                MenusCRM.OPPORTUNITY,
                MenusCRM.QUOTATION,
                MenusCRM.SALE_ORDER,
                MenusCRM.FINAL_ACCEPTANCE,
                MenusCRM.PRODUCT,
                MenusCRM.INVENTORY,
                MenusCRM.PRICING,
                MenusCRM.CASH_OUTFLOW,
                MenusCRM.SALE_ACTIVITIES,
                MenusCRM.TASK,
            ],
        ),
        'purchase': SpaceCommon(
            'Purchase',
            'purchase',
            icon='<i class="fas fa-cash-register"></i>',
            menus=[
                MenusPurchase.HOME,
                MenusPurchase.PURCHASE,
                MenusPurchase.INVENTORY
            ],
        ),
        'hrm': SpaceCommon(
            'HRM',
            'hrm',
            icon='<i class="fa-solid fa-user-tag"></i>',
            menus=[],
        ),
        'e-office': SpaceCommon(
            'E-office',
            'e-office',
            icon='<i class="fa-solid fa-laptop-file"></i>',
            menus=[
                MenuEOffice.LEAVE,
                MenuEOffice.BUSINESS_TRIP,
            ],
        ),
        'report': SpaceCommon(
            'Report',
            'report',
            icon='<i class="fas fa-chart-line"></i>',
            menus=[
                MenusReport.HOME,
                MenusReport.SALE_REPORT,
            ],
        ),
        'company-system': SpaceCommon(
            'Company',
            'company-system',
            icon='<i class="far fa-building"></i>',
            menus=[
                MenusCompanySystem.COMPANY_LIST,
                MenusCompanySystem.USER_LIST,
                MenusCompanySystem.ORG_CHART,
                MenusCompanySystem.WORKING_CALENDAR,
                MenusCompanySystem.WORKFLOW_PROCESS,
                MenusCompanySystem.TENANT_MANAGE,
                MenusCompanySystem.COMPANY_SITE_BUILDER,
            ],
        ),
        'core-configurations': SpaceCommon(
            'Settings',
            'core-configurations',
            icon='<i class="fa-solid fa-screwdriver-wrench"></i>',
            menus=[
                MenusCoreConfigurations.MASTER_DATA_CONFIG,
                MenusCoreConfigurations.TRANSITION_DATA_CONFIG,
            ],
        )
    }

    @classmethod
    def get_space_detail(cls, space_code):
        if space_code in cls.mapping:
            return cls.mapping[space_code].data_minimal
        return {}

    @classmethod
    def get_menus_of_space(cls, space_code):
        if space_code in cls.mapping:
            return cls.mapping[space_code].data_menus
        return None


class SpaceGroup:
    SPACE = SpaceCommon(
        'Space', 'space', child=[
            SpaceItem.mapping['crm'],
            SpaceItem.mapping['purchase'],
            SpaceItem.mapping['hrm'],
            SpaceItem.mapping['e-office'],
            SpaceItem.mapping['report'],
        ]
    )
    CORE_SETTINGS = SpaceCommon(
        'Core', 'core_settings', child=[
            SpaceItem.mapping['company-system'],
            SpaceItem.mapping['core-configurations'],
        ]
    )

    @classmethod
    def get_space_all(cls):
        return [
            cls.SPACE.data,
            cls.CORE_SETTINGS.data,
        ]


# 1. GET space group all
# SpaceGroup.get_space_all()

# 2. GET menus by space selected
#   SpaceItem.get_menus_of_space('company-system')
