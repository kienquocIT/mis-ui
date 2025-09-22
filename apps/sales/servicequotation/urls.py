from django.urls import path
from .views import ServiceQuotationListAPI, ServiceQuotationCreate, ServiceQuotationList, ServiceQuotationDetail, \
    ServiceQuotationDetailAPI, ServiceQuotationUpdate

urlpatterns = [
    # Render Views - HTML page rendering
    path('', ServiceQuotationList.as_view(), name='ServiceQuotationList'),
    path('create', ServiceQuotationCreate.as_view(), name='ServiceQuotationCreate'),
    path('detail/<str:pk>', ServiceQuotationDetail.as_view(), name='ServiceQuotationDetail'),
    path('update/<str:pk>', ServiceQuotationUpdate.as_view(), name='ServiceQuotationUpdate'),

    # API Views - Data operations (render view + "/api")
    path('list/api', ServiceQuotationListAPI.as_view(), name='ServiceQuotationListAPI'),
    path('detail/api/<str:pk>', ServiceQuotationDetailAPI.as_view(), name='ServiceQuotationDetailAPI'),
]
