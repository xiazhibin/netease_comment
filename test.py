# from redis import StrictRedis
#
# key = 'song_comment'
# redis_store = StrictRedis(db=1)
#
# f = open('list.txt', 'w')
# for url in redis_store.zrange(key, 0, -1):
#     f.write(url+'\n')
# f.close
from main.track import songs_detail_new_api
songs_detail_new_api([418602086])

