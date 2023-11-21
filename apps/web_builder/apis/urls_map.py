class StringUrl(str):  # pylint: disable=too-few-public-methods
    def fill_key(self, **kwargs):
        """return kwargs with format"""
        # 'abc/{a1}/{b1}/{c1}' + kwargs={"a1": "1", "b1": 2, "c1": 3}
        # Return ==> 'abc/1/2/3'
        return self.format(**kwargs)

    def fill_idx(self, *args):
        """return str with format"""
        # 'abc/{}/{}/{}' + args=[1, 2, 3]
        # Return ==> 'abc/1/2/3'
        return self.format(*args)


class ApiPublicURL:  # pylint: disable=too-few-public-methods
    """API link BE"""

    PUBLIC_PRODUCT_LIST = StringUrl('site/public/{sub_domain}/products')
    PUBLIC_PRODUCT_DETAIL = StringUrl('site/public/{sub_domain}/product/{pk}')
