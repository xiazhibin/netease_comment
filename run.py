import socket
from time import sleep

from redis import StrictRedis

from main.comment import get_rv

key = 'song_comment'
key_count = 'key_count'
redis_store = StrictRedis(db=1)


def get_song_id_from_redis():
    song_id = redis_store.get(key_count)
    redis_store.incr(key_count)
    return song_id


def store(song_id, comment_num):
    if comment_num > 10000:
        url = 'http://music.163.com/#/song?id=@'.replace('@', str(song_id))
        redis_store.zadd(key, comment_num, url)


def show_rv():
    rv = redis_store.zrevrange(key, 0, 10)
    for url in rv:
        print url


def run():
    error_counter = 0
    while True:
        if error_counter == 10:
            error_counter = 0
            sleep(10)
        song_id = get_song_id_from_redis()
        print 'song id: %s' % song_id
        if int(song_id) < 5000000:
            try:
                comment_num = get_rv(song_id)
                if comment_num:
                    store(song_id, comment_num)
                sleep(4)
            except socket.timeout as e:
                error_counter += 1
                print e
            except Exception as e:
                error_counter += 1
                print e
        else:
            break
    show_rv()


if __name__ == '__main__':
    run()
