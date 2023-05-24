from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, Client
from listing.models import Listing
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase
from listing.models import Listing
from factories_listing import ListingFactory
import pytest
from rest_framework import status
from django.contrib.auth.models import User
import shutil
from django.test import override_settings
from django.contrib.auth import get_user_model
import factory
import os
from user.models import UserAccount
from listing.serializers import PropertySerializer
import json


class UserAccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserAccount

    email = factory.Sequence(lambda n: f'user{n}@example.com')
    name = factory.Sequence(lambda n: f'User {n}')
    password = factory.PostGenerationMethodCall('set_password', 'password')

TEST_DIR = 'test_data'

# @override_settings(MEDIA_ROOT=(TEST_DIR + '/media'))
@pytest.mark.django_db
class ListingViewTest(TestCase):
    databases = ['listings', 'users']
   
    def setUp(self, create_listings=False):
        self.client = APIClient()
        if create_listings:
            # Create 3 listings.
            for i in range(5):
                listing = ListingFactory.create(title=f'My Listing {i}',
                                                is_published=True)
                listing.save()

    # # Test Public View
    # def test_views_get_listings_success(self):
    #     self.setUp(create_listings=True)
    #     response = self.client.get("/api/listing/get-listings")
    #     self.assertIsInstance(response.data, list)
    #     self.assertEqual(response.status_code, 200)

    # def test_views_get_listings_not_found(self):
    #     response = self.client.get("/api/listing/get-listings")
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # # Test Public View Details
    # def test_views_details_success(self):
    #     # The listing exists.
    #     listing = ListingFactory.create(is_published=True)
    #     listing.save()
    #     response = self.client.get(f"/api/listing/detail?slug={listing.slug}")
    #     self.assertEqual(response.status_code, 200)
    #     listing_data = response.data
    #     self.assertIsInstance(listing_data, dict)
    #     self.assertEqual(response.status_code, 200)
    #     listing.delete()

    # def test_views_details_not_found(self):
    #     #test with non exist slug
    #     response = self.client.get('/api/listing/detail?slug=foobar')
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    # # Test Search View
    # def test_views_search_success(self):
    #     # The listing exists.
    #     self.setUp(create_listings=True)
    #     search_term = 'Listing'
    #     response = self.client.get(f"/api/listing/search?search={search_term}")
    #     self.assertEqual(response.status_code, 200)
    #     listing_data = response.data
    #     self.assertIsInstance(listing_data['listings'], list)
    #     for i in range(5):
    #         self.assertIn(search_term, listing_data['listings'][i]['title'])
    #     self.assertEqual(len(listing_data['listings']), 5)

    # def test_view_search_combined_search_success(self):
    #     # Test search with existing listings.
    #     self.setUp(create_listings=True)
    #     search_terms = {'city': 'Ho Chi Minh', 'home_type': 'House', 'max_price': 10000}
    #     response = self.client.get(f"/api/listing/search?city={search_terms['city']}&home_type={search_terms['home_type']}&max_price={search_terms['max_price']}")
    #     self.assertEqual(response.status_code, 200)
    #     listing_data = response.data
    #     self.assertIsInstance(listing_data['listings'], list)
    #     for i in range(len(listing_data['listings'])):
    #         self.assertIn(search_terms['city'], listing_data['listings'][i]['city'])
    #         self.assertIn(search_terms['home_type'], listing_data['listings'][i]['home_type'])
    #         self.assertTrue(search_terms['max_price']>=listing_data['listings'][i]['price'])

    # def test_views_search_not_found(self):
    #     #test with non exist slug
    #     response = self.client.get('/api/listing/search?search=')
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # # Test Manage View   

    # # Get Method
    # def test_manage_view_get_method(self):
    #     # Create a realtor user.
    #     realtor = UserAccountFactory(is_realtor=True)
    #     self.client.force_authenticate(realtor)

    #     # Create a listing for the realtor.
    #     listing = ListingFactory(realtor=realtor)
    #     # Get the listings for the realtor.
    #     response = self.client.get('/api/listing/manage')

    #     # Assert that the response is a 200 OK status code.
    #     self.assertEqual(response.status_code, 200)

    #     # Assert that the response contains the listing for the realtor.
    #     listing_data = response.data
    #     self.assertEqual(listing.id, int(listing_data[0]['id']))
    #     self.assertEqual(str(listing.realtor), (listing_data[0]['realtor']))
    
    # def test_manage_view_post_method(self):
    #     # Create a realtor user.
    #     realtor = UserAccountFactory(is_realtor=True)
    #     self.client.force_authenticate(realtor)

    #     # Create a listing data dictionary for the realtor.
    #     listing_data = ListingFactory(realtor=realtor)
    #     serialized_data = PropertySerializer(listing_data).data

    #     # Create file data for photos.
    #     photo_data = {}
    #     for i in range(1, 5):
    #         field_name = f'photo{i}'
    #         if field_name in serialized_data:
    #             file_path = serialized_data[field_name]
    #             ext = os.path.splitext(file_path)[1].lower() # Get file extension
    #             if ext == '.jpg' or ext == '.jpeg': # Check if file is a JPEG image
    #                 with open('D:/Learning/Web_Dev/Backend/Django_Python/Project_HouseOwner/backend' + file_path, 'rb') as f:
    #                     photo_data[field_name] = SimpleUploadedFile(f.name, f.read(), content_type='image/jpeg') # Set content type as JPEG
    #             else:
    #                 raise ValueError('Invalid file format. Upload only JPEG images.')

    #     main_photo_field_name = 'main_photo'
    #     if main_photo_field_name in serialized_data:
    #         main_photo_path = serialized_data[main_photo_field_name]
    #         ext = os.path.splitext(main_photo_path)[1].lower() # Get file extension
    #         if ext == '.jpg' or ext == '.jpeg': # Check if file is a JPEG image
    #             with open('D:/Learning/Web_Dev/Backend/Django_Python/Project_HouseOwner/backend' + main_photo_path, 'rb') as f:
    #                 photo_data[main_photo_field_name] = SimpleUploadedFile(f.name, f.read(), content_type='image/jpeg') # Set content type as JPEG
    #         else:
    #             raise ValueError('Invalid file format. Upload only JPEG images.')


    #     # Set content type to multipart/form-data
    #     content_type = 'multipart/form-data; boundary=<calculated when request is sent>'
    #     for field, image in photo_data.items():
    #         serialized_data[field] = image
    #     # Post the listing data.
    #     response = self.client.post(
    #         '/api/listing/manage',
    #         data=serialized_data,
    #         format='multipart',
    #     )

    #     print('Response content', response.content)
    #     # Assert that the response was created status successfully
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    #     # Assert that the listing was created.
    #     listing = Listing.objects.get(id=response.data['id'])
    #     self.assertEqual(listing.title, listing_data.title)
    #     self.assertEqual(listing.description, listing_data.description)
    #     self.assertEqual(listing.city, listing_data.city)
    #     self.assertEqual(listing.home_type, listing_data.home_type)
    #     self.assertEqual(listing.price, listing_data.price)

    def test_manage_view_put_method_text_success(self):
        update_field = {'title': 'Sample Title', 'description': 'Sample Description', 'city': 'Sample City', 'home_type': 'House', 'price': 1000}
        # Create a realtor user.
        realtor = UserAccountFactory(is_realtor=True)
        self.client.force_authenticate(realtor)

        # Create a listing data dictionary for the realtor.
        listing_data = ListingFactory(realtor=realtor)
        response = self.client.put(
            '/api/listing/manage/'+str(listing_data.id),
            data=update_field,
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Retrieve the updated object from the database.
        updated_listing_data = Listing.objects.get(id=listing_data.id)

        # Compare the updated attributes with the update_field dictionary.
        self.assertEqual(updated_listing_data.title, update_field['title'])
        self.assertEqual(updated_listing_data.description, update_field['description'])
        self.assertEqual(updated_listing_data.city, update_field['city'])
        self.assertEqual(updated_listing_data.home_type, update_field['home_type'])
        self.assertEqual(updated_listing_data.price, update_field['price'])

        # Delete the listing data.
        listing_data.delete()

    def test_manage_view_delete_method(self):
        # Create a realtor user.
        realtor = UserAccountFactory(is_realtor=True)
        self.client.force_authenticate(realtor)
        # Create a listing for the realtor.
        listing = ListingFactory(realtor=realtor)
        # Delete the listings for the realtor.
        response = self.client.delete('/api/listing/manage/'+ str(listing.id))
        
        # Assert that the response is a 200 OK status code.
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

def tearDownModule():
    print("\nDeleting temporary files...\n")
    try:
        shutil.rmtree(TEST_DIR)
    except OSError:
        pass