__all__ = [
    'SpaceGroup',
    'SpaceItem',
]

from typing import Union
from urllib.parse import urlencode

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
            self,
            name: str, code: str,
            view_name: Union[str, None] = None,
            icon: str = None,
            child: list = None,
            params: dict[str, any] = None,
            expanded: bool = False,
    ):
        self.name = name
        self.code = code
        self.view_name = view_name
        self.icon = icon if icon else ''
        self.child = child if isinstance(child, list) else []
        self.params = params if isinstance(params, dict) else {}
        self.expanded = expanded

    @property
    def data(self):
        url = reverse(self.view_name) if self.view_name and self.view_name != '#' else '#'
        if self.params:
            url += '?' + urlencode(self.params)
        return {
            'name': self.name,
            'code': self.code if self.code else RandomGenerate.get_string(length=32),
            'view_name': self.view_name,
            'url': url,
            'icon': self.icon,
            'expanded': self.expanded,
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
        icon='<i class="far fa-calendar"></i>',
    )
    WORKFLOW_PROCESS = MenuCommon(
        name='Process Management', code='menu_process_management', icon='<i class="fab fa-stumbleupon-circle"></i>',
        child=[
            MenuCommon(
                name='Workflow', code='menu_workflow_list', view_name='WorkflowList',
                icon='<i class="fas fa-shapes"></i>'
            ),
            MenuCommon(
                name='Business Process', code='menu_process', view_name='ProcessList',
                icon='<i class="fa-solid fa-microchip"></i>',
            ),
            MenuCommon(
                name='Automation', code='', view_name='#', icon='<i class="fas fa-robot"></i>',
            ),
        ]
    )
    PROCESS = MenuCommon(
        name='Process', code='process_group', icon='<i class="fa-solid fa-microchip"></i>',
        expanded=True,
        child=[
            MenuCommon(
                name='Business Process', code='menu_process', view_name='ProcessList',
                icon='<i class="fa-solid fa-microchip"></i>',
            ),
            MenuCommon(
                name='My Process Runtime',
                code='menu_process_runtime',
                view_name='ProcessRuntimeListMeRedirect',
                icon='<i class="fa-solid fa-microchip"></i>',
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
    SYSTEM_CONFIG = MenuCommon(
        name='System', code='menu_system', view_name='#',
        icon='<i class="fas fa-cogs"></i>',
        child=[
            MenuCommon(
                name='Posting periods', code='id_menu_master_data_periods_config', view_name='PeriodsConfigList',
                icon='<i class="far fa-calendar-alt"></i>',
            ),
        ]
    )
    MASTER_DATA_CONFIG = MenuCommon(
        name='Master data config', code='menu_masterdata', view_name='#',
        icon='<i class="fas fa-crown"></i>',
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
            MenuCommon(
                name='Document', code='id_menu_master_data_document', view_name='DocumentTypeMasterDataList',
                icon='<i class="bi bi-currency-exchange"></i>',
            )
        ]
    )
    TRANSITION_DATA_CONFIG = MenuCommon(
        name='Transition data config', code='menu_transition_data_config', view_name='#',
        icon='<i class="fas fa-exchange-alt"></i>',
        child=[
            MenuCommon(
                name='Balance initialization', code='menu_balance_init', view_name='BalanceInitList',
                icon='<i class="fas fa-balance-scale"></i>',
            ),
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
            MenuCommon(
                name='Asset, Tools', code='menu_asset_tools_config', view_name='AssetToolsConfigView',
                icon='<i class="fa-solid fa-pen-ruler"></i>',
            ),
            MenuCommon(
                name='Meeting', code='id_menu_master_data_meeting_config', view_name='MeetingConfigList',
                icon='<i class="fas fa-chalkboard-teacher"></i>',
            ),
            MenuCommon(
                name='Revenue plan config', code='id_menu_master_data_revenue_plan_config', view_name='RevenuePlanConfigList',
                icon='<i class="fas fa-hand-holding-usd"></i>',
            ),
            MenuCommon(
                name='Budget plan config', code='id_menu_master_data_budget_plan_config',
                view_name='BudgetPlanConfigList',
                icon='<i class="fas fa-wallet"></i>',
            ),
            MenuCommon(
                name='Invoice form config', code='menu_invoice_sign',
                view_name='InvoiceSignList',
                icon='<i class="fas fa-signature"></i>',
            ),
            MenuCommon(
                name='Project config', code='menu_project_config',
                view_name='ProjectConfig',
                icon='<i class="fa-brands fa-r-project"></i>',
            ),
        ]
    )
    TEMPLATES_DATA_CONFIG = MenuCommon(
        name='Templates', code='menu_templates', view_name='#',
        icon='<i class="fa-solid fa-swatchbook"></i>',
        child=[
            MenuCommon(
                name='Print Template', code='menu_print_template', view_name='PrintTemplatesListView',
                icon='<i class="fa-solid fa-print"></i>'
            ),
            MenuCommon(
                name='Mail Template', code='menu_mail_template', view_name='MailTemplatesListView',
                icon='<i class="fa-regular fa-envelope"></i>'
            ),
            MenuCommon(
                name='Import Data', code='menu_import_data', view_name='FImportCreateView',
                icon='<i class="fa-solid fa-file-import"></i>'
            ),
        ]
    )
    INVENTORY_DATA_CONFIG = MenuCommon(
        name='Inventory interact config', code='menu_inventory_interact_config', view_name='InventoryInteractConfigList',
        icon='<i class="fa-solid fa-arrow-right-to-bracket"></i>'
    )


class MenusForms:
    FORM_DATA_CONFIG = MenuCommon(
        name='Forms',
        code='menu_form_data',
        view_name='FormListView',
        icon='<i class="fa-brands fa-wpforms"></i>'
    )


class MenusCRM:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView',
        icon='<i class="fas fa-home"></i>',
    )
    DASHBOARD = MenuCommon(
        name='Dashboard', code='id_menu_dashboard', view_name='#',
        icon='<i class="fas fa-chart-column"></i>',
        child=[
            MenuCommon(
                name='General', code='id_menu_dashboard_general', view_name='DashboardGeneralList',
                icon='<i class="fas fa-square-poll-vertical"></i>',
            ),
            MenuCommon(
                name='Pipeline', code='id_menu_dashboard_pipeline', view_name='DashboardPipelineList',
                icon='<i class="fas fa-chart-bar"></i>',
            ),
        ],
    )
    PLANNING = MenuCommon(
        name='Planning', code='id_menu_planning', view_name='#',
        icon='<i class="fas fa-scroll"></i>',
        child=[
            MenuCommon(
                name='Revenue plan', code='menu_revenue_plan_list', view_name='RevenuePlanList',
                icon='<i class="fas fa-circle-dollar-to-slot"></i>',
            ),
            MenuCommon(
                name='Budget plan', code='menu_budget_plan_list', view_name='BudgetPlanList',
                icon='<i class="fas fa-wallet"></i>',
            )
        ],
    )
    LEAD = MenuCommon(
        name='Lead', code='menu_lead_list', view_name='LeadList',
        icon='<i class="far fa-star"></i>',
    )
    CALENDAR = MenuCommon(
        name='Calendar', code='menu_calendar', view_name='ProgrammeList',
        icon='<i class="far fa-calendar"></i>',
    )
    CONTACT = MenuCommon(
        name='Contact', code='id_menu_contact', view_name='ContactList',
        icon='<i class="bi bi-journal-bookmark-fill"></i>',
    )
    ACCOUNT = MenuCommon(
        name='Account', code='id_menu_account', view_name='AccountList',
        icon='<i class="fas fa-book-open-reader"></i>',
    )
    OPPORTUNITY = MenuCommon(
        name='Opportunity', code='menu_opportunity_list', view_name='OpportunityList',
        icon='<i class="far fa-lightbulb"></i>',
    )
    QUOTATION = MenuCommon(
        name='Quotation', code='menu_quotation_list', view_name='QuotationList',
        icon='<i class="fas fa-file-invoice-dollar"></i>',
    )
    BIDDING = MenuCommon(
        name='Bidding', code='menu_bidding_list', view_name='BiddingList',
        icon='<i class="fas fa-gavel"></i>',
    )
    SALE_ORDER = MenuCommon(
        name='Sale order', code='menu_sale_order_list', view_name='SaleOrderList',
        icon='<i class="fas fa-file-invoice"></i>',
    )
    WORK_ORDER = MenuCommon(
        name='Work order', code='menu_work_order_list', view_name='WorkOrderList',
        icon='<i class="fas fa-pencil-ruler"></i>',
    )
    AR_INVOICE = MenuCommon(
        name='AR invoice', code='id_menu_ar_invoice', view_name='ARInvoiceList',
        icon='<i class="bi bi-receipt"></i>',
    )
    FINAL_ACCEPTANCE = MenuCommon(
        name='Final acceptance', code='menu_final_acceptance_list', view_name='FinalAcceptanceList',
        icon='<i class="fas fa-file-alt"></i>',
    )
    CONTRACT_APPROVAL = MenuCommon(
        name='Contract approval', code='menu_contract_approval_list', view_name='ContractApprovalList',
        icon='<i class="fas fa-file-signature"></i>',
    )
    PRODUCT = MenuCommon(
        name='Product', code='id_menu_product_list', view_name='ProductList',
        icon='<i class="bi bi-nut-fill"></i>',
    )
    PROJECT_BOM = MenuCommon(
        name='Project BOM', code='menu_project_bom_list', view_name='ProjectBOMList',
        icon='<i class="fas fa-dice"></i>',
    )
    PRICING = MenuCommon(
        name='Pricing', code='menu_pricing', view_name='',
        icon='<i class="bi bi-tags-fill"></i>',
        child=[
            MenuCommon(
                name='Price List', code='id_menu_pricing_list', view_name='PriceList',
                icon='<i class="fas fa-list-ol"></i>',
            ),
            MenuCommon(
                name='Shipping list', code='id_menu_shipping_list', view_name='ShippingList',
                icon='<i class="fas fa-shipping-fast"></i>',
            ),
            MenuCommon(
                name='Promotion List', code='id_menu_promotion_list', view_name='PromotionList',
                icon='<i class="fas fa-percent"></i>',
            ),
        ]
    )
    CASH_OUTFLOW = MenuCommon(
        name='Cashflow', code='menu_cash_outflow', view_name='',
        icon='<i class="fas fa-coins"></i>',
        child=[
            MenuCommon(
                name='Advance payment', code='id_menu_advance_payment', view_name='AdvancePaymentList',
                icon='<i class="fas fa-hand-holding-usd"></i>',
            ),
            MenuCommon(
                name='Payment', code='id_menu_payment', view_name='PaymentList',
                icon='<i class="far fa-credit-card"></i>',
            ),
            MenuCommon(
                name='Return advance', code='id_menu_return_advance', view_name='ReturnAdvanceList',
                icon='<i class="fas fa-hand-holding-usd fa-flip-horizontal"></i>',
            ),
        ],
    )
    SALE_ACTIVITIES = MenuCommon(
        name='Sale activities', code='menu_sale_activities', view_name='',
        icon='<i class="bi bi-ui-checks-grid"></i>',
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
                name='Document for customer', code='menu_opportunity_document',
                view_name='OpportunityDocumentList',
                icon='<i class="bi bi-file-earmark"></i>',
            ),

        ],
    )
    TASK = MenuCommon(
        name='Task', code='menu_opportunity_task', view_name='OpportunityTaskList',
        icon='<i class="fa-solid fa-list-check"></i>',
        child=[],
    )


