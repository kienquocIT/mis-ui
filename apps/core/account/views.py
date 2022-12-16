from django.shortcuts import render
import json
from rest_framework.views import APIView
from .models import AuthUser, User
from .serializers import UserSerializer
from apps.shared import mask_view, ApiURL, ServerAPI, ServerMsg
from rest_framework.response import Response


class UserListView(APIView):
    @mask_view(auth_require=True, template='core/account/user_list.html')
    def get(self, request, *args, **kwargs):
        user_list = User.objects.all()
        serializer = UserSerializer(user_list, many=True)
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
                                password=data['document_password'],
                                username=data['document_username'])
            return Response({
                "code": 200,
                "status": "successful",
                "message": "code was sent try to validate code"
            })
        return Response({'detail': ServerMsg.server_err}, status=500)

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        if request.method == "PUT":
            data = request.data
            user = User.objects.get(pk=data['document_id-edit'])
            user.first_name = data['document_firstname-edit']
            user.last_name = data['document_lastname-edit']
            user.phone = data['document_phone-edit']
            user.email = data['document_email-edit']
            user.save()
            return Response({
                "code": 200,
                "status": "successful",
                "message": "code was sent try to validate code"
            })

        return Response({'detail': ServerMsg.server_err}, status=500)

    def delete(self, request, *args, **kwargs):
        if request.method == "DELETE":
            user = User.objects.get(pk=request.data['user_id'])
            user.delete()
            return Response({
                "code": 200,
                "status": "successful",
                "message": "code was sent try to validate code"
            })
        return Response({'detail': ServerMsg.server_err}, status=500)
