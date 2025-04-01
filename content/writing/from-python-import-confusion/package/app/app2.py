import module_a, module_b
from lib import exp

def main():
    print(module_a.fn_a() + module_b.fn_b())

if __name__ == '__main__':
    main()
