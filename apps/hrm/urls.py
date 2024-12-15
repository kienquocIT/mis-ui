from django.urls import path

from apps.hrm.employee.views import HRMEmployeeList, HRMEmployeeCreate, HRMEmployeeNotMapHRM, HRMEmployeeCreateAPI, \
    HRMEmployeeListAPI, HRMEmployeeDetail, HRMEmployeeDetailAPI, HRMEmployeeUpdate, HRMEmployeeUpdateAPI, \
    HRMEmployeeContractDetailAPI, HRMEmployeeContractList, HRMEmployeeSignatureAttachmentListAPI, \
    HRMSignatureAttachmentUpdateAPI

urlpatterns = [
    # employee HRM page
    path('employee-not-map-hrm', HRMEmployeeNotMapHRM.as_view(), name='HRMEmployeeNotMapHRMAPI'),
    path('employee-data/list', HRMEmployeeList.as_view(), name='HRMEmployeeList'),
    path('employee-data/list-api', HRMEmployeeListAPI.as_view(), name='HRMEmployeeListAPI'),
    path('employee-data/create', HRMEmployeeCreate.as_view(), name='HRMEmployeeCreate'),
    path('employee-data/create-api', HRMEmployeeCreateAPI.as_view(), name='HRMEmployeeCreateAPI'),
    path('employee-data/detail/<str:pk>', HRMEmployeeDetail.as_view(), name='HRMEmployeeDetail'),
    path('employee-data/detail-api/<str:pk>', HRMEmployeeDetailAPI.as_view(), name='HRMEmployeeDetailAPI'),
    path('employee-data/update/<str:pk>', HRMEmployeeUpdate.as_view(), name='HRMEmployeeUpdate'),
    path('employee-data/update-api/<str:pk>', HRMEmployeeUpdateAPI.as_view(), name='HRMEmployeeUpdateAPI'),
    # contract
    path(
        'employee-data/contract/list-api', HRMEmployeeContractList.as_view(), name='HRMEmployeeContractList'
    ),
    path(
        'employee-data/contract/detail-api/<str:pk>', HRMEmployeeContractDetailAPI.as_view(),
        name='HRMEmployeeContractDetailAPI'
    ),
    # employee info attachment signature file
    path(
        'employee-data/signature/list', HRMEmployeeSignatureAttachmentListAPI.as_view(),
        name='HRMEmpSignAttListAPI'
    ),
    path(
        'employee-data/signature/update/<str:pk>', HRMSignatureAttachmentUpdateAPI.as_view(),
        name='HRMEmpSignAttUpdateAPI'
    ),
]
