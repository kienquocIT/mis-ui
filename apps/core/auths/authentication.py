from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

from apps.shared import CacheController


UserModel = get_user_model()


class MyAuthenticate(ModelBackend):
    def get_user(self, user_id):
        try:
            cls = CacheController()
            key = f'user_obj_${str(user_id)}'
            value = cls.get(key)
            if value:
                user = value
            else:
                user = UserModel._default_manager.select_related('company').get(pk=user_id)
                cls.set(key, user, timeout=60)
        except UserModel.DoesNotExist:
            return None
        return user if self.user_can_authenticate(user) else None
