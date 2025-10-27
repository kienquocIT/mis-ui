from django.urls import path

from apps.hrm.employee.views import HRMEmployeeList, HRMEmployeeCreate, HRMEmployeeNotMapHRM, HRMEmployeeCreateAPI, \
    HRMEmployeeListAPI, HRMEmployeeDetail, HRMEmployeeDetailAPI, HRMEmployeeUpdate, HRMEmployeeUpdateAPI, \
    HRMEmployeeContractDetailAPI, HRMEmployeeContractList, HRMEmployeeSignatureAttachmentListAPI, \
    HRMSignatureAttachmentUpdateAPI, HRMRuntimeSignatureAPI, HRMRuntimeSignatureDetailView, HRMRuntimeSignatureDetailAPI

urlpatterns = [
    # employee HRM page
    path('not-map-hrm', HRMEmployeeNotMapHRM.as_view(), name='HRMEmployeeNotMapHRMAPI'),
    path('list', HRMEmployeeList.as_view(), name='HRMEmployeeList'),
    path('list-api', HRMEmployeeListAPI.as_view(), name='HRMEmployeeListAPI'),
    path('create', HRMEmployeeCreate.as_view(), name='HRMEmployeeCreate'),
    path('create-api', HRMEmployeeCreateAPI.as_view(), name='HRMEmployeeCreateAPI'),
    path('detail/<str:pk>', HRMEmployeeDetail.as_view(), name='HRMEmployeeDetail'),
    path('detail-api/<str:pk>', HRMEmployeeDetailAPI.as_view(), name='HRMEmployeeDetailAPI'),
    path('update/<str:pk>', HRMEmployeeUpdate.as_view(), name='HRMEmployeeUpdate'),
    path('update-api/<str:pk>', HRMEmployeeUpdateAPI.as_view(), name='HRMEmployeeUpdateAPI'),
    # list contract has mapped employee info
    path('contract/list-api', HRMEmployeeContractList.as_view(), name='HRMEmployeeContractList'),
    path(
        'contract/detail-api/<str:pk>', HRMEmployeeContractDetailAPI.as_view(),
        name='HRMEmployeeContractDetailAPI'
    ),
    # employee info attachment signature file
    path(
        'signature/list', HRMEmployeeSignatureAttachmentListAPI.as_view(),
        name='HRMEmpSignAttListAPI'
    ),
    path(
        'signature/update/<str:pk>', HRMSignatureAttachmentUpdateAPI.as_view(),
        name='HRMEmpSignAttUpdateAPI'
    ),
    # signature request
    path(
        'request-signing/create', HRMRuntimeSignatureAPI.as_view(),
        name='HRMRuntimeSignatureAPI'
    ),
    path(
        'runtime-signature/detail/<str:pk>', HRMRuntimeSignatureDetailView.as_view(),
        name='HRMRuntimeSignatureDetail'
    ),
    path(
        'runtime-signature/detail-api/<str:pk>', HRMRuntimeSignatureDetailAPI.as_view(),
        name='HRMRuntimeSignatureDetailAPI'
    ),
]
