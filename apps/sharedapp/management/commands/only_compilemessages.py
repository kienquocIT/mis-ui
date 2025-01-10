import shutil
from django.core.management import call_command
from django.core.management.commands.makemessages import Command as BaseMakeMessagesCommand
from django.conf import settings


class Command(BaseMakeMessagesCommand):
    def add_arguments(self, parser):
        parser.add_argument('app_path', type=str, help='Đường dẫn đến ứng dụng')

    @classmethod
    def hide_root(cls):
        shutil.move('locale', 'localeTmp')

    @classmethod
    def show_root(cls):
        shutil.move('localeTmp', 'locale')

    def handle(self, *args, **kwargs):
        all_app = settings.INSTALLED_APPS
        app_path = kwargs['app_path']
        if app_path not in all_app:
            raise ValueError(f"app_path: '{app_path}' is not found in INSTALLED_APPS")

        app_path_arr = app_path.split(".")
        app_path_check = len(app_path_arr) - 1

        ignore_set = set([])

        def get_ignore(_path):
            return _path.replace(".", "/") + "/**"

        def add_ignore(_path):
            ignore_set.add(get_ignore(_path))

        for path in all_app:
            if '.' in path and path != app_path and not path.startswith('django'):
                path_arr = path.split(".")

                for idx, sub_path in enumerate(path_arr):
                    if idx >= app_path_check:
                        if get_ignore(".".join(path_arr[:idx + 1])) not in ignore_set:
                            cut_tmp = path_arr[app_path_check: len(path_arr)]
                            add_ignore("**/" + ".".join(cut_tmp))
                        # add_ignore(path)
                        break
                    else:
                        base_val = app_path_arr[idx]
                        if base_val != sub_path:
                            add_ignore(".".join(path_arr[:idx + 1]))
                            break

        ignore = [
            ['-i', item] for item in ignore_set
        ]
        tmp = ""
        for item in ignore:
            tmp += f"-i {item[1]} "

        self.hide_root()
        call_command('compilemessages', *ignore)
        self.show_root()
