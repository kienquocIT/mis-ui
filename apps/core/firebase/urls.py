from django.urls import path

from apps.core.firebase.views import FirebaseView, FirebaseAPI

urlpatterns = [
    path('main', FirebaseView.as_view(), name='FirebaseView'),
    path('main/api', FirebaseAPI.as_view(), name='FirebaseAPI'),
]
