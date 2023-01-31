import requests

from typing import Callable, Dict, TypedDict

from django.db.models import Model
from django.conf import settings
from django.http import response
from rest_framework import status

from .urls_map import ApiURL

api_url_refresh_token = ApiURL.refresh_token


class RespDict(TypedDict, total=False):
    state: Callable[[bool or None], bool or None]
    status: Callable[[int or None], int or None]
    result: Callable[[list or dict], list or dict]
    errors: Callable[[dict], dict]
    page_size: Callable[[int], int]
    page_count: Callable[[int], int]
    page_next: Callable[[int], int]
    page_previous: Callable[[int], int]
    all: Callable[[dict], dict]


class RespData(object):
    """
    Object convert response data
        state: bool : state call API
        result: dict or list : data
        errors: dict : errors server return
    """

    def __init__(
            self,
            _state=None, _result=None, _errors=None, _status=None,
            _page_size=None, _page_count=None, _page_next=None, _page_previous=None,
    ):
        """
        Properties will keep type of attribute that is always correct
        Args: attribute of Http Response
            _state: status_code | success: 200 - 200 | fail: others
            _result: .json()['result'] | 'result' is default | You can custom key - confirm with API Docs
            _errors: .json()['errors'] | 'errors' is default | You can custom key - confirm with API Docs
        """
        self._state = _state if _state is not None else False
        self._result = _result if _result is not None else {}
        self._errors = _errors if _errors is not None else {}
        self._status = _status if _status is not None else status.HTTP_500_INTERNAL_SERVER_ERROR
        self._page_size = _page_size if _page_size is not None else 0
        self._page_count = _page_count if _page_count is not None else 0
        self._page_next = _page_next if _page_next is not None else 0
        self._page_previous = _page_previous if _page_previous is not None else 0

    @property
    def state(self) -> bool:
        if isinstance(self._state, int):
            if 200 <= self._state < 300:
                return True
            return False
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return False
        raise AttributeError(
            f'[Response Data Parser][STATE] '
            f'convert process is incorrect when it return {type(self._state)}({str(self._state)[:30]}) '
            f'instead of BOOLEAN types.'
        )

    @property
    def result(self) -> dict or list:
        if isinstance(self._result, (dict, list)):
            return self._result
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return {}
        raise AttributeError(
            f'[Response Data Parser][RESULT] '
            f'convert process is incorrect when it return {type(self._result)}({str(self._result)[:30]}) '
            f'instead of LIST or DICT types.'
        )

    @property
    def errors(self) -> dict:
        if isinstance(self._errors, dict):
            return self._errors
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return {}
        raise AttributeError(
            f'[Response Data Parser][ERRORS] '
            f'convert process is incorrect when it return {type(self._errors)}({str(self._errors)[:30]}) '
            f'instead of DICT types.'
        )

    @property
    def status(self) -> int:
        if isinstance(self._status, int):
            return self._status
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return status.HTTP_500_INTERNAL_SERVER_ERROR
        raise AttributeError(
            f'[Response Data Parser][STATUS] '
            f'convert process is incorrect when it return {type(self._errors)}({str(self._errors)[:30]}) '
            f'instead of INTEGER types.'
        )

    @property
    def page_size(self) -> int:
        if isinstance(self._page_size, int):
            return self._page_size
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return 0
        raise AttributeError(
            f'[Response Data Parser][PAGE_SIZE] '
            f'convert process is incorrect when it return {type(self._errors)}({str(self._errors)[:30]}) '
            f'instead of INTEGER types.'
        )

    @property
    def page_count(self) -> int:
        if isinstance(self._page_count, int):
            return self._page_count
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return 0
        raise AttributeError(
            f'[Response Data Parser][PAGE_COUNT] '
            f'convert process is incorrect when it return {type(self._errors)}({str(self._errors)[:30]}) '
            f'instead of INTEGER types.'
        )

    @property
    def page_next(self) -> int:
        if isinstance(self._page_next, int):
            return self._page_next
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return 0
        raise AttributeError(
            f'[Response Data Parser][PAGE_NEXT] '
            f'convert process is incorrect when it return {type(self._errors)}({str(self._errors)[:30]}) '
            f'instead of INTEGER types.'
        )

    @property
    def page_previous(self) -> int:
        if isinstance(self._page_previous, int):
            return self._page_previous
        if settings.RAISE_EXCEPTION_DEBUG is False:
            return 0
        raise AttributeError(
            f'[Response Data Parser][PAGE_PREVIOUS] '
            f'convert process is incorrect when it return {type(self._errors)}({str(self._errors)[:30]}) '
            f'instead of INTEGER types.'
        )

    def get_full_data(self, func_change_data: RespDict = None) -> dict:
        data_all = DictFillResp({}).fill_full(self)  # call fill data to dict
        allow_change_keys = data_all.keys()
        if func_change_data:
            for key, func_call in func_change_data.items():
                if key == 'all':
                    data_all = func_call(data_all)
                elif key in allow_change_keys:
                    data_all[key] = func_call(data_all[key])
        return data_all


