from django.utils.translation import gettext_lazy as _
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.apis import RespData


class MailApplicationTemplateSample(APIView):
    @staticmethod
    def parse_template_detail(title, url, remarks=''):
        return {
            'title': title,
            'url': url,
            'description': remarks,
        }

    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, app_id, **kwargs):
        base_url = 'mailer/template/'
        result = []
        if app_id == 'b9650500-aba7-44e3-b6e0-2542622702a3':  # Quotation
            base_url += 'quotation/'
            result = [
                self.parse_template_detail(f"{_('Quotation')} 1", base_url + 'quotation_1.html'),
                self.parse_template_detail(f"{_('Quotation')} 2", base_url + 'quotation_2.html'),
            ]
        return RespData.resp_200(data={'templates': result})


class ApplicationPropertyForMailListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.APPLICATION_PROPERTY_MAIL_LIST, user=request.user).get(
            data={
                'ordering': 'title',
                'application__in': request.query_params.get('application__in', ''),
            }
        )
        return resp.auto_return(key_success='application_property_list')
