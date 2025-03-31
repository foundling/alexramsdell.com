from ..lib.util import util 

print('test/test_util.py. __name__: ', __name__) 

def test_util():
    assert util() == 4