class MenusPurchase:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )
    PURCHASE = MenuCommon(
        name='Purchasing', code='menu_purchase_activities', view_name='', icon='<i class="fas fa-cart-arrow-down"></i>',
        child=[
            MenuCommon(
                name='Goods stock plan', code='menu_distribution_plan_list', view_name='DistributionPlanList',
                icon='<i class="fas fa-expand-arrows-alt"></i>',
            ),
            MenuCommon(
                name='Purchase request',
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
            MenuCommon(
                name='AP invoice', code='id_menu_ap_invoice', view_name='APInvoiceList',
                icon='<i class="fas fa-file-invoice"></i>',
            )
        ],
    )


class MenusInventory:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )

    INVENTORY = MenuCommon(
        name='Inventory activities', code='menu_inventory_activities', view_name='', icon='<i class="fas fa-store"></i>',
        child=[
            MenuCommon(
                name='WareHouses', code='menu_warehouse_list', view_name='WareHouseList',
                icon='<i class="fas fa-warehouse"></i>',
            ),
            MenuCommon(
                name='Picking', code='menu_order_picking_list', view_name='OrderPickingList',
                icon='<i class="fas fa-box"></i>',
            ),
            MenuCommon(
                name='Delivery', code='menu_order_delivery_list', view_name='OrderDeliveryList',
                icon='<i class="fas fa-truck-pickup"></i>',
            ),
            MenuCommon(
                name='Goods receipt',
                code='menu_goods_receipt_list',
                view_name='GoodsReceiptList',
                icon='<i class="fas fa-file-import"></i>',
            ),
            MenuCommon(
                name='Goods registration',
                code='menu_goods_registration_list',
                view_name='GoodsRegistrationList',
                icon='<i class="bi bi-ui-radios-grid"></i>',
            ),
            MenuCommon(
                name='Goods detail',
                code='menu_goods_detail_list',
                view_name='GoodsDetail',
                icon='<i class="bi bi-info-square"></i>',
            ),
            MenuCommon(
                name='Goods issue',
                code='menu_goods_issue_list',
                view_name='GoodsIssueList',
                icon='<i class="fas fa-file-export"></i>',
            ),
            MenuCommon(
                name='Goods return',
                code='menu_goods_return',
                view_name='GoodsReturnList',
                icon='<i class="far fa-arrow-alt-circle-left"></i>',
            ),
            MenuCommon(
                name='Goods transfer',
                code='menu_goods_transfer_list',
                view_name='GoodsTransferList',
                icon='<i class="fas fa-exchange-alt"></i>',
            ),
            MenuCommon(
                name='Inventory adjustment',
                code='menu_inventory_adjustment_list',
                view_name='InventoryAdjustmentList',
                icon='<i class="bi bi-sliders"></i>',
            ),
        ],
    )


