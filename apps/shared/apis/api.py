import requests

from django.db.models import Model
from django.conf import settings
from django.http import response
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.exceptions import PermissionDenied

from .urls_map import ApiURL


class RespData(object):
    """
    Object convert response data
        state: bool : state call API
        result: dict or list : data
        errors: dict : errors server return
    """

    def __init__(self, _state=None, _result=None, _errors=None, _status=None):
        """
        Properties will keep type of attribute that is always correct
        Args: attribute of Http Response
            _state: status_code | success: 200 - 200 | fail: others
            _result: .json()['result'] | 'result' is default | You can custom key - confirm with API Docs
            _errors: .json()['errors'] | 'errors' is default | You can custom key - confirm with API Docs
        """
        self._state = _state
        self._result = _result
        self._errors = _errors
        self._status = _status

    @property
    def state(self) -> bool or None:
        if isinstance(self._state, int):
            if 200 <= self._state < 300:
                return True
            return False
        return None

    @property
    def result(self) -> dict or list:
        if isinstance(self._result, (dict, list)):
            return self._result
        raise ValueError(f'Result of response must be dict or list type, it currently is {type(self._result)}.')

    @property
    def errors(self) -> dict:
        if isinstance(self._errors, dict):
            return self._errors
        raise ValueError(f'Errors of response must be dict type, it currently is {type(self._result)}.')

    @property
    def status(self) -> int:
        if isinstance(self._status, int):
            return self._status
        raise ValueError(f'Status of response must be integer type, it currently is {type(self._status)}.')


class APIUtil:
    key_auth = 'Authorization'
    prefix_token = 'Bearer'
    key_response_data = 'result'
    key_response_err = 'errors'

    def __init__(self, user_obj: Model = None):
        self.user_obj = user_obj

    @classmethod
    def key_authenticated(cls, access_token: str) -> dict:
        """
        Return dict for update headers | Authorization header + Bearer + Access Token.
        Args:
            access_token:

        Returns:

        """
        return {cls.key_auth: f'{cls.prefix_token} {access_token}'}

    @classmethod
    def get_new_token(cls, refresh_token) -> str or None:
        """
        Call API refresh token
        Args:
            refresh_token: refresh_token in User Object

        Returns:

        """
        if refresh_token:
            resp_obj = ServerAPI(url=ApiURL.refresh_token).post(
                data={'refresh': refresh_token}
            )
            if resp_obj.state and resp_obj.result and isinstance(resp_obj.result, dict):
                if resp_obj.result.get('access_token', None):
                    return resp_obj.result['access_token']
        return None

    @classmethod
    def refresh_token(cls, user_obj: Model) -> dict:
        """
        Call get refresh token after update access_token to User Model
        Args:
            user_obj: (User Model) : get refresh_token from user -> call -> update access_token -> save

        Returns: (dict) : it for update to headers before call API

        """
        access_token = cls.get_new_token(refresh_token=getattr('user_obj', 'refresh_token', None))
        if access_token:
            user_obj.access_token = access_token
            user_obj.save()
            return {'Authorization': f'Bearer {access_token}'}
        return {}

    @classmethod
    def get_data_from_resp(cls, resp: response) -> RespData:
        """
        Parse Http Response to RespData Object
        Args:
            resp: (HttpResponse)

        Returns: RespData Object

        """
        if resp.status_code == 500:
            resp_json = {
                cls.key_response_err: {'detail': 'Server Error'},
            }
        else:
            resp_json = resp.json()
        return RespData(
            resp.status_code,
            resp_json.get(cls.key_response_data, {}),
            resp_json.get(cls.key_response_err, {}),
            resp.status_code,
        )

    def call_get(self, safe_url: str, headers: dict) -> RespData:
        """
        Support ServerAPI call to server get data (refresh token after recall if token is expires)
        Args:
            safe_url: (string) url parsed
            headers: (dict) headers add to request

        Returns: RespData object have attribute state, result, errors
            state: (bool) True if status_code is range (200, 300) else False : Is success call
            result: (dict or list) : is Response Data from API
            errors: (dict) : is Error Data from API
        """
        resp = requests.get(url=safe_url, headers=headers)
        if resp.status_code == 401:
            if self.user_obj:
                # refresh token
                headers_upgrade = self.refresh_token(user_obj=self.user_obj)
                if headers_upgrade:
                    headers.update(headers_upgrade)
                    resp = requests.get(url=safe_url, headers=headers)
        return self.get_data_from_resp(resp)

    def call_post(self, safe_url: str, headers: dict, data: dict) -> RespData:
        """
        Support ServerAPI call to server with POST method. (refresh token after recall if token is expires)
        Args:
            safe_url: (string) url parsed
            headers: (dict) headers add to request
            data: (dict) body data of request

        Returns: RespData object have attribute state, result, errors
            state: (bool) True if status_code is range (200, 300) else False : Is success call
            result: (dict or list) : is Response Data from API
            errors: (dict) : is Error Data from API
        """
        resp = requests.post(url=safe_url, headers=headers, json=data)
        if resp.status_code == 401:
            if self.user_obj:
                # refresh token
                headers_upgrade = self.refresh_token(user_obj=self.user_obj)
                if headers_upgrade:
                    headers.update(headers_upgrade)
                    resp = requests.post(url=safe_url, headers=headers, json=data)
        return self.get_data_from_resp(resp)


class ServerAPI:
    """
    Public class and call from views/utils
    """

    def __init__(self, url, **kwargs):
        self.user = kwargs.get('user', None)
        if url.startswith('\\'):
            self.url = settings.API_DOMAIN + url[1:]
        else:
            self.url = settings.API_DOMAIN + url

    @property
    def headers(self) -> dict:
        """
        Setup headers for request
        Returns: Dict
            'content-type': 'application/json',
            ...
        """
        data = {
            'content-type': 'application/json',
            'Accept-Language': 'vi',
        }
        if self.user and getattr(self.user, 'access_token', None):
            data.update(APIUtil.key_authenticated(access_token=self.user.access_token))
        return data

    def get(self, data=None):
        """
        Support call request API with GET method.
        Args:
            data: (dict) : will url encode and append to real url ()

        Returns: APIUtil --> call_get()
        """
        safe_url = self.url
        if data and isinstance(data, dict):
            url_encode = [f"{key}={val}" for key, val in data.items()]
            safe_url += f'?{"&".join(url_encode)}'
        return APIUtil(user_obj=self.user).call_get(safe_url=safe_url, headers=self.headers)

    def post(self, data) -> RespData:
        """
        Support call request API with POST method.
        Args:
            data: (dict): body data of request

        Returns: APIUtil --> call_get()
        """
        if isinstance(data, dict):
            return APIUtil(user_obj=self.user).call_post(safe_url=self.url, headers=self.headers, data=data)
        raise ValueError('Body data for POST request must be dictionary')
