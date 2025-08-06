from django.urls import path
from . import views

urlpatterns = [
    # Render Views - HTML page rendering
    path('', views.ServiceOrderList.as_view(), name='ServiceOrderList'),
    path('create', views.ServiceOrderCreate.as_view(), name='ServiceOrderCreate'),

    # API Views - Data operations (render view + "/api")

]
