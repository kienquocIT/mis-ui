from django.urls import path

from apps.hrm.absenceexplanation.views import AbsenceExplanationList, AbsenceExplanationCreate, \
    AbsenceExplanationListAPI, AbsenceExplanationDetail

urlpatterns = [
    path('list', AbsenceExplanationList.as_view(), name='AbsenceExplanationList'),
    path('list/api', AbsenceExplanationListAPI.as_view(), name='AbsenceExplanationListAPI'),
    path('create', AbsenceExplanationCreate.as_view(), name='AbsenceExplanationCreate'),
    path('/detail/<str:pk>', AbsenceExplanationDetail.as_view(), name='AbsenceExplanationDetail'),
]
