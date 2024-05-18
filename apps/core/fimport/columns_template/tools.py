__all__ = ['ResolveColumnsFImport']

from typing import TypedDict, Union
from uuid import UUID
from django.urls import reverse
from django.urls.exceptions import NoReverseMatch


class ColumnItemDict(TypedDict, total=False):
    name: str
    input_name: str
    type: str
    data_list: list[tuple[Union[str, int], any]]
    select2_config: dict[str, any]
    remarks: list
    is_primary_key: bool
    is_unique: bool
    is_unique_together: list
    is_foreign_key: Union[None, str]
    allow_edit_big_field: bool
    col_attrs: dict
    input_attrs: dict


class ResolveColumnsFImport:
    def __init__(
            self,
            app_id: str or UUID,
            url_name: str,
            template_link: str,
            sheet_name: str,
            columns: list[ColumnItemDict] = None,
            validate: dict[str, dict] = None,
            list_name: str = None, create_name: str = None,
    ):
        self.app_id = app_id
        self.url_name = url_name
        self.template_link = template_link
        if columns:
            self.columns = [
                self.validate_column(
                    col_data=col_data if index != 0 else {
                        **col_data,
                        'allow_edit_big_field': False,
                        'col_attrs': {
                            'style': 'max-width: 50px',
                        },
                    }
                )
                for index, col_data in enumerate(
                    columns if isinstance(columns, list) else []
                )
            ]
        else:
            self.columns = [{
                'name': 'No.',
                'type': 'number',
            }]
        self.validate = (
            validate if isinstance(validate, dict) else {}
        )
        self.list_name = list_name
        self.create_name = create_name
        self.sheet_name = sheet_name

    @classmethod
    def validate_column(cls, col_data: ColumnItemDict):
        if col_data and isinstance(col_data, dict):
            ctx = {
                'name': '',
                'input_name': None,
                'type': 'string',
                'data_list': [],
                'select2_config': {},
                'remarks': '',
                'input_attrs': None,
                'is_primary_key': False,
                'is_unique': False,
                'is_unique_together': [],
                'is_foreign_key': None,
                'allow_edit_big_field': True,
                'col_attrs': {},
                **col_data
            }
            if ctx['is_primary_key'] is True:
                ctx['is_unique'] = False
                ctx['is_unique_together'] = False
            return ctx
        raise ValueError('[ResolveColumnsFImport] Columns Data type should be dictionary.')

    def add_column(self, name, data: ColumnItemDict):
        self.columns.append(
            self.validate_column({
                'name': name,
                **data
            })
        )
        return self

    def add_validate(self, name, data: dict):
        self.validate[name] = data
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
                'sheet_name': self.sheet_name,
                'url': self.url,
                'url_list': self.url_list,
                'url_create': self.url_create,
                'template_link': self.template_link,
                'columns': self.columns,
                'validate': self.validate,
            }
        }