class MenuEOffice:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )
    CALENDAR = MenuCommon(
        name='Calendar', code='menu_calendar', view_name='ProgrammeList', icon='<i class="far fa-calendar"></i>',
    )
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
    ASSET_TOOLS = MenuCommon(
        name='Asset, tools', code='menu_asset_tools', icon='<i class="fa-solid fa-pen-ruler"></i>',
        child=[
            MenuCommon(
                name='Provide request', code='menu_asset_provide', view_name='AssetToolsProvideRequestList',
                icon='<i class="fa-solid fa-hand-holding"></i>',
            ),
            MenuCommon(
                name='Asset, tools delivery', code='menu_asset_delivery', view_name='AssetToolsDeliveryList',
                icon='<i class="fa-solid fa-truck-fast"></i>',
            ),
            MenuCommon(
                name='Asset, tools list', code='menu_asset_list', view_name='AssetToolsList',
                icon='<i class="fa-solid fa-list"></i>',
            ),
            MenuCommon(
                name='Asset, tools return list', code='menu_asset_return', view_name='AssetToolsReturnList',
                icon='<i class="fa-solid fa-backward-fast"></i>',
            ),
        ]
    )
    MEETING = MenuCommon(
        name='Meeting', code='menu_meeting_list', view_name='MeetingScheduleList',
        icon='<i class="fas fa-chalkboard-teacher"></i>',
    )


