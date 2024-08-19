from django.urls import path, include

urlpatterns = [
    path('quotation/', include('apps.sales.quotation.urls')),
    path('opportunity/', include('apps.sales.opportunity.urls')),
    path('saleorder/', include('apps.sales.saleorder.urls')),
    path('cashoutflow/', include('apps.sales.cashoutflow.urls')),
    path('delivery/', include('apps.sales.delivery.urls')),
    path('task/', include('apps.sales.task.urls')),
    path('purchasing/', include('apps.sales.purchasing.urls')),
    path('inventory/', include('apps.sales.inventory.urls')),
    path('report/', include('apps.sales.report.urls')),
    path('acceptance/', include('apps.sales.acceptance.urls')),
    path('dashboard/', include('apps.sales.dashboard.urls')),
    path('revenue-plan/', include('apps.sales.revenueplan.urls')),
    path('ar-invoice/', include('apps.sales.arinvoice.urls')),
    path('ap-invoice/', include('apps.sales.apinvoice.urls')),
    path('lead/', include('apps.sales.lead.urls')),
    path('project/', include('apps.sales.project.urls')),
    path('budget-plan/', include('apps.sales.budgetplan.urls')),
    path('contract/', include('apps.sales.contract.urls')),
    path('distribution-plan/', include('apps.sales.distributionplan.urls')),
    path('bill-of-resources/', include('apps.sales.bor.urls')),
]
