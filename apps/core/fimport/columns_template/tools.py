__all__ = ['ResolveColumnsFImport']

from uuid import UUID


class ResolveColumnsFImport:
    def __init__(
            self, app_id: str or UUID, template_link: str, columns: list[dict] = None, validate: dict[str, dict] = None
    ):
        self.app_id = app_id
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

    @classmethod
    def validate_column(cls, col_data):
        if col_data and isinstance(col_data, dict):
            return {
                'name': '',
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
    def data(self):
        return {
            self.app_id: {
                'template_link': self.template_link,
                'columns': self.columns,
                'validate': self.validate,
            }
        }
