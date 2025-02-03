from django.urls import path

from apps.sales.report.views import (
    ReportRevenueList, ReportRevenueListAPI, ReportProductList, ReportProductListAPI,
    ReportCustomerList, ReportCustomerListAPI,
    ReportInventoryDetailList, ReportPipelineList, ReportPipelineListAPI,
    ReportCashflowList, ReportCashflowListAPI, ReportInventoryDetailListAPI,
    ReportInventoryList, ReportInventoryListAPI, ReportGeneralList, ReportGeneralListAPI,
    PurchaseOrderReportList, PurchaseOrderReportListAPI, ReportInventoryProductWarehouseViewAPI, BudgetReportList,
    BudgetReportCompanyListAPI, PaymentListForBudgetReportAPI, BudgetReportGroupListAPI, GetQRCodeSerialInfoAPI,
    GetQRCodeLotInfoAPI,
    ReportInventoryAskAPI, ReportProductListAPIRDashBoard, AdvanceFilterListAPI, AdvanceFilterDetailAPI
)

urlpatterns = [
    # report sale
    path('revenue', ReportRevenueList.as_view(), name='ReportRevenueList'),
    path('api/revenue', ReportRevenueListAPI.as_view(), name='ReportRevenueListAPI'),
    path('product', ReportProductList.as_view(), name='ReportProductList'),
    path('api/product', ReportProductListAPI.as_view(), name='ReportProductListAPI'),
    path('api/product-for-dashboard', ReportProductListAPIRDashBoard.as_view(), name='ReportProductListAPIRDashBoard'),
    path('customer', ReportCustomerList.as_view(), name='ReportCustomerList'),
    path('api/customer', ReportCustomerListAPI.as_view(), name='ReportCustomerListAPI'),
    path('pipeline', ReportPipelineList.as_view(), name='ReportPipelineList'),
    path('api/pipeline', ReportPipelineListAPI.as_view(), name='ReportPipelineListAPI'),
    path('cashflow', ReportCashflowList.as_view(), name='ReportCashflowList'),
    path('api/cashflow', ReportCashflowListAPI.as_view(), name='ReportCashflowListAPI'),
    path('general', ReportGeneralList.as_view(), name='ReportGeneralList'),
    path('api/general', ReportGeneralListAPI.as_view(), name='ReportGeneralListAPI'),

    # report inventory
    path('inventory-detail', ReportInventoryDetailList.as_view(), name='ReportInventoryDetailList'),
    path('api/inventory-detail', ReportInventoryDetailListAPI.as_view(), name='ReportInventoryDetailListAPI'),
    path('inventory', ReportInventoryList.as_view(), name='ReportInventoryList'),
    path('api/inventory', ReportInventoryListAPI.as_view(), name='ReportInventoryListAPI'),
    path('api/product-warehouse-view', ReportInventoryProductWarehouseViewAPI.as_view(), name='ReportInventoryProductWarehouseViewAPI'),
    path('get-qr-code-sn-info', GetQRCodeSerialInfoAPI.as_view(), name='GetQRCodeSerialInfoAPI'),
    path('get-qr-code-lot-info', GetQRCodeLotInfoAPI.as_view(), name='GetQRCodeLotInfoAPI'),
    path('report-inventory-ask', ReportInventoryAskAPI.as_view(), name='ReportInventoryAskAPI'),

    # report purchasing
    path('po-report', PurchaseOrderReportList.as_view(), name='PurchaseOrderReportList'),
    path('api/po-report', PurchaseOrderReportListAPI.as_view(), name='PurchaseOrderReportListAPI'),

    # budget report
    path('budget-report', BudgetReportList.as_view(), name='BudgetReportList'),
    path('api/budget-report-company', BudgetReportCompanyListAPI.as_view(), name='BudgetReportCompanyListAPI'),
    path('api/budget-report-group', BudgetReportGroupListAPI.as_view(), name='BudgetReportGroupListAPI'),
    path('api/budget-report-payment', PaymentListForBudgetReportAPI.as_view(), name='PaymentListForBudgetReportAPI'),

    # advance filter
    path('api/advance-filter/list', AdvanceFilterListAPI.as_view(), name='AdvanceFilterListAPI'),
    path('api/advance-filter/detail/<str:pk>', AdvanceFilterDetailAPI.as_view(), name='AdvanceFilterDetailAPI')
]
