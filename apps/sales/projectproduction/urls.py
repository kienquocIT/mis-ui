from django.urls import path
from apps.sales.projectproduction.views import (
    OpportunityBOMList, OpportunityBOMCreate, OpportunityBOMDetail, OpportunityBOMUpdate,
    OpportunityBOMListAPI, OpportunityBOMDetailAPI, LaborListForOpportunityBOMAPI,
    ProductMaterialListForOpportunityBOMAPI, ProductToolListForOpportunityBOMAPI, ProductListForOpportunityBOMAPI
)

urlpatterns = [
    path('project-bill-of-material/list', OpportunityBOMList.as_view(), name='OpportunityBOMList'),
    path('project-bill-of-material/create', OpportunityBOMCreate.as_view(), name='OpportunityBOMCreate'),
    path('project-bill-of-material/detail/<str:pk>', OpportunityBOMDetail.as_view(), name='OpportunityBOMDetail'),
    path('project-bill-of-material/update/<str:pk>', OpportunityBOMUpdate.as_view(), name='OpportunityBOMUpdate'),
    path('project-bill-of-material/api', OpportunityBOMListAPI.as_view(), name='OpportunityBOMListAPI'),
    path('project-bill-of-material/api/<str:pk>', OpportunityBOMDetailAPI.as_view(), name='OpportunityBOMDetailAPI'),

    path('product-list-for-project-BOM/api', ProductListForOpportunityBOMAPI.as_view(), name='ProductListForOpportunityBOMAPI'),
    path('labor-list-for-project-BOM/api', LaborListForOpportunityBOMAPI.as_view(), name='LaborListForOpportunityBOMAPI'),
    path('product-material-list-for-project-BOM/api', ProductMaterialListForOpportunityBOMAPI.as_view(), name='ProductMaterialListForOpportunityBOMAPI'),
    path('product-tool-list-for-project-BOM/api', ProductToolListForOpportunityBOMAPI.as_view(), name='ProductToolListForOpportunityBOMAPI'),
]
