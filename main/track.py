'''http://music.163.com/weapi/playlist/manipulate/tracks?csrf='''
from .login import login
import requests
from . import headers
from encrypt_util import encrypted_request
import json


#get a song mp3
def songs_detail_new_api(music_ids, bit_rate=320000):
    cookies = login()
    action = 'http://music.163.com/weapi/song/enhance/player/url?csrf_token='  # NOQA
    csrf = ''
    for cookie in cookies:
        if cookie.name == '__csrf':
            csrf = cookie.value
    if csrf == '':
        print 'You Need Login'
    action += csrf
    xx = json.dumps(music_ids)
    data = {'ids': xx, 'br': bit_rate}
    rv = requests.post(action, data=encrypted_request(data), headers=headers, timeout=5, cookies=cookies)
    js = rv.json()
    print js
    return rv.cookies