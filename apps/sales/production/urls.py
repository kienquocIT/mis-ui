from django.urls import path
from apps.sales.production.views import (
    BOMList, BOMCreate, BOMDetail, BOMUpdate, BOMListAPI, BOMDetailAPI, LaborListForBOMAPI, ProductionOrderCreate,
    ProductMaterialListForBOMAPI, ProductToolListForBOMAPI, BOMOrderListAPI, ProductionOrderDetail,
    ProductionOrderListAPI, ProductionOrderDetailAPI, ProductionOrderUpdate, ProductionOrderList,
    FinishProductListForBOMAPI
)

urlpatterns = [
    path('bill-of-material/list', BOMList.as_view(), name='BOMList'),
    path('bill-of-material/create', BOMCreate.as_view(), name='BOMCreate'),
    path('bill-of-material/detail/<str:pk>', BOMDetail.as_view(), name='BOMDetail'),
    path('bill-of-material/update/<str:pk>', BOMUpdate.as_view(), name='BOMUpdate'),
    path('bill-of-material/api', BOMListAPI.as_view(), name='BOMListAPI'),
    path('bill-of-material/api/<str:pk>', BOMDetailAPI.as_view(), name='BOMDetailAPI'),

    path('final-product-list-for-BOM/api', FinishProductListForBOMAPI.as_view(), name='FinishProductListForBOMAPI'),
    path('labor-list-for-BOM/api', LaborListForBOMAPI.as_view(), name='LaborListForBOMAPI'),
    path('product-material-list-for-BOM/api', ProductMaterialListForBOMAPI.as_view(), name='ProductMaterialListForBOMAPI'),
    path('product-tool-list-for-BOM/api', ProductToolListForBOMAPI.as_view(), name='ProductToolListForBOMAPI'),

    # production order
    path('bom-order/api/list', BOMOrderListAPI.as_view(), name='BOMOrderListAPI'),

    path('production-order/list', ProductionOrderList.as_view(), name='ProductionOrderList'),
    path('production-order/api/list', ProductionOrderListAPI.as_view(), name='ProductionOrderListAPI'),
    path('production-order/create', ProductionOrderCreate.as_view(), name='ProductionOrderCreate'),
    path('production-order/detail/<str:pk>', ProductionOrderDetail.as_view(), name='ProductionOrderDetail'),
    path('production-order/detail-api/<str:pk>', ProductionOrderDetailAPI.as_view(), name='ProductionOrderDetailAPI'),
    path('production-order/update/<str:pk>', ProductionOrderUpdate.as_view(), name='ProductionOrderUpdate'),
]
