from django.urls import path

from apps.sales.inventory.views import (
    GoodReceiptList, GoodReceiptCreate, InventoryAdjustmentList, InventoryAdjustmentCreate
)

urlpatterns = [
    # good receipt
    path('good-receipt/list', GoodReceiptList.as_view(), name='GoodReceiptList'),
    path('good-receipt/create', GoodReceiptCreate.as_view(), name='GoodReceiptCreate'),
    # inventory adjustment
    path('inventory-adjustment/list', InventoryAdjustmentList.as_view(), name='InventoryAdjustmentList'),
    path('inventory-adjustment/create', InventoryAdjustmentCreate.as_view(), name='InventoryAdjustmentCreate'),
]