class MenuDMS:
    WORK_SPACE = MenuCommon(
        name='Work space', code='menu_dms_work_space', view_name='', icon='<i class="fas fa-laptop-house"></i>',
        child=[
            MenuCommon(
                name='File',
                code='menu_folder_list',
                view_name='FolderList',
                icon='<i class="fas fa-file"></i>',
            )
        ],
    )
    MY_SPACE = MenuCommon(
        name='My space', code='menu_dms_my_space', view_name='', icon='<i class="fas fa-user"></i>',
        child=[],
    )


class MenusReport:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )
    SALE_REPORT = MenuCommon(
        name='Sale reports', code='menu_sale_reports', view_name='', icon='<i class="fas fa-balance-scale"></i>',
        child=[
            MenuCommon(
                name='Pipeline report',
                code='menu_report_pipeline_list',
                view_name='ReportPipelineList',
                icon='<i class="bi bi-dot"></i>',
            ),
            MenuCommon(
                name='Revenue report',
                code='menu_report_revenue_list',
                view_name='ReportRevenueList',
                icon='<i class="bi bi-dot"></i>',
            ),
            MenuCommon(
                name='General revenue report',
                code='menu_report_general_list',
                view_name='ReportGeneralList',
                icon='<i class="bi bi-dot"></i>',
            ),
            MenuCommon(
                name='Product report',
                code='menu_report_product_list',
                view_name='ReportProductList',
                icon='<i class="bi bi-dot"></i>',
            ),
            MenuCommon(
                name='Customer report',
                code='menu_report_customer_list',
                view_name='ReportCustomerList',
                icon='<i class="bi bi-dot"></i>',
            ),
            MenuCommon(
                name='Cashflow report',
                code='menu_report_cashflow_list',
                view_name='ReportCashflowList',
                icon='<i class="bi bi-dot"></i>',
            ),
            MenuCommon(
                name='Budget report',
                code='menu_budget_report',
                view_name='BudgetReportList',
                icon='<i class="bi bi-dot"></i>',
            ),
        ],
    )
    INVENTORY_REPORT = MenuCommon(
        name='Inventory reports', code='menu_inventory_reports', view_name='', icon='<i class="fas fa-warehouse"></i>',
        child=[
            MenuCommon(
                name='Inventory report',
                code='menu_inventory_report',
                view_name='ReportInventoryList',
                icon='<i class="bi bi-dot"></i>',
            ),
            MenuCommon(
                name='Items detail report',
                code='menu_items_detail_report',
                view_name='ReportInventoryDetailList',
                icon='<i class="bi bi-dot"></i>',
            ),
        ],
    )
    PURCHASING_REPORT = MenuCommon(
        name='Purchasing reports', code='menu_purchasing_reports', view_name='', icon='<i class="fas fa-boxes"></i>',
        child=[
            MenuCommon(
                name='Purchase order report',
                code='menu_po_report',
                view_name='PurchaseOrderReportList',
                icon='<i class="bi bi-dot"></i>',
            ),
        ],
    )


