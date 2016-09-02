import requests
from bs4 import BeautifulSoup
from encrypt_util import encrypted_request
from . import headers

proxies = {
    "http": "http://120.52.72.24:80",
}


def get_rv(song_id):
    comment_id = get_comment_id(song_id)
    if comment_id:
        return get_total_comment_count(comment_id)
    else:
        return None


def get_comment_id(song_id):
    url = 'http://music.163.com/song?id=' + str(song_id)
    requests.adapters.DEFAULT_RETRIES = 1
    r = requests.get(url, timeout=1)
    html = BeautifulSoup(r.content, 'lxml', from_encoding='utf-8')
    comment_tag = html.find(id='comment-box')
    if comment_tag:
        comment_id = comment_tag['data-tid']
        return comment_id
    else:
        return None


def get_total_comment_count(comment_id):
    url = 'http://music.163.com/weapi/v1/resource/comments/' + comment_id + '/?csrf_token='
    text = {
        'username': 'email',
        'password': 'pwd',
        'rememberLogin': 'true'
    }
    data = encrypted_request(text)
    req = requests.post(url, headers=headers, data=data, timeout=1)
    rv = req.json()
    return rv['total']
