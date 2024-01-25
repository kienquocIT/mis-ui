from django.urls import path

from .views import CommentList, CommentRepliesAPI

urlpatterns = [
    path('doc/<str:pk_doc>/<str:pk_app>/list', CommentList.as_view(), name='CommentList'),
    path('reply/<str:pk>/list', CommentRepliesAPI.as_view(), name='CommentRepliesAPI'),
]
