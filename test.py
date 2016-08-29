import os

size = 16
def fun(xx):
    print hex(ord(xx))
    print hex(ord(xx))[2:]

map(lambda xx: fun(xx), os.urandom(size))
