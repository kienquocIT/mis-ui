from django.urls import path

from apps.core.fimport.views.render import FImportListView, FImportCreateView
from apps.core.fimport.views.core import (
    CoreAccountUserImportAPI,
    HrGroupLevelImportAPI, HrGroupImportAPI, HrRoleImportAPI, HrEmployeeImportAPI,
)
from apps.core.fimport.views.saledata import (
    SaleDataContactImportAPI, SalutationImportAPI, CurrencyImportAPI, AccountGroupImportAPI, AccountTypeImportAPI,
    IndustryImportAPI, PaymentTermImportAPI, SaleDataAccountImportAPI, ProductUOMGroupImportAPI,
    ProductProductTypeImportAPI, ProductProductCategoryImportAPI,
)

urlpatterns = [
    path('list', FImportListView.as_view(), name='FImportListView'),
    path('create', FImportCreateView.as_view(), name='FImportCreateView'),
    # core
    path('core/account/user', CoreAccountUserImportAPI.as_view(), name='CoreAccountUserImportAPI'),
    # hr
    path('hr/group-level', HrGroupLevelImportAPI.as_view(), name='HrGroupLevelImportAPI'),
    path('hr/group', HrGroupImportAPI.as_view(), name='HrGroupImportAPI'),
    path('hr/role', HrRoleImportAPI.as_view(), name='HrRoleImportAPI'),
    path('hr/employee', HrEmployeeImportAPI.as_view(), name='HrEmployeeImportAPI'),
    # saledata
    path('saledata/currency', CurrencyImportAPI.as_view(), name='CurrencyImportAPI'),
    path('saledata/account/group', AccountGroupImportAPI.as_view(), name='AccountGroupImportAPI'),
    path('saledata/account/type', AccountTypeImportAPI.as_view(), name='AccountTypeImportAPI'),
    path('saledata/industry', IndustryImportAPI.as_view(), name='IndustryImportAPI'),
    path('saledata/payment-term', PaymentTermImportAPI.as_view(), name='PaymentTermImportAPI'),
    path('saledata/salutation', SalutationImportAPI.as_view(), name='SalutationImportAPI'),
    path('saledata/contact', SaleDataContactImportAPI.as_view(), name='SaleDataContactImportAPI'),
    path('saledata/account', SaleDataAccountImportAPI.as_view(), name='SaleDataAccountImportAPI'),
    path('saledata/product/uomgroup', ProductUOMGroupImportAPI.as_view(), name='ProductUOMGroupImportAPI'),
    path('saledata/product/product-type', ProductProductTypeImportAPI.as_view(), name='ProductProductTypeImportAPI'),
    path('saledata/product/product-category', ProductProductCategoryImportAPI.as_view(),
         name='ProductProductCategoryImportAPI'),
]
