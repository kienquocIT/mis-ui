from uuid import UUID


class TypeCheck(object):
    @staticmethod
    def check_uuid(data: any, return_data=False) -> (True or False) or (UUID or None):
        # check
        try:
            data_checked = UUID(data)
        except (Exception,):
            data_checked = None

        # return
        if return_data is True:
            return data_checked if data_checked else None
        return True if data_checked else False
