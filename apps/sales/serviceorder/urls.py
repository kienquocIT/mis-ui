from django.urls import path
from . import views
from .views import ServiceOrderListAPI, ServiceOrderDetail

urlpatterns = [
    # Render Views - HTML page rendering
    path('', views.ServiceOrderList.as_view(), name='ServiceOrderList'),
    path('create', views.ServiceOrderCreate.as_view(), name='ServiceOrderCreate'),

    # API Views - Data operations (render view + "/api")
    path('list/api', ServiceOrderListAPI.as_view(), name='ServiceOrderListAPI'),
    path('detail/<str:pk>', ServiceOrderDetail.as_view(), name='ServiceOrderDetail'),
]
