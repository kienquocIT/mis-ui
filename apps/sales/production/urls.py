from django.urls import path
from apps.sales.production.views import (
    BOMList, BOMCreate, BOMDetail, BOMUpdate, BOMListAPI, BOMDetailAPI, LaborListForBOMAPI, ProductionOrderCreate,
    ProductMaterialListForBOMAPI, ProductToolListForBOMAPI, BOMOrderListAPI, ProductionOrderDetail,
    ProductionOrderListAPI, ProductionOrderDetailAPI, ProductionOrderUpdate, ProductionOrderList,
    ProductListForBOMAPI, ProductionOrderDDListAPI, ProductionOrderManualDoneListAPI, OpportunityBOMList,
    OpportunityBOMCreate, OpportunityBOMDetail, OpportunityBOMUpdate, OpportunityBOMListAPI, OpportunityBOMDetailAPI,
    ProductListForOpportunityBOMAPI, LaborListForOpportunityBOMAPI, ProductMaterialListForOpportunityBOMAPI,
    ProductToolListForOpportunityBOMAPI
)
from apps.sales.production.views.production_report import ProductionReportCreate, ProductionReportList, \
    ProductionReportListAPI, ProductionReportDetail, ProductionReportDetailAPI, ProductionReportUpdate, \
    ProductionReportDDListAPI, ProductionReportGRListAPI, ProductionReportProductListAPI
from apps.sales.production.views.work_order import WorkOrderCreate, WorkOrderList, WorkOrderListAPI, WorkOrderDetail, \
    WorkOrderDetailAPI, WorkOrderUpdate, WorkOrderDDListAPI, WorkOrderManualDoneListAPI

urlpatterns = [
    path('bill-of-material/list', BOMList.as_view(), name='BOMList'),
    path('bill-of-material/create', BOMCreate.as_view(), name='BOMCreate'),
    path('bill-of-material/detail/<str:pk>', BOMDetail.as_view(), name='BOMDetail'),
    path('bill-of-material/update/<str:pk>', BOMUpdate.as_view(), name='BOMUpdate'),
    path('bill-of-material/api', BOMListAPI.as_view(), name='BOMListAPI'),
    path('bill-of-material/api/<str:pk>', BOMDetailAPI.as_view(), name='BOMDetailAPI'),

    path('product-list-for-BOM/api', ProductListForBOMAPI.as_view(), name='ProductListForBOMAPI'),
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
    path('production-order-dd/api/list', ProductionOrderDDListAPI.as_view(), name='ProductionOrderDDListAPI'),
    path('production-order-manual-done/api/list', ProductionOrderManualDoneListAPI.as_view(), name='ProductionOrderManualDoneListAPI'),

    # production report
    path('production-report/list', ProductionReportList.as_view(), name='ProductionReportList'),
    path('production-report/api/list', ProductionReportListAPI.as_view(), name='ProductionReportListAPI'),
    path('production-report/create', ProductionReportCreate.as_view(), name='ProductionReportCreate'),
    path('production-report/detail/<str:pk>', ProductionReportDetail.as_view(), name='ProductionReportDetail'),
    path('production-report/detail-api/<str:pk>', ProductionReportDetailAPI.as_view(), name='ProductionReportDetailAPI'),
    path('production-report/update/<str:pk>', ProductionReportUpdate.as_view(), name='ProductionReportUpdate'),
    path('production-report-dd/api/list', ProductionReportDDListAPI.as_view(), name='ProductionReportDDListAPI'),
    path('production-report-gr/api/list', ProductionReportGRListAPI.as_view(), name='ProductionReportGRListAPI'),
    path('production-report-product/api/list', ProductionReportProductListAPI.as_view(), name='ProductionReportProductListAPI'),

    # work order
    path('work-order/list', WorkOrderList.as_view(), name='WorkOrderList'),
    path('work-order/api/list', WorkOrderListAPI.as_view(), name='WorkOrderListAPI'),
    path('work-order/create', WorkOrderCreate.as_view(), name='WorkOrderCreate'),
    path('work-order/detail/<str:pk>', WorkOrderDetail.as_view(), name='WorkOrderDetail'),
    path('work-order/detail-api/<str:pk>', WorkOrderDetailAPI.as_view(), name='WorkOrderDetailAPI'),
    path('work-order/update/<str:pk>', WorkOrderUpdate.as_view(), name='WorkOrderUpdate'),
    path('work-order-dd/api/list', WorkOrderDDListAPI.as_view(), name='WorkOrderDDListAPI'),
    path('work-order-manual-done/api/list', WorkOrderManualDoneListAPI.as_view(), name='WorkOrderManualDoneListAPI'),
] + [
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
