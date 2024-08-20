from django.utils import translation


def test():
    translation.activate('vi')
    print(translation.gettext_lazy('Preview full'))


def test_hmac():
    import hmac
    import hashlib

    # Dữ liệu và khóa bí mật
    message = b"Hello, World!"
    key = b"my-secret-key"

    # Tạo HMAC-SHA512
    hmac_sha512 = hmac.new(key, message, hashlib.sha512)
    mac = hmac_sha512.hexdigest()

    print(f"HMAC-SHA512: {mac}")


test_hmac()
