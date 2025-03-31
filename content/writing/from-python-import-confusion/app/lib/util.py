from . import log, format 

print(log, format)

def util():
    return 42 + log.log() + format.format()

if __name__ == '__main__':
    print("lib/util.py __name__", __name__)
