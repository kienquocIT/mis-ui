from django.shortcuts import render
import json
from rest_framework.views import APIView
from .models import AuthUser, User
from .forms import UserForm
from .serializers import UserSerializer
from apps.shared import mask_view, ApiURL, ServerAPI
from rest_framework.response import Response
from django.http import JsonResponse


class UserListView(APIView):
    @mask_view(auth_require=True, template='core/account/user_list.html')
    def get(self, request, *args, **kwargs):
        user_list = User.objects.all()
        serializer = UserSerializer(user_list, many=True)
        print(serializer.data)
        return {'user_list': json.loads(json.dumps(serializer.data))}

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == "POST":
            # frm = UserForm(data=request.data)
            data = request.data
            User.objects.create(first_name=data['document_firstname'],
                                last_name=data['document_lastname'],
                                email=data['document_email'],
                                phone=data['document_phone'],
                                username=data['document_username'])
            return Response({
                "code": 200,
                "status": "successful",
                "message": "code was sent try to validate code"
            })
        return Response({
            'detail': DatabaseMsg
        })
