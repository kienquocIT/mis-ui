__all__ = ['ResolveColumnsFImport']

from uuid import UUID
from django.urls import reverse
from django.urls.exceptions import NoReverseMatch


class ResolveColumnsFImport:
    def __init__(
            self,
            app_id: str or UUID,
            url_name: str,
            template_link: str,
            columns: list[dict] = None,
            validate: dict[str, dict] = None,
            list_name: str = None, create_name: str = None,
    ):
        self.app_id = app_id
        self.url_name = url_name
        self.template_link = template_link
        self.columns = [
            self.validate_column(col_data=col_data)
            for col_data in (
                columns if isinstance(columns, list) else []
            )
        ]
        self.validate = (
            validate if isinstance(validate, dict) else {}
        )
        self.list_name = list_name
        self.create_name = create_name

    @classmethod
    def validate_column(cls, col_data):
        if col_data and isinstance(col_data, dict):
            return {
                'name': '',
                'input_name': None,
                'type': 'string',
                'remarks': '',
                'input_attrs': None,
                'col': 'auto',
                **col_data
            }
        raise ValueError('[ResolveColumnsFImport] Columns Data type should be dictionary.')

    def add_column(self, data):
        self.columns.append(
            self.validate_column(data)
        )
        return self

    @property
    def url(self):
        if self.url_name:
            try:
                return reverse(self.url_name)
            except NoReverseMatch:
                pass
        return None

    @property
    def url_list(self):
        if self.list_name:
            try:
                return reverse(self.list_name)
            except NoReverseMatch:
                pass
        return None

    @property
    def url_create(self):
        if self.create_name:
            try:
                return reverse(self.create_name)
            except NoReverseMatch:
                pass
        return None

    @property
    def data(self):
        return {
            self.app_id: {
                'url': self.url,
                'url_list': self.url_list,
                'url_create': self.url_create,
                'template_link': self.template_link,
                'columns': self.columns,
                'validate': self.validate,
            }
        }
