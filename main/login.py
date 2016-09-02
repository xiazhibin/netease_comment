import requests
from encrypt_util import encrypted_request
from . import headers
import hashlib

phone = '13660569061'
pwd = hashlib.md5('bin123456').hexdigest()


def login():
        action = 'https://music.163.com/weapi/login/cellphone'
        text = {
            'phone': phone,
            'password': pwd,
            'rememberLogin': 'true'
        }
        data = encrypted_request(text)
        rv = requests.post(action, data=data, headers=headers, timeout=1)
        return rv.cookies

