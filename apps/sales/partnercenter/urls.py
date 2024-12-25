from django.urls import path

from apps.sales.partnercenter.views import ListCreate, ListList, ListDataObjectListAPI, ListListAPI

list_urlpatterns = [
    path('list/list', ListList.as_view(), name='ListList'),
    path('list/create', ListCreate.as_view(), name='ListCreate'),

    path('api/data-obj-list', ListDataObjectListAPI.as_view(), name='ListDataObjectListAPI'),
    path('api/list/list', ListListAPI.as_view(), name='ListListAPI'),

]

urlpatterns = list_urlpatterns