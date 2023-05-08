from django.urls import path

from apps.core.base.views import PlanListAPI, TenantApplicationListAPI, ApplicationPropertyListAPI, \
    ApplicationPropertyEmployeeListAPI, ApplicationPermissionAPI, \
    CountryListAPI, CityListAPI, DistrictListAPI, WardListAPI

urlpatterns = [
    path('location/countries/api', CountryListAPI.as_view(), name='CountryListAPI'),
    path('location/cities/api', CityListAPI.as_view(), name='CityListAPI'),
    path('location/districts/api/<str:pk>', DistrictListAPI.as_view(), name='DistrictListAPI'),
    path('location/wards/api/<str:pk>', WardListAPI.as_view(), name='WardListAPI'),

    path('plan/api', PlanListAPI.as_view(), name='PlanListAPI'),
    path('tenant-application/api', TenantApplicationListAPI.as_view(), name='TenantApplicationListAPI'),
    path('application-property/api', ApplicationPropertyListAPI.as_view(), name='ApplicationPropertyListAPI'),
    path(
        'application-property-employee/api',
        ApplicationPropertyEmployeeListAPI.as_view(),
        name='ApplicationPropertyEmployeeListAPI'
    ),
    path('perm-per-app/api', ApplicationPermissionAPI.as_view(), name="ApplicationPermissionAPI"),
]
