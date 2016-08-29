# !/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import os
import base64
from Crypto.Cipher import AES
from bs4 import BeautifulSoup
import requests




def get_rv(song_id):
    comment_id = get_comment_id(song_id)
    if comment_id:
        return get_total_comment_count(comment_id)
    else:
        return None


def get_comment_id(song_id):
    url = 'http://music.163.com/song?id=' + str(song_id)
    r = requests.get(url)
    html = BeautifulSoup(r.content, 'lxml', from_encoding='utf-8')
    comment_tag = html.find(id='comment-box')
    if comment_tag:
        comment_id = comment_tag['data-tid']
        return comment_id
    else:
        return None


def aes_encrypt(text, secKey):
    pad = 16 - len(text) % 16
    text = text + pad * chr(pad)
    encryptor = AES.new(secKey, 2, '0102030405060708')
    ciphertext = encryptor.encrypt(text)
    ciphertext = base64.b64encode(ciphertext)
    return ciphertext


def rsa_encrypt(text, pubKey, modulus):
    text = text[::-1]
    rs = int(text.encode('hex'), 16) ** int(pubKey, 16) % int(modulus, 16)
    return format(rs, 'x').zfill(256)


def create_secret_key(size):
    return (''.join(map(lambda xx: (hex(ord(xx))[2:]), os.urandom(size))))[0:16]


def get_total_comment_count(comment_id):
    url = 'http://music.163.com/weapi/v1/resource/comments/'+comment_id+'/?csrf_token='
    headers = {
        'Cookie': 'appver=1.5.0.75771;',
        'Referer': 'http://music.163.com/'
    }
    text = {
        'username': 'email',
        'password': 'pwd',
        'rememberLogin': 'true'
    }
    modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725' \
              '152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda' \
              '92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4' \
              '875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
    nonce = '0CoJUm6Qyw8W8jud'
    pubKey = '010001'
    text = json.dumps(text)
    secKey = create_secret_key(16)
    encText = aes_encrypt(aes_encrypt(text, nonce), secKey)
    encSecKey = rsa_encrypt(secKey, pubKey, modulus)
    data = {
        'params': encText,
        'encSecKey': encSecKey
    }
    req = requests.post(url, headers=headers, data=data)
    rv = req.json()
    return rv['total']
