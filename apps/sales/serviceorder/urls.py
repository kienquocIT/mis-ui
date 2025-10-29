from django.urls import path
from . import views
from .views import (
    ServiceOrderListAPI, ServiceOrderDetail, ServiceOrderUpdate, ServiceOrderDetailAPI,
    ServiceOrderDetailDashboardAPI, ServiceOrderDetailDashboard, SVOWorkOrderDetailAPI, ServiceOrderDetailDeliveryAPI,
    ServiceOrderDiffListAPI,
)

urlpatterns = [
    # Render Views - HTML page rendering
    path('', views.ServiceOrderList.as_view(), name='ServiceOrderList'),
    path('create', views.ServiceOrderCreate.as_view(), name='ServiceOrderCreate'),
    path('detail', views.ServiceOrderDetail.as_view(), name='ServiceOrderDetail'),
    path('update', views.ServiceOrderUpdate.as_view(), name='ServiceOrderUpdate'),

    # API Views - Data operations (render view + "/api")
    path('list/api', ServiceOrderListAPI.as_view(), name='ServiceOrderListAPI'),
    path('detail/<str:pk>', ServiceOrderDetail.as_view(), name='ServiceOrderDetail'),
    path('detail/api/<str:pk>', ServiceOrderDetailAPI.as_view(), name='ServiceOrderDetailAPI'),
    path('update/<str:pk>', ServiceOrderUpdate.as_view(), name='ServiceOrderUpdate'),
    path('dashboard', ServiceOrderDetailDashboard.as_view(), name='ServiceOrderDetailDashboard'),
    path('dashboard/api/<str:pk>', ServiceOrderDetailDashboardAPI.as_view(), name='ServiceOrderDetailDashboardAPI'),
    path('work-order-detail/api', SVOWorkOrderDetailAPI.as_view(), name='SVOWorkOrderDetailAPI'),
    path('detail-api/<str:pk>/delivery', ServiceOrderDetailDeliveryAPI.as_view(), name='ServiceOrderDetailDeliveryAPI'),
    path('diff/api/<str:current_id>/<str:comparing_id>', ServiceOrderDiffListAPI.as_view(), name='ServiceOrderDiffListAPI'),
]
