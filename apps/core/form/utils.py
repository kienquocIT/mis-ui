import datetime

from django.conf import settings
from django.utils import timezone

from apps.shared import ApiURL, ServerAPI, TypeCheck
from apps.shared.apis import RespData


class FormAuthController:
    @property
    def form_session(self):
        return self.request.session.get(self.SESSION_KEY, {})

    @form_session.setter
    def form_session(self, value: dict):
        old_data = self.form_session
        self.request.session.update(
            {
                self.SESSION_KEY: {
                    **old_data,
                    **value
                }
            }
        )

    @form_session.deleter
    def form_session(self):
        self.request.session.pop(self.SESSION_KEY, None)

    @property
    def headers(self):
        if self.form_session:
            idx = self.form_session.get('id', None)
            if idx:
                return {
                    'AuthenticationForm': self.form_session['id'],
                }
        return {}

    @property
    def valid_id(self) -> str or None:
        if self.form_session:
            idx = self.form_session.get('id', None)
            if idx:
                return idx
        return None

    @property
    def email(self) -> str or None:
        if self.form_session:
            email = self.form_session.get('email', None)
            if email:
                return email
        return None

    def __init__(self, request):
        self.SESSION_KEY = 'FORM_AUTHENTICATED'
        self.EMAIL_KEY = 'FORM_AUTHENTICATED_EMAIL'
        self.OTP_EXPIRES = 'FORM_AUTHENTICATED_EMAIL'
        self.request = request
        self.verify_state = False

    def session_flush(self):
        self.request.session.flush()

    def generate_otp(self, email, form_code, tenant_code):
        url = ApiURL.FORM_VALID_SESSION.fill_key(form_code=form_code, tenant_code=tenant_code)
        data = {'email': email}
        resp = ServerAPI(url=url).post(data=data)
        if resp.state:
            del self.form_session

            idx = resp.result['id']
            otp_expires = resp.result['otp_expires']
            otp_expires_seconds = resp.result['otp_expires_seconds']
            self.form_session = {
                'id': idx,
                'email': resp.result['email'],
                'otp_expires_seconds': otp_expires_seconds,
                'otp_expires': otp_expires,
            }
            return RespData.resp_200(
                data={'id': idx, 'otp_expires': otp_expires, 'otp_expires_seconds': otp_expires_seconds}
            )
        return RespData.resp_400({'detail': 'The validate email is failure'})

    def valid_otp(self, idx, otp, form_code, tenant_code):
        url = ApiURL.FORM_VALID_SESSION_PK.fill_key(tenant_code=tenant_code, form_code=form_code, pk_form_session=idx)
        data = {'otp': otp}
        resp = ServerAPI(url=url).put(data=data)
        idx = resp.result.get('id', None)
        email = resp.result.get('email', None)
        if idx and email:
            self.form_session = {
                'id': idx,
                'email': email,
            }
            return RespData.resp_200(data={'id': idx, 'email': email})
        return RespData.resp_400(
            {
                'detail': 'The validate email is failure',
            }
        )

    def verify(self):
        if not isinstance(self.verify_state, bool):
            if self.form_session:
                resp = ServerAPI(url=ApiURL.FORM_VALID_SESSION.fill_key(pk_form_session=self.form_session)).get()
                if resp.state:
                    if resp.result:
                        idx = resp.result.get('id', None)
                        expires = datetime.datetime.strptime(
                            resp.result.get('expires'),
                            settings.REST_FRAMEWORK['DATETIME_FORMAT']
                        )
                        if idx and TypeCheck.check_uuid(idx) and expires > timezone.now():
                            self.verify_state = True
                        else:
                            self.verify_state = False
                    else:
                        self.verify_state = False
                else:
                    self.verify_state = False
            else:
                self.verify_state = False
        return self.verify_state
