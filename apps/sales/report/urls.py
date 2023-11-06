from django.urls import path

from apps.sales.report.views import ReportRevenueList, ReportRevenueListAPI

urlpatterns = [
    path('revenue', ReportRevenueList.as_view(), name='ReportRevenueList'),
    path('api/revenue', ReportRevenueListAPI.as_view(), name='ReportRevenueListAPI'),
]
