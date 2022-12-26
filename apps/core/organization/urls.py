from django.urls import path


urlpatterns = [
    path('users/<str:pk>', UserDetailView.as_view(), name='UserDetailView'),
]
