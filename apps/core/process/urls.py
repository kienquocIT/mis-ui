from django.urls import path

from apps.core.process.views import SaleProcess, FunctionProcessListAPI

urlpatterns = [
    path('', SaleProcess.as_view(), name='SaleProcess'),
    path('function/list/api', FunctionProcessListAPI.as_view(), name='FunctionProcessListAPI'),
]
