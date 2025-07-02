from rest_framework import status
from apps.shared import ServerAPI
from apps.shared.msg import BaseMsg


class BaseView:

    @classmethod
    def run_create(cls, request, url):
        resp = ServerAPI(user=request.user, url=url).post(request.data)
        if resp.state:
            resp.result['message'] = BaseMsg.CREATE_OK
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()

    @classmethod
    def run_update(cls, request, url, pk):
        resp = ServerAPI(user=request.user, url=url.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = BaseMsg.UPDATE_OK
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()

    @classmethod
    def run_delete(cls, request, url, pk):
        resp = ServerAPI(user=request.user, url=url.fill_key(pk=pk)).delete(request.data)
        if resp.state:
            resp.result['message'] = BaseMsg.DELETE_OK
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
