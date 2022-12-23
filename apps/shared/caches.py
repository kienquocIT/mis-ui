from django.core.cache import cache


class CacheKeyCollect:
    BREADCRUMB = 'breadcrumb_all'
    SPACES = 'space_all'


class CacheController:
    DEFAULT_TIMEOUT = 60

    def __init__(self):
        pass

    @staticmethod
    def set(key, data):
        cache.set(key, data, timeout=60)
        return True

    @staticmethod
    def get(key):
        return cache.get(key, None)

    @staticmethod
    def delete(key):
        return cache.delete(key)

    @classmethod
    def clean_by_all(cls, key_all):
        data = cache.get(key_all, [])
        if data and isinstance(data, list):
            for key in data:
                cls.delete(key)
        return True

    @classmethod
    def append_by_all(cls, key_all, key_append):
        data = cache.get(key_all, [])
        if isinstance(data, list):
            data.append(key_append)
            cls.set(key_all, list(set(data)))
        else:
            cls.set(key_all, [key_append])
        return True