class MenusProject:
    HOME = MenuCommon(
        name='Project home', code='id_menu_project_home', view_name='ProjectHome', icon='<i class="fas fa-home"></i>',
    )
    LIST = MenuCommon(
        name='Project list', code='menu_project', view_name='ProjectList',
        icon='<i class="fa-solid fa-bars-progress"></i>',
    )
    ACTIVITIES = MenuCommon(
        name='Project activities', code='menu_project_activities', view_name='ProjectActivities',
        icon='<i class="fa-solid fa-fire-flame-curved"></i>',
    )
    TASKS = MenuCommon(
        name='Project task list', code='menu_project_task_list', view_name='ProjectTaskList',
        icon='<i class="fa-solid fa-list"></i>',
    )


class MenusProduction:
    HOME = MenuCommon(
        name='Home', code='id_menu_home_page', view_name='HomeView', icon='<i class="fas fa-home"></i>',
    )
    PRODUCTION = MenuCommon(
        name='Production', code='menu_purchase_activities', view_name='', icon='<i class="bi bi-robot"></i>',
        child=[
            MenuCommon(
                name='Production BOM', code='menu_bom_list', view_name='BOMList',
                icon='<i class="fab fa-connectdevelop"></i>',
            ),
            MenuCommon(
                name='Production order',
                code='menu_production_order_list',
                view_name='ProductionOrderList',
                icon='<i class="fas fa-boxes"></i>',
            ),
            MenuCommon(
                name='Production report',
                code='menu_production_report_list',
                view_name='ProductionReportList',
                icon='<i class="fas fa-tasks"></i>',
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
            'Sales',
            'crm',
            icon='<i class="fa-solid fa-users-gear"></i>',
            menus=[
                MenusCRM.HOME,
                MenusCRM.DASHBOARD,
                MenusCRM.PLANNING,
                MenusCRM.LEAD,
                MenusCRM.CALENDAR,
                MenusCRM.CONTACT,
                MenusCRM.ACCOUNT,
                MenusCRM.OPPORTUNITY,
                MenusCRM.QUOTATION,
                MenusCRM.BIDDING,
                MenusCRM.AR_INVOICE,
                MenusCRM.SALE_ORDER,
                MenusCRM.WORK_ORDER,
                MenusCRM.FINAL_ACCEPTANCE,
                MenusCRM.CONTRACT_APPROVAL,
                MenusCRM.PRODUCT,
                MenusCRM.PROJECT_BOM,
                MenusCRM.PRICING,
                MenusCRM.CASH_OUTFLOW,
                MenusCRM.SALE_ACTIVITIES,
                MenusCRM.TASK,
            ],
        ),
        'kms': SpaceCommon(
            'KMS',
            'kms',
            icon='<i class="far fa-folder-open"></i>',
            menus=[
                MenuDMS.WORK_SPACE,
                MenuDMS.MY_SPACE,
            ],
        ),
        'e-office': SpaceCommon(
            'E-office',
            'e-office',
            icon='<i class="fa-solid fa-laptop-file"></i>',
            menus=[
                MenuEOffice.HOME,
                MenuEOffice.CALENDAR,
                MenuEOffice.LEAVE,
                MenuEOffice.BUSINESS_TRIP,
                MenuEOffice.ASSET_TOOLS,
                MenuEOffice.MEETING,
            ],
        ),
        'forms': SpaceCommon(
            'Forms',
            'forms',
            icon='<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3.586 2.586C3 3.172 3 4.114 3 6v10c0 2.828 0 4.243.879 5.121.641.642 1.568.815 3.121.862V19a1 1 0 1 1 2 0v3h6v-3a1 1 0 1 1 2 0v2.983c1.553-.047 2.48-.22 3.121-.862C21 20.243 21 18.828 21 16V6c0-1.886 0-2.828-.586-3.414S18.886 2 17 2H7c-1.886 0-2.828 0-3.414.586M8 8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zm0 6h8a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2"/></svg>',
            menus=[
                MenusForms.FORM_DATA_CONFIG,
            ]
        ),
        'hrm': SpaceCommon(
            'HRM',
            'hrm',
            icon='<i class="fa-solid fa-user-tag"></i>',
            menus=[],
        ),
        'inventory': SpaceCommon(
            'Inventory',
            'inventory',
            icon='<i class="fas fa-warehouse"></i>',
            menus=[
                MenusPurchase.HOME,
                MenusInventory.INVENTORY,
            ],
        ),
        'purchase': SpaceCommon(
            'Purchasing',
            'purchase',
            icon='<i class="fas fa-cash-register"></i>',
            menus=[
                MenusPurchase.HOME,
                MenusPurchase.PURCHASE,
            ],
        ),
        'production': SpaceCommon(
            'Production',
            'production',
            icon='<i class="bi bi-robot"></i>',
            menus=[
                MenusProduction.HOME,
                MenusProduction.PRODUCTION,
            ]
        ),
        'project': SpaceCommon(
            'Project',
            'project',
            icon='<i class="fa-solid fa-weight-scale"></i>',
            menus=[
                MenusProject.HOME,
                MenusProject.LIST,
                MenusProject.ACTIVITIES,
                MenusProject.TASKS,
            ]
        ),
        'report': SpaceCommon(
            'Report',
            'report',
            icon='<i class="fas fa-table"></i>',
            menus=[
                MenusReport.HOME,
                MenusReport.SALE_REPORT,
                MenusReport.INVENTORY_REPORT,
                MenusReport.PURCHASING_REPORT,
            ],
        ),
        'definition': SpaceCommon(
            'Definition',
            'definition',
            icon='<i class="fa-solid fa-square-pen"></i>',
            menus=[
                MenusCompanySystem.WORKFLOW_PROCESS.child[0],
                MenusCompanySystem.PROCESS,
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
            icon='<i class="fas fa-cog"></i>',
            menus=[
                MenusCoreConfigurations.SYSTEM_CONFIG,
                MenusCoreConfigurations.MASTER_DATA_CONFIG,
                MenusCoreConfigurations.TRANSITION_DATA_CONFIG,
                MenusCoreConfigurations.TEMPLATES_DATA_CONFIG,
                MenusCoreConfigurations.INVENTORY_DATA_CONFIG
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
            # SpaceItem.mapping['kms'],
            SpaceItem.mapping['e-office'],
            SpaceItem.mapping['forms'],
            # SpaceItem.mapping['hrm'],
            SpaceItem.mapping['inventory'],
            SpaceItem.mapping['purchase'],
            SpaceItem.mapping['production'],
            SpaceItem.mapping['project'],
            SpaceItem.mapping['report'],
            SpaceItem.mapping['definition'],
        ]
    )
    CORE_SETTINGS = SpaceCommon(
        'Core', 'core_settings', child=[
            SpaceItem.mapping['company-system'],
            SpaceItem.mapping['core-configurations'],
        ]
    )

    @classmethod
    def get_space_all(cls, is_hide_core: bool = True):
        result = [cls.SPACE.data]
        if is_hide_core is False:
            result.append(cls.CORE_SETTINGS.data)
        return result


# 1. GET space group all
# SpaceGroup.get_space_all()

# 2. GET menus by space selected
#   SpaceItem.get_menus_of_space('company-system')
