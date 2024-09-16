from django.urls import path
from apps.sales.projectproduction.views import (
    ProjectBOMList, ProjectBOMCreate, ProjectBOMDetail, ProjectBOMUpdate,
    ProjectBOMListAPI, ProjectBOMDetailAPI, LaborListForProjectBOMAPI,
    ProductMaterialListForProjectBOMAPI, ProductToolListForProjectBOMAPI, ProductListForProjectBOMAPI
)

urlpatterns = [
    path('project-bill-of-material/list', ProjectBOMList.as_view(), name='ProjectBOMList'),
    path('project-bill-of-material/create', ProjectBOMCreate.as_view(), name='ProjectBOMCreate'),
    path('project-bill-of-material/detail/<str:pk>', ProjectBOMDetail.as_view(), name='ProjectBOMDetail'),
    path('project-bill-of-material/update/<str:pk>', ProjectBOMUpdate.as_view(), name='ProjectBOMUpdate'),
    path('project-bill-of-material/api', ProjectBOMListAPI.as_view(), name='ProjectBOMListAPI'),
    path('project-bill-of-material/api/<str:pk>', ProjectBOMDetailAPI.as_view(), name='ProjectBOMDetailAPI'),

    path('product-list-for-project-BOM/api', ProductListForProjectBOMAPI.as_view(), name='ProductListForProjectBOMAPI'),
    path('labor-list-for-project-BOM/api', LaborListForProjectBOMAPI.as_view(), name='LaborListForProjectBOMAPI'),
    path('product-material-list-for-project-BOM/api', ProductMaterialListForProjectBOMAPI.as_view(), name='ProductMaterialListForProjectBOMAPI'),
    path('product-tool-list-for-project-BOM/api', ProductToolListForProjectBOMAPI.as_view(), name='ProductToolListForProjectBOMAPI'),
]
