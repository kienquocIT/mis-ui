import sys
import traceback
import json
import logging

from django.conf import settings
from .push_notify import TeleBotPushNotify

logger = logging.getLogger()


def handle_exception_all_view(_err, self):
    def get_user_id():
        if self.request.user and hasattr(self.request.user, 'id'):
            return self.request.user.id
        return ''

    data = traceback.format_exception(*sys.exc_info(), limit=None, chain=True)
    err_msg = "".join(json.loads(json.dumps(data).replace("\n", "").replace("^", "")))
    if settings.DEBUG is True:
        print(err_msg)
    else:
        logger.error(
            'URL: %s | USER_ID: %s - %s | METHOD: %s | ERR: %s | ERR_MSG: %s',
            str(self.request.path),
            str(get_user_id()),
            str(self.request.user),
            str(self.request.method),
            str(err_msg),
            str(_err),
        )
    msg = TeleBotPushNotify.generate_msg(
        idx='500',
        status='CRITICAL',
        group_name='SERVER_EXCEPTION',
        **{
            'url': str(self.request.path),
            'user_id': str(get_user_id()),
            'user': str(self.request.user),
            'request_method': str(self.request.method),
            'err_msg': str(err_msg),
            'err': str(_err),
        }
    )
    TeleBotPushNotify().send_msg(msg=msg)
