from django.urls import path

from apps.sales.project.views import ProjectList

urlpatterns = [
    # project
    path('list', ProjectList.as_view(), name='ProjectList'),
]
