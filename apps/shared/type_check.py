"""system module"""
from uuid import UUID


class TypeCheck:  # pylint: disable=too-few-public-methods
    """check type of str is uuid"""
    @staticmethod
    def check_uuid(data: any, return_data=False) -> (True or False) or (UUID or None):
        """method check uuid"""
        # check
        try:
            data_checked = UUID(data)
        except ValueError:
            data_checked = None

        # return
        if return_data is True:
            return data_checked if data_checked else None
        return bool(data_checked)
