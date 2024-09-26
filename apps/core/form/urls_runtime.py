from django.urls import path

from apps.core.form.views_runtime import (
    FormPublishedRuntimeView, FormPublishedRuntimeIFrame,
    FormPostNewData, FormPublishedRuntimeSubmitted, FormSubmittedViewEdit, FormSubmittedOnlyView,
    FormSubmittedUpdate, FormRuntimeReverseUrl, FormRuntimeReverseUrlGet,
    FormAuthBeforeViewForm, FormAuthenticateFormAPI, FormViewLogout,
)

urlpatterns = [
    # [view] form and submitted data
    path('v/<str:form_code>', FormPublishedRuntimeView.as_view(), name='FormPublishedRuntimeView'),
    path('i/<str:form_code>', FormPublishedRuntimeIFrame.as_view(), name='FormPublishedRuntimeIFrame'),
    path('v/<str:form_code>/submitted/<str:pk>/edit', FormSubmittedViewEdit.as_view(), name='FormSubmittedViewEdit'),
    path('v/<str:form_code>/submitted/<str:pk>/view', FormSubmittedOnlyView.as_view(), name='FormSubmittedOnlyView'),

    # [API] post new data, update data, list submitted
    path('p/<str:form_code>/<str:use_at>', FormPostNewData.as_view(), name='FormPostNewData'),
    path('p/<str:form_code>/<str:use_at>/<str:pk>', FormSubmittedUpdate.as_view(), name='FormSubmittedUpdate'),
    path('s-ed/<str:form_code>', FormPublishedRuntimeSubmitted.as_view(), name='FormPublishedRuntimeSubmitted'),

    # [form] logout and redirect to page login follow config authenticate type of form
    path('v/<str:form_code>/logout', FormViewLogout.as_view(), name='FormViewLogout'),

    # authentication and gateway
    path('auth/<str:form_code>/email', FormAuthBeforeViewForm.as_view(), name='FormAuthBeforeViewForm'),
    path('auth/<str:form_code>/email/api', FormAuthenticateFormAPI.as_view(), name='FormAuthenticateFormAPI'),

    path('g/rs', FormRuntimeReverseUrlGet.as_view(), name='FormRuntimeReverseUrlGet'),
    path('g/rs-get', FormRuntimeReverseUrl.as_view(), name='FormRuntimeReverseUrl'),
]
