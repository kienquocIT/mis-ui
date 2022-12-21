import json

from django.shortcuts import render, redirect

from rest_framework.views import APIView
from .models import User
from .serializers import UserDetailSerializer, UserListSerializer
from apps.shared import mask_view, ServerMsg
from rest_framework.response import Response

from apps.shared import ServerAPI, ApiURL, mask_view, AuthMsg, ServerMsg


TEMPLATE = {
    'list': 'core/account/user_list.html',
    'detail': '',
}


class UserListView(APIView):
    @mask_view(auth_require=True, template='core/account/user_list.html')
    def get(self, request, *args, **kwargs):
        user_list = User.objects.all()
        serializer = UserListSerializer(user_list, many=True)
        return {'user_list': json.loads(json.dumps(serializer.data))}

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            user = UserListSerializer(data=request.data)
            if user.is_valid():
                user.save()
                return Response({
                    "code": 200,
                    "status": "successful",
                    "message": "code was sent try to validate code"
                })
        return Response({'detail': ServerMsg.server_err}, status=500)


class UserDetailView(APIView):

    @mask_view(auth_require=True, template='core/account/user_detail.html')
    def get(self, request, pk, *args, **kwargs):
        user = User.objects.get(pk=pk)
        return {'user': user}

    def put(self, request, pk, *args, **kwargs):
        instance = User.objects.get(pk=pk)
        user = UserDetailSerializer(data=request.data, instance=instance)
        if user.is_valid():
            user.save()
            return Response({
                "code": 200,
                "status": "successful",
                "message": "edit user successfully"
            })
        return Response({'detail': ServerMsg.server_err}, status=500)

    # def delete(self, request, pk, *args, **kwargs):
    #     if request.method == "DELETE":
    #         user = User.objects.get(pk=request.data['user_id'])
    #         user.delete()
    #         return Response({
    #             "code": 200,
    #             "status": "successful",
    #             "message": "delete user successfully"
    #         })
    #     return Response({'detail': ServerMsg.server_err}, status=500)
