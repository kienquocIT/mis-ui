from django.urls import path

from apps.sales.report.views import ReportRevenueList, ReportRevenueListAPI, ReportProductList, ReportProductListAPI, \
    ReportCustomerList, ReportCustomerListAPI

urlpatterns = [
    path('revenue', ReportRevenueList.as_view(), name='ReportRevenueList'),
    path('api/revenue', ReportRevenueListAPI.as_view(), name='ReportRevenueListAPI'),
    path('product', ReportProductList.as_view(), name='ReportProductList'),
    path('api/product', ReportProductListAPI.as_view(), name='ReportProductListAPI'),
    path('customer', ReportCustomerList.as_view(), name='ReportCustomerList'),
    path('api/customer', ReportCustomerListAPI.as_view(), name='ReportCustomerListAPI'),
]
