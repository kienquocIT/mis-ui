from django.urls import path

from apps.core.form.views_runtime import (
    FormPublishedRuntimeView, FormPublishedRuntimeIFrame,
    FormPostNewData, FormPublishedRuntimeSubmitted, FormSubmittedViewEdit, FormSubmittedOnlyView,
    FormSubmittedUpdate, FormValidEmailOTP, FormValidEmailOTPDetail, FormRuntimeReverseUrl, FormRuntimeReverseUrlGet,
)

urlpatterns = [
    path('v/<str:form_code>', FormPublishedRuntimeView.as_view(), name='FormPublishedRuntimeView'),
    path('v/<str:form_code>/submitted/<str:pk>/edit', FormSubmittedViewEdit.as_view(), name='FormSubmittedViewEdit'),
    path('v/<str:form_code>/submitted/<str:pk>/view', FormSubmittedOnlyView.as_view(), name='FormSubmittedOnlyView'),
    path('i/<str:form_code>', FormPublishedRuntimeIFrame.as_view(), name='FormPublishedRuntimeIFrame'),
    path('p/<str:form_code>/<str:use_at>', FormPostNewData.as_view(), name='FormPostNewData'),
    path('p/<str:form_code>/<str:use_at>/<str:pk>', FormSubmittedUpdate.as_view(), name='FormSubmittedUpdate'),
    path('s-ed/<str:form_code>', FormPublishedRuntimeSubmitted.as_view(), name='FormPublishedRuntimeSubmitted'),
    path('valid/email', FormValidEmailOTP.as_view(), name='FormValidEmailOTP'),
    path('valid/email/<str:pk>', FormValidEmailOTPDetail.as_view(), name='FormValidEmailOTPDetail'),

    #
    path('g/rs', FormRuntimeReverseUrlGet.as_view(), name='FormRuntimeReverseUrlGet'),
    path('g/rs-get', FormRuntimeReverseUrl.as_view(), name='FormRuntimeReverseUrl'),
]
