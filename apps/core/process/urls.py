from django.urls import path

from apps.core.process.views import SaleProcess, FunctionProcessListAPI, SaleProcessAPI, SkipProcessStepAPI, \
    SetCurrentProcessStepAPI

urlpatterns = [
    path('', SaleProcess.as_view(), name='SaleProcess'),
    path('api', SaleProcessAPI.as_view(), name='SaleProcessAPI'),
    path('function/list/api', FunctionProcessListAPI.as_view(), name='FunctionProcessListAPI'),
    path('step/skip/api/<str:pk>', SkipProcessStepAPI.as_view(), name='SkipProcessStepAPI'),
    path('step/set-current/api/<str:pk>', SetCurrentProcessStepAPI.as_view(), name='SetCurrentProcessStepAPI'),
]
