DEBUG = True
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "mis_ui",
        "USER": "root",
        "PASSWORD": "123456",
        "HOST": "127.0.0.1",
        "PORT": "3306",
        "OPTIONS": {
            # "db_collation": "utf8mb4_unicode_ci",
            # "init_command": "SET GLOBAL regexp_time_limit=1024;",
        },
    },
}
# DEBUG = False
ALLOWED_HOSTS = ['*']
