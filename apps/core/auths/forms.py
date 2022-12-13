from django import forms


class AuthLoginForm(forms.Form):
    tenant_code = forms.CharField()
    username = forms.CharField()
    password = forms.CharField()
    remember = forms.CharField()

    def clean_remember(self):
        if 'remember' in self.cleaned_data:
            if self.cleaned_data['remember'] == 'on':
                return True
        return False
