from django.urls import path
from .views import ServiceQuotationListAPI, ServiceQuotationCreate, ServiceQuotationList

urlpatterns = [
    # Render Views - HTML page rendering
    path('', ServiceQuotationList.as_view(), name='ServiceQuotationList'),
    path('create', ServiceQuotationCreate.as_view(), name='ServiceQuotationCreate'),
    # path('detail', views.ServiceOrderDetail.as_view(), name='ServiceOrderDetail'),
    # path('update', views.ServiceOrderUpdate.as_view(), name='ServiceOrderUpdate'),

    # API Views - Data operations (render view + "/api")
    path('list/api', ServiceQuotationListAPI.as_view(), name='ServiceQuotationListAPI'),
    # path('detail/<str:pk>', ServiceOrderDetail.as_view(), name='ServiceOrderDetail'),
    # path('detail/api/<str:pk>', ServiceOrderDetailAPI.as_view(), name='ServiceOrderDetailAPI'),
    # path('update/<str:pk>', ServiceOrderUpdate.as_view(), name='ServiceOrderUpdate'),
    # path('dashboard', ServiceOrderDetailDashboard.as_view(), name='ServiceOrderDetailDashboard'),
    # path('dashboard/api/<str:pk>', ServiceOrderDetailDashboardAPI.as_view(), name='ServiceOrderDetailDashboardAPI'),
]
