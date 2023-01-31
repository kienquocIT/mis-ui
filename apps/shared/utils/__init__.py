import string

import random


class RandomGenerate:
    REPEAT_TIME_MAX = 10

    @classmethod
    def check_uppercase(
            cls, data: str, replace_random: bool = False, exclude_replace_idx: list = None
    ) -> (str or None, int):
        if isinstance(exclude_replace_idx, list):
            exclude_replace_idx = []
        if not any(x.isupper() for x in data):
            if replace_random:
                idx_replace = cls.get_int(len(data), excludes=exclude_replace_idx)
                data_arr = list(data)
                data_arr[idx_replace] = data_arr[idx_replace].upper()
                return str("".join(data_arr)), idx_replace
            return None, None
        return data, None

    @classmethod
    def check_lowercase(
            cls, data: str, replace_random: bool = False, exclude_replace_idx: list = None
    ) -> (str or None, int):
        if isinstance(exclude_replace_idx, list):
            exclude_replace_idx = []
        if not any(x.isupper() for x in data):
            if replace_random:
                idx_replace = cls.get_int(len(data), excludes=exclude_replace_idx)
                data_arr = list(data)
                data_arr[idx_replace] = data_arr[idx_replace].lower()
                return str("".join(data_arr)), idx_replace
            return None, None
        return data, None

    @classmethod
    def check_digits(
            cls, data: str, replace_random: bool = False, exclude_replace_idx: list = None
    ) -> (str or None, int):
        if isinstance(exclude_replace_idx, list):
            exclude_replace_idx = []
        if not any(x.isupper() for x in data):
            if replace_random:
                idx_replace = cls.get_int(len(data), excludes=exclude_replace_idx)
                data_arr = list(data)
                data_arr[idx_replace] = random.choice(string.digits)
                return str("".join(data_arr)), idx_replace
            return None, None
        return data, None

    @classmethod
    def get_int(
            cls, max_int: int, start_with=0, excludes=None, repeat_times=0
    ) -> int:
        if repeat_times < cls.REPEAT_TIME_MAX:
            if not isinstance(excludes, list):
                excludes = []
            tmp = random.choice(range(start_with, max_int))
            if tmp in excludes:
                return cls.get_int(max_int, start_with, excludes, repeat_times + 1)
            return tmp
        return 0

    @classmethod
    def get_string(
            cls,
            length=12,
            allow_upper=True, allow_digits=True, allow_special=False, allow_space=False,
            require_upper=False, require_digits=False, require_special=False,
    ):
        """
        Always allow lowercase character then append more option character to choices
        Args:
            length:
            allow_upper: Allow uppercase character exist in choices
            allow_digits: Allow digits character exist in choices
            allow_special: Allow specials character exist in choices
            allow_space: Allow whitespace character exist in choices
            require_special: Check and replace data returned for condition SPECIAL CHARACTER CHECK
            require_digits: Check and replace data returned for condition DIGITS CHECK
            require_upper: Check and replace data returned for condition UPPERCASE CHECK

        Returns:

        """
        if length and length > 0:
            # setup choices data
            arr_choices = string.ascii_lowercase
            if allow_upper is True:
                arr_choices += string.ascii_uppercase
            if allow_digits is True:
                arr_choices += string.digits
            if allow_special is True:
                arr_choices += string.punctuation
            if allow_space is True:
                arr_choices += string.whitespace

            # generate
            result = "".join([random.choice(arr_choices) for _idx in range(0, length)])

            # check required
            idx_used = []
            if require_upper:
                result_tmp, idx_upper = cls.check_uppercase(
                    data=result, replace_random=True, exclude_replace_idx=idx_used
                )
                idx_used.append(idx_upper)
                if not isinstance(result_tmp, str):
                    print('result over except case UPPER CHECK')
                else:
                    result = result_tmp

            if require_digits:
                result_tmp, idx_digits = cls.check_digits(
                    data=result, replace_random=True, exclude_replace_idx=idx_used
                )
                idx_used.append(idx_digits)
                if not isinstance(result_tmp, str):
                    print('result over except case UPPER CHECK')
                else:
                    result = result_tmp

            if require_special:
                result_tmp, idx_lower = cls.check_lowercase(
                    data=result, replace_random=True, exclude_replace_idx=idx_used
                )
                idx_used.append(idx_lower)
                if not isinstance(result_tmp, str):
                    print('result over except case UPPER CHECK')
                else:
                    result = result_tmp

            # return
            return str(result)
        return ''
