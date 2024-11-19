from django.urls import path

from apps.core.chatbot.views import ChatbotView, ChatbotAPI

urlpatterns = [
    path('chatbot', ChatbotView.as_view(), name='ChatbotView'),
    path('chatbot/api', ChatbotAPI.as_view(), name='ChatbotAPI'),
]
