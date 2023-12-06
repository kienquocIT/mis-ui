from django.urls import path

from .views import ProgrammeList

urlpatterns = [
    path('list', ProgrammeList.as_view(), name='ProgrammeList'),
]
