from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, TypeCheck
from apps.shared.apis import RespData


class CommentList(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk_doc, pk_app, **kwargs):
        if pk_doc and pk_app and TypeCheck.check_uuid(pk_doc) and TypeCheck.check_uuid(pk_app):
            comment_list = ServerAPI(
                request=request, user=request.user, url=ApiURL.COMMENT_LIST.fill_key(pk_doc=pk_doc, pk_app=pk_app)
            ).get(data=request.query_params.dict())
            return comment_list.auto_return(key_success='comment_list')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, pk_doc, pk_app, **kwargs):
        if pk_doc and pk_app and TypeCheck.check_uuid(pk_doc) and TypeCheck.check_uuid(pk_app):
            comment_detail = ServerAPI(
                request=request, user=request.user, url=ApiURL.COMMENT_LIST.fill_key(pk_doc=pk_doc, pk_app=pk_app)
            ).post(data=request.data)
            return comment_detail.auto_return(key_success='comment_detail')
        return RespData.resp_404()


class CommentRepliesAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.COMMENT_REPLIES_LIST.fill_key(pk=pk)
            comment_replies_list = ServerAPI(request=request, user=request.user, url=url).get()
            return comment_replies_list.auto_return(key_success='comment_replies_list')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.COMMENT_REPLIES_LIST.fill_key(pk=pk)
            comment_detail = ServerAPI(request=request, user=request.user, url=url).post(data=request.data)
            return comment_detail.auto_return(key_success='comment_detail')
        return RespData.resp_404()
