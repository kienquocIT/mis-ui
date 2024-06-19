from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL

# Create your views here.
class DiagramListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DIAGRAM_LIST).get(data)
        return resp.auto_return(key_success='diagram_list')
