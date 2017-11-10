from setuptools import setup

setup(
    name='lektor-versioning',
    version='0.1',
    author=u'Alex Ramsdell',
    author_email='alexramsdell@gmail.com',
    license='MIT',
    py_modules=['lektor_versioning'],
    entry_points={
        'lektor.plugins': [
            'versioning = lektor_versioning:VersioningPlugin',
        ]
    }
)
