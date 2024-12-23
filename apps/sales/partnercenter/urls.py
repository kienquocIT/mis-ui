from django.urls import path

from apps.sales.partnercenter.views import ListCreate, ListList

list_urlpatterns = [
    path('list/list', ListList.as_view(), name='ListList'),
    path('list/create', ListCreate.as_view(), name='ListCreate'),
]

urlpatterns = list_urlpatterns