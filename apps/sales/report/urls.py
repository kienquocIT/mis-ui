from django.urls import path

from apps.sales.report.views import (
    ReportRevenueList, ReportRevenueListAPI, ReportProductList, ReportProductListAPI,
    ReportCustomerList, ReportCustomerListAPI,
    ReportInventoryDetailList, ReportPipelineList, ReportPipelineListAPI,
    ReportCashflowList, ReportCashflowListAPI, ReportInventoryDetailListAPI
)

urlpatterns = [
    path('revenue', ReportRevenueList.as_view(), name='ReportRevenueList'),
    path('api/revenue', ReportRevenueListAPI.as_view(), name='ReportRevenueListAPI'),
    path('product', ReportProductList.as_view(), name='ReportProductList'),
    path('api/product', ReportProductListAPI.as_view(), name='ReportProductListAPI'),
    path('customer', ReportCustomerList.as_view(), name='ReportCustomerList'),
    path('api/customer', ReportCustomerListAPI.as_view(), name='ReportCustomerListAPI'),
    path('pipeline', ReportPipelineList.as_view(), name='ReportPipelineList'),
    path('api/pipeline', ReportPipelineListAPI.as_view(), name='ReportPipelineListAPI'),
    path('cashflow', ReportCashflowList.as_view(), name='ReportCashflowList'),
    path('api/cashflow', ReportCashflowListAPI.as_view(), name='ReportCashflowListAPI'),

    path('inventory-detail', ReportInventoryDetailList.as_view(), name='ReportInventoryDetailList'),
    path('api/inventory-detail', ReportInventoryDetailListAPI.as_view(), name='ReportInventoryDetailListAPI'),
]
