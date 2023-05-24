from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from factories_user import UserAccountFactory
from user.models import UserAccount

class RetrieveUserViewTest(APITestCase):
    databases = ['users']

    def setUp(self):
        self.client = APIClient()

    def test_retrieve_user_information(self):
        self.user = UserAccountFactory()
        self.client.force_authenticate(user=self.user)
        url = reverse('retrieve-user-view')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_retrieve_user_information_not_found(self):
        url = reverse('retrieve-user-view')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class RegisterViewTestCase(APITestCase):
    databases = ['users']

    def setUp(self):
        self.client = APIClient()

    def test_register_user(self):
        url = reverse('register')
        data = {
            'email': 'test@example.com',
            'password': 'Testpassword@12',
            're_password': 'Testpassword@12',
            'name': 'Test User',
            'is_realtor': False,
        }
        response = self.client.post(url, data, format='json')
        print(123)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['success'], 'User created successfully')

    def test_register_realtor(self):
        url = reverse('register')
        data = {
            'email': 'realtor@example.com',
            'password': 'Testpassword@12',
            're_password': 'Testpassword@12',
            'name': 'Realtor User',
            'is_realtor': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['success'], 'Realtor account created successfully')

    def test_invalid_data(self):
        url = reverse('register')
        data = {
            'email': 'invalidemail',
            'password': 'short',
            're_password': 'short',
            'name': '',
            'is_realtor': False,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
    
class LogInUserViewTestCase(APITestCase):
    databases=['users']

    def setUp(self):
        self.url = reverse('login')
        self.user = UserAccount.objects.create_user(
            email= 'test@example.com',
            password='Testpassword@12',
            name='Test User'
        )
        
    def test_login_success(self):
        data = {
            'email': 'test@example.com',
            'password': 'Testpassword@12'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        
    def test_login_failure(self):
        data = {
            'email': 'test@example.com',
            'password': 'wrongpass'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)