class DictFillResp(dict):
    def fill_state(self, resp: RespData):
        self[settings.UI_RESP_KEY_STATE] = resp.state
        return self

    def fill_status(self, resp: RespData):
        self[settings.UI_RESP_KEY_STATUS] = resp.status
        return self

    def fill_result(self, resp: RespData):
        self[settings.UI_RESP_KEY_RESULT] = resp.result
        return self

    def fill_errors(self, resp: RespData):
        self[settings.UI_RESP_KEY_ERRORS] = resp.errors
        return self

    def fill_page_size(self, resp: RespData):
        self[settings.UI_RESP_KEY_PAGE_SIZE] = resp.page_size
        return self

    def fill_page_count(self, resp: RespData):
        self[settings.UI_RESP_KEY_PAGE_COUNT] = resp.page_count
        return self

    def fill_page_next(self, resp: RespData):
        self[settings.UI_RESP_KEY_PAGE_NEXT] = resp.page_next
        return self

    def fill_page_previous(self, resp: RespData):
        self[settings.UI_RESP_KEY_PAGE_PREVIOUS] = resp.page_previous
        return self

    def fill_full(self, resp):
        self.fill_state(resp)
        self.fill_status(resp)
        self.fill_result(resp)
        self.fill_errors(resp)
        self.fill_page_count(resp)
        self.fill_page_next(resp)
        self.fill_page_previous(resp)
        return self


class APIUtil:
    key_auth = settings.API_KEY_AUTH
    prefix_token = settings.API_PREFIX_TOKEN
    key_response_data = settings.API_KEY_RESPONSE_DATA
    key_response_err = settings.API_KEY_RESPONSE_ERRORS
    key_response_status = settings.API_KEY_RESPONSE_STATUS
    key_response_page_size = settings.API_KEY_RESPONSE_PAGE_SIZE
    key_response_page_count = settings.API_KEY_RESPONSE_PAGE_COUNT
    key_response_page_next = settings.API_KEY_RESPONSE_PAGE_NEXT
    key_response_page_previous = settings.API_KEY_RESPONSE_PAGE_PREVIOUS

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
            resp_obj = ServerAPI(url=api_url_refresh_token).post(
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
        access_token = cls.get_new_token(refresh_token=getattr(user_obj, 'refresh_token', None))
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
            _state=resp.status_code,
            _result=resp_json.get(cls.key_response_data, {}),
            _errors=resp_json.get(cls.key_response_err, {}),
            _status=resp_json.get(cls.key_response_status, resp.status_code),
            _page_size=resp_json.get(cls.key_response_status, resp.status_code),
            _page_count=resp_json.get(cls.key_response_page_count, None),
            _page_next=resp_json.get(cls.key_response_page_next, None),
            _page_previous=resp_json.get(cls.key_response_page_previous, None),
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

    def call_put(self, safe_url: str, headers: dict, data: dict) -> RespData:
        """
        Support ServerAPI call to server with PUT method. (refresh token after recall if token is expires)
        Args:
            safe_url: (string) url parsed
            headers: (dict) headers add to request
            data: (dict) body data of request

        Returns: RespData object have attribute state, result, errors
            state: (bool) True if status_code is range (200, 300) else False : Is success call
            result: (dict or list) : is Response Data from API
            errors: (dict) : is Error Data from API
        """
        resp = requests.put(url=safe_url, headers=headers, json=data)
        if resp.status_code == 401:
            if self.user_obj:
                # refresh token
                headers_upgrade = self.refresh_token(user_obj=self.user_obj)
                if headers_upgrade:
                    headers.update(headers_upgrade)
                    resp = requests.put(url=safe_url, headers=headers, json=data)
        return self.get_data_from_resp(resp)

    def call_delete(self, safe_url: str, headers: dict, data: dict) -> RespData:
        """
        Support ServerAPI call to server with DELETE method. (refresh token after recall if token is expires)
        Args:
            safe_url: (string) url parsed
            headers: (dict) headers add to request
            data: (dict) body data of request

        Returns: RespData object have attribute state, result, errors
            state: (bool) True if status_code is range (200, 300) else False : Is success call
            result: (dict or list) : is Response Data from API
            errors: (dict) : is Error Data from API
        """
        resp = requests.delete(url=safe_url, headers=headers, json=data)
        if resp.status_code == 401:
            if self.user_obj:
                # refresh token
                headers_upgrade = self.refresh_token(user_obj=self.user_obj)
                if headers_upgrade:
                    headers.update(headers_upgrade)
                    resp = requests.delete(url=safe_url, headers=headers, json=data)
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

        Returns: APIUtil --> call_post()
        """
        if isinstance(data, dict):
            return APIUtil(user_obj=self.user).call_post(safe_url=self.url, headers=self.headers, data=data)
        raise ValueError('Body data for POST request must be dictionary')

    def put(self, data) -> RespData:
        """
        Support call request API with PUT method.
        Args:
            data: (dict): body data of request

        Returns: APIUtil --> call_put()
        """
        if isinstance(data, dict):
            return APIUtil(user_obj=self.user).call_put(safe_url=self.url, headers=self.headers, data=data)
        raise ValueError('Body data for POST request must be dictionary')

    def delete(self, data) -> RespData:
        """
        Support call request API with DELETE method.
        Args:
            data: (dict): body data of request

        Returns: APIUtil --> call_delete()
        """
        if isinstance(data, dict):
            return APIUtil(user_obj=self.user).call_delete(safe_url=self.url, headers=self.headers, data=data)
        raise ValueError('Body data for POST request must be dictionary')
