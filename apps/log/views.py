from rest_framework import status
from rest_framework.parsers import MultiPartParser, FileUploadParser, FormParser
from rest_framework.views import APIView

from apps.shared import mask_view
from apps.log.seriallizers import TicketErrorCreateSerializer

__all__ = [
    'TicketErrorCreateAPI',
]


class TicketErrorCreateAPI(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        ser = TicketErrorCreateSerializer(
            data=request.data, context={'user_obj': request.user, 'attachments': request.FILES.getlist('attachments')}
        )
        state = ser.is_valid(raise_exception=False)

        if state is True:
            obj = ser.save()
            return {'detail': 'Success', 'ticket': {'id': str(obj.id), 'code': str(obj.code)}}, status.HTTP_200_OK
        return {'errors': ser.errors}, status.HTTP_400_BAD_REQUEST
