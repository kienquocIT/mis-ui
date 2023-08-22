import requests
from django import forms
from django.conf import settings


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
