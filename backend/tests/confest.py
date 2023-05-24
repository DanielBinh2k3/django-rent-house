import pytest
from django.db import connection
from django.test.utils import override_settings


@pytest.fixture(scope='function')
def users_db(request):
    with override_settings(DATABASES={
        'default': {},
        'users': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'listingz_users',
            'USER': 'postgres',
            'PASSWORD': '123456',
            'HOST': 'db_users',
            "PORT": 5432,
        }
    }, DATABASE='users'):
        with connection.cursor() as cursor:
            cursor.execute('CREATE SCHEMA IF NOT EXISTS users')
        yield
        with connection.cursor() as cursor:
            cursor.execute('DROP SCHEMA IF EXISTS users CASCADE')


@pytest.fixture(scope='function')
def listings_db(request):
    with override_settings(DATABASES={
        'default': {},
        'listings': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'listingz_listings',
            'USER': 'postgres',
            'PASSWORD': '123456',
            'HOST': 'db_listings',
            "PORT": 5432,
        }
    }, DATABASE='listings'):
        with connection.cursor() as cursor:
            cursor.execute('CREATE SCHEMA IF NOT EXISTS listings')
        yield
        with connection.cursor() as cursor:
            cursor.execute('DROP SCHEMA IF EXISTS listings CASCADE')