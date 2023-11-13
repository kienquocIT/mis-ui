from uuid import uuid4

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.conf import settings
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils import timezone

from apps.shared import AuthMsg, RandomGenerate, CacheController

from .managers import AccountManager


class AuthUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user_id = models.UUIDField()
    username_validator = UnicodeUsernameValidator()
    username_auth = models.CharField(
        verbose_name='''Account Username for Authenticate, 
            format: "{username}-{TenantCode|upper}", slugify before call authenticate''',
        help_text=AuthMsg.USERNAME_REQUIRE, error_messages={'unique': AuthMsg.USERNAME_ALREADY_EXISTS},
        max_length=150 + 32, unique=True, validators=[username_validator],
    )
    username = models.CharField(verbose_name='Account Username', max_length=150)
    first_name = models.CharField(verbose_name='first name', max_length=80, blank=True)
    last_name = models.CharField(verbose_name='last name', max_length=150, blank=True)
    email = models.EmailField(verbose_name='email address', blank=True, null=True)
    phone = models.CharField(verbose_name='phone number', max_length=50, blank=True, null=True)
    dob = models.DateField(verbose_name='birthday', null=True)
    gender = models.CharField(
        verbose_name='gender male or female', max_length=6, null=True,
    )
    language = models.CharField(
        verbose_name='language favorite: vi, en',
        choices=settings.LANGUAGE_CHOICE, max_length=2, default='vi',
    )
    avatar = models.TextField(null=True, verbose_name='avatar path')

    access_token = models.TextField(null=True, blank=True)
    refresh_token = models.TextField(null=True, blank=True)

    last_login = models.DateTimeField(verbose_name='Last Login', null=True)

    is_active = models.BooleanField(verbose_name='active', default=True)
    is_staff = models.BooleanField(verbose_name='staff status', default=False)
    is_superuser = models.BooleanField(default=False, verbose_name='superuser')

    objects = AccountManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username_auth'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.get_full_name()

    def get_full_name(self, order_arrange=2):
        """
        order_arrange: The ways arrange full name from first_name and last_name
        ---
        First Name: Nguyen Van
        Last Name: A

        Two ways arrange full name:
        [1] {First Name}{Space}{Last Name} <=> Nguyen Van A
        [2] {Last Name}{Point}{Space}{First Name} <=> A. Nguyen Van
        [Another] Return default order_arrange
        """
        if self.last_name or self.first_name:
            if order_arrange == 1:
                return '{}, {}'.format(self.last_name, self.first_name)  # first ways
            return '{}. {}'.format(self.last_name, self.first_name)  # second ways or another arrange
        return self.username

    class Meta:
        verbose_name = 'Account Abstract'
        verbose_name_plural = 'Account Abstract'
        abstract = True
        default_permissions = ()
        permissions = ()


class User(AuthUser):
    ui_space_selected = models.CharField(max_length=100, null=True, default=None, help_text='Space code of user')

    tenant_current_data = models.JSONField(default=dict, help_text='{"id": "", "title": "", "code": ""}')
    company_current_data = models.JSONField(default=dict, help_text='{"id": "", "title": "", "code": ""}')
    space_current_data = models.JSONField(default=dict, help_text='{"id": "", "title": "", "code": ""}')
    employee_current_data = models.JSONField(
        default=dict, help_text='{"id": "", "first_name": "", "last_name": "", "email": "", "phone": ""}'
    )
    companies_data = models.JSONField(default=list, help_text='[{...company detail...},]')
    is_admin_tenant = models.BooleanField(default=False)

    def update_avatar_hash(self, media_path_hash):
        if media_path_hash:
            self.avatar = media_path_hash
            self.save()

    @property
    def avatar_url(self):
        return f'{settings.MEDIA_PUBLIC_DOMAIN}p/f/avatar/{self.avatar}' if self.avatar else None

    class Meta:
        verbose_name = 'Account User'
        verbose_name_plural = 'Account User'
        default_permissions = ()
        permissions = ()

    @staticmethod
    def exist_key(dict_data):
        key_required = []
        for key in ['id', 'username', 'first_name', 'last_name', 'token']:
            if key not in dict_data:
                key_required.append(key)
        if key_required:
            return False, key_required
        return True, []

    @classmethod
    def regis_with_api_result(cls, api_result):
        state_check, key_require = cls.exist_key(api_result)
        if state_check:
            try:
                user = User.objects.get(username_auth=api_result['username_auth'], user_id=api_result['id'])
            except User.DoesNotExist:
                user = User.objects.create(
                    user_id=api_result['id'],
                    username_auth=api_result['username_auth'],
                    username=api_result['username'],
                    first_name=api_result['first_name'],
                    last_name=api_result['last_name'],
                    email=api_result.get('email', ''),
                    phone=api_result.get('phone', ''),
                    dob=api_result.get('dob', None),
                    gender=api_result.get('gender', None),
                    language=api_result.get('language', settings.LANGUAGE_CODE),
                    avatar=api_result.get('media_avatar_hash', None),
                    is_admin_tenant=api_result.get('is_admin_tenant', False),
                )
            except Exception as err:
                msg_err = f'The regis user process raise exception over happy case. (msg: {str(err)})'
                print(msg_err)
                return None
            user.user_id = api_result['id']
            user.username = api_result['username']
            user.first_name = api_result['first_name']
            user.last_name = api_result['last_name']
            user.email = api_result.get('email', '')
            user.phone = api_result.get('phone', '')
            user.dob = api_result.get('dob', None)
            user.gender = api_result.get('gender', None)
            user.language = api_result.get('language', settings.LANGUAGE_CODE)
            user.is_admin_tenant = api_result.get('is_admin_tenant', False)
            user.tenant_current_data = api_result.get('tenant_current', {})
            user.company_current_data = api_result.get('company_current', {})
            user.space_current_data = api_result.get('space_current', {})
            user.employee_current_data = api_result.get('employee_current', {})
            user.avatar = user.employee_current_data.get('media_avatar_hash', None)
            user.companies_data = api_result.get('companies', [])
            user.access_token = api_result['token']['access_token']
            user.refresh_token = api_result['token']['refresh_token']
            user.last_login = timezone.now()
            passwd_hidden = RandomGenerate.get_string(length=32, allow_special=True)
            user.set_password(passwd_hidden)
            user.save()
            return user
        print(f'Required key in value API: {", ".join(key_require)}')
        return None

    def save(self, *args, **kwargs):
        if self.tenant_current_data and isinstance(self.tenant_current_data, dict):
            tenant_id = self.tenant_current_data.get('id', '')
            tenant_code = self.tenant_current_data.get('code', '').lower()
            tenant_title = self.tenant_current_data.get('title', '')
            if tenant_title and tenant_code:
                tenant_obj, _created = Tenant.objects.get_or_create(
                    code=tenant_code, defaults={
                        'id': tenant_id, 'code': tenant_code, 'title': tenant_title,
                    }
                )

                if self.company_current_data and isinstance(self.company_current_data, dict):
                    sub_domain = self.company_current_data.get('sub_domain', '')
                    company_id = self.company_current_data.get('id', '')
                    company_code = self.company_current_data.get('code', '').lower()
                    company_title = self.company_current_data.get('title', '')
                    if sub_domain and company_code and company_title:
                        Company.objects.get_or_create(
                            sub_domain=sub_domain,
                            defaults={
                                'id': company_id,
                                'tenant': tenant_obj,
                                'code': company_code,
                                'title': company_title,
                            }
                        )
        super().save(*args, **kwargs)


class Tenant(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    title = models.CharField(max_length=200)
    code = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.code = self.code.lower()
        super().save(*args, **kwargs)

    key_cache__all_code = 'all_tenant_code'

    @classmethod
    def all_code(cls):
        cache_data = CacheController.get(cls.key_cache__all_code)
        if not cache_data:
            cache_data = [str(item).lower() for item in cls.objects.values_list('code', flat=True)]
            CacheController.set(cls.key_cache__all_code, cache_data)
        return cache_data

    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenant'
        ordering = ('code',)
        default_permissions = ()
        permissions = ()
        unique_together = ('code',)


class Company(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    code = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    # web builder
    sub_domain = models.CharField(max_length=35, unique=True)

    def save(self, *args, **kwargs):
        self.code = self.code.lower()
        super().save(*args, **kwargs)

    key_cache__all_sub_domain = 'all_sub_domain'

    @classmethod
    def all_sub_domain(cls):
        cache_data = CacheController.get(cls.key_cache__all_sub_domain)
        if not cache_data:
            cache_data = [str(item).lower() for item in cls.objects.values_list('sub_domain', flat=True)]
            CacheController.set(cls.key_cache__all_sub_domain, cache_data)
        return cache_data

    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Company'
        ordering = ('code',)
        default_permissions = ()
        permissions = ()
        unique_together = ('tenant_id', 'code',)
