from django.urls import path

from apps.core.chatbot.views import ChatbotView, ChatbotAPI

urlpatterns = [
    path('bflow-ai', ChatbotView.as_view(), name='ChatbotView'),
    path('bflow-ai/api', ChatbotAPI.as_view(), name='ChatbotAPI'),
]
