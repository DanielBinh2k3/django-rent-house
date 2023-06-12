import pytest
import factory
from base.models import UserAccount, UserAccountManager
from factories_user import UserAccountFactory, UserAccountManagerFactory
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.conf import settings
from django.test import override_settings
from django.db import connection
User = get_user_model()


@pytest.mark.django_db
class UserAccountTestCase(TestCase):


    def test_create_user_account(self):
        user = UserAccountFactory.create()
        assert UserAccount.objects.count() == 1
        assert UserAccount.objects.first() == user
        return user
    def test_create_realtor(self):
        realtor = UserAccountFactory(is_realtor=True)
        assert realtor.email
        assert realtor.name
        assert realtor.is_active == True
        assert realtor.is_staff == False
        assert realtor.is_superuser == False
        assert realtor.is_realtor == True

    def test_create_superuser(self):
        superuser = UserAccountFactory(is_superuser=True, is_staff=True)
        assert superuser.email
        assert superuser.name
        assert superuser.is_active == True
        assert superuser.is_staff == True
        assert superuser.is_superuser == True
        assert superuser.is_realtor == False

User = get_user_model()

# Then, you can use the factories in your test cases like this:
@pytest.mark.django_db
class UserAccountManagerTestCase(TestCase):
    def setUp(self):
        self.user_account_manager = UserAccountManager()

    def test_create_user(self):
        with self.assertRaises(ValueError):
            self.user_account_manager.create_user(email='', name='Test User', password='password')
        user = UserAccountManagerFactory()
        self.assertIsNotNone(user)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_realtor)
    def test_create_realtor(self):
        realtor = UserAccountManagerFactory(is_realtor=True)
        self.assertEqual(realtor.email, 'user0@example.com')
        self.assertIsNotNone(realtor)
        self.assertTrue(realtor.is_active)
        self.assertFalse(realtor.is_staff)
        self.assertTrue(realtor.is_realtor)
    def test_create_superuser(self):
        superuser = UserAccountManagerFactory(is_staff=True, is_superuser=True)
        self.assertIsNotNone(superuser)
        self.assertEqual(superuser.email, 'user1@example.com')
        self.assertTrue(superuser.is_active)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
