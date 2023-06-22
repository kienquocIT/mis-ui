__all__ = [
    'ReverseUrlCommon',
]

from django.urls import reverse, NoReverseMatch

from apps.shared import TypeCheck


class ReverseUrlCommon:
    @classmethod
    def get_link_by_name(cls, view_name):
        try:
            return reverse(view_name)
        except NoReverseMatch as _err:
            pass
        return None

    @classmethod
    def get_link(cls, plan, app, pk=None) -> any:
        if pk in [0, '0']:
            pk = None

        if pk is not None and not TypeCheck.check_uuid(pk):
            return None

        if plan and app:
            apps_of_plan = PLAN_APP_MAP_VIEW.get(plan, {})
            if apps_of_plan and isinstance(apps_of_plan, dict):
                views_of_app = apps_of_plan.get(app, {})
                if views_of_app and isinstance(views_of_app, dict):
                    try:
                        if pk:
                            return reverse(views_of_app['detail'], kwargs={views_of_app['key_pk']: pk})
                        return reverse(views_of_app['list'])
                    except NoReverseMatch as _err:
                        pass
        return None

    def __init__(self, list_view_name, detail_view_name, key_pk=None):
        self.list_view_name = list_view_name
        self.detail_view_name = detail_view_name
        self.key_pk = key_pk if key_pk else 'pk'

    @property
    def data(self):
        return {
            'list': self.list_view_name,
            'detail': self.detail_view_name,
            'key_pk': self.key_pk
        }


PLAN_APP_MAP_VIEW = {
    'saledata': {
        'contact': ReverseUrlCommon(list_view_name='ContactList', detail_view_name='ContactDetail').data,
        'account': ReverseUrlCommon(list_view_name='AccountList', detail_view_name='AccountDetail').data,
    }
}
