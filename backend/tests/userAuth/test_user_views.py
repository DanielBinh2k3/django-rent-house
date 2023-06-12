from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.test import force_authenticate
from factories_user import UserAccountFactory
from base.models import UserAccount


class RetrieveUserViewTest(APITestCase):
    def setUp(self):
        self.user = UserAccountFactory()
        

    def test_retrieve_user_information(self):
        url = reverse('retrieve-user-view')
        self.client.force_authenticate(self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user_information_not_authenticate(self):
        url = reverse('retrieve-user-view')  # Assuming 999 is an invalid user ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        

class RegisterViewTestCase(APITestCase):
    
    def test_register_user(self):
        url = reverse('register')
        data = {
            'email': 'test@example.com',
            'password': 'Testpassword@12',
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
            'name': 'Realtor User',
            'is_realtor': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['success'], 'Realtor account created successfully')
        
    def test_create_user_account(self):
        user_account = UserAccountFactory()  # Create a UserAccount instance with default values
        self.assertEqual(UserAccount.objects.count(), 1)

    def test_invalid_data(self):
        url = reverse('register')
        data = {
            'email': 'invalidemail',
            'password': 'short',
            'name': '',
            'is_realtor': False,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
    
class LogInUserViewTestCase(APITestCase):

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
        self.assertIn('access_token', response.data)
        
    def test_login_failure(self):
        data = {
            'email': 'test@example.com',
            'password': 'wrongpass'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)


