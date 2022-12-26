
from rest_framework.views import APIView

from apps.shared import mask_view


class OrganizationCreateView(APIView):

    @mask_view(auth_require=True, is_api=True, template='core/organization/create_organization.html')
    def post(self, request, *args, **kwargs):
        pass

