import requests
from django import forms
from django.conf import settings
from rest_framework import serializers

from apps.core.auths.msg import LoginMsg


class AuthLoginForm(forms.Form):
    tenant_code = forms.CharField()
    username = forms.CharField()
    password = forms.CharField()
    remember = forms.CharField()
    g_recaptcha_response = forms.CharField(empty_value=None)

    def clean_remember(self):
        if 'remember' in self.cleaned_data:
            if self.cleaned_data['remember'] == 'on':
                return True
        return False

    def clean_g_recaptcha_response(self):
        if 'g_recaptcha_response' in self.cleaned_data:
            data = self.cleaned_data['g_recaptcha_response']
            if settings.GG_RECAPTCHA_ENABLED:
                if not data:
                    return False

                response = requests.post(
                    'https://www.google.com/recaptcha/api/siteverify', data={
                        'secret': settings.GG_RECAPTCHA_SERVER_KEY,
                        'response': data
                    }
                )
                if response.status_code == 200:
                    response_data = response.json()
                    if response_data['success']:
                        return True
            else:
                return True
        return False


class AuthLoginSerializer(serializers.Serializer):  # noqa
    tenant_code = serializers.CharField(allow_blank=True, default='')
    username = serializers.CharField(allow_blank=True, default='')
    password = serializers.CharField(allow_blank=True, default='')
    remember = serializers.CharField(default='0')
    g_recaptcha_response = serializers.CharField(allow_blank=True, default=None)

    @classmethod
    def validate_tenant_code(cls, attr):
        if not attr:
            raise serializers.ValidationError({'tenant_code': LoginMsg.TENANT_FAIL})
        return attr

    @classmethod
    def validate_username(cls, attr):
        if not attr:
            raise serializers.ValidationError({'username': LoginMsg.USERNAME_FAIL})
        return attr

    @classmethod
    def validate_password(cls, attr):
        if not attr:
            raise serializers.ValidationError({'password': LoginMsg.PASSWORD_FAIL})
        return attr

    @classmethod
    def validate_remember(cls, attr):
        return attr == '1'

    @classmethod
    def validate_g_recaptcha_response(cls, attr):
        if not attr:
            return None
        return attr

    @classmethod
    def check_captcha(cls, captcha_data):
        if settings.GG_RECAPTCHA_ENABLED:
            if not captcha_data:
                return False

            response = requests.post(
                'https://www.google.com/recaptcha/api/siteverify', data={
                    'secret': settings.GG_RECAPTCHA_SERVER_KEY,
                    'response': captcha_data
                }
            )
            if response.status_code == 200:
                response_data = response.json()
                if response_data['success']:
                    return True
        else:
            return True

    def validate(self, attrs):
        tenant_code = attrs.get('tenant_code', None)
        username = attrs.get('username', None)
        password = attrs.get('password', None)

        if tenant_code and username and password:
            state_captcha = self.check_captcha(attrs['g_recaptcha_response'])
            if state_captcha:
                return attrs
            raise serializers.ValidationError({'g_recaptcha_response': LoginMsg.CAPTCHA_FAIL})
        raise serializers.ValidationError({'detail': LoginMsg.LOGIN_INSUFFICIENT})


class ForgotPasswordForm(forms.Form):
    tenant_code = forms.CharField()
    username = forms.CharField()
    g_recaptcha_response = forms.CharField(empty_value=None)

    def clean_g_recaptcha_response(self):
        if 'g_recaptcha_response' in self.cleaned_data:
            data = self.cleaned_data['g_recaptcha_response']
            if settings.GG_RECAPTCHA_ENABLED:
                if not data:
                    return False

                response = requests.post(
                    'https://www.google.com/recaptcha/api/siteverify', data={
                        'secret': settings.GG_RECAPTCHA_SERVER_KEY,
                        'response': data
                    }
                )
                if response.status_code == 200:
                    response_data = response.json()
                    if response_data['success']:
                        return True
            else:
                return True
        return False


class ForgotPasswordValidOTPForm(forms.Form):
    pk = forms.UUIDField()
    otp = forms.CharField()
    g_recaptcha_response = forms.CharField(empty_value=None)

    def clean_g_recaptcha_response(self):
        if 'g_recaptcha_response' in self.cleaned_data:
            data = self.cleaned_data['g_recaptcha_response']
            if settings.GG_RECAPTCHA_ENABLED:
                if not data:
                    return False

                response = requests.post(
                    'https://www.google.com/recaptcha/api/siteverify', data={
                        'secret': settings.GG_RECAPTCHA_SERVER_KEY,
                        'response': data
                    }
                )
                if response.status_code == 200:
                    response_data = response.json()
                    if response_data['success']:
                        return True
            else:
                return True
        return False


class ForgotPasswordResendOTP(forms.Form):
    pk = forms.UUIDField()
    g_recaptcha_response = forms.CharField(empty_value=None)

    def clean_g_recaptcha_response(self):
        if 'g_recaptcha_response' in self.cleaned_data:
            data = self.cleaned_data['g_recaptcha_response']
            if settings.GG_RECAPTCHA_ENABLED:
                if not data:
                    return False

                response = requests.post(
                    'https://www.google.com/recaptcha/api/siteverify', data={
                        'secret': settings.GG_RECAPTCHA_SERVER_KEY,
                        'response': data
                    }
                )
                if response.status_code == 200:
                    response_data = response.json()
                    if response_data['success']:
                        return True
            else:
                return True
        return False
