from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, Client
from base.models import Listing, City, District
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase
from factories_listing import ListingFactory
import pytest
from rest_framework import status
from django.contrib.auth.models import User
import shutil
from django.test import override_settings
from django.contrib.auth import get_user_model
import factory
import os
from base.models import UserAccount
from base.serializers.listing_serializers import PropertySerializer
import json


from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient
from factories_listing import ListingFactory, ListingsImageFactory
from django.forms.models import model_to_dict

class UserAccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserAccount

    email = factory.Sequence(lambda n: f'user{n}@example.com')
    name = factory.Sequence(lambda n: f'User {n}')
    password = factory.PostGenerationMethodCall('set_password', 'password')

TEST_DIR = 'test_data'


@override_settings(MEDIA_ROOT=(TEST_DIR + '/media'))
@pytest.mark.django_db
class ListingViewTest(APITestCase):
        
    def setUp(self):
        # xóa create = True
        # self.client = APIClient()
        # if create_listings:
        # Create 5 listings with 3 images.
        print('set up')
        listings = ListingFactory.create_batch(5)
        for listing in listings:
            ListingsImageFactory.create_batch(3, listing=listing)


    # Test Public View
    def test_views_get_listings_success(self):
        response = self.client.get("/api/listing/get-listings")
        #Checking response was 200
        self.assertEqual(response.status_code, 200)

        listings = response.data['results']
        
        #Check that field having 3 item
        self.assertIsInstance(listings, list) 



    # Test Public View Details
    def test_views_details_success(self):
        listing = Listing.objects.first()

        response = self.client.get(f"/api/listing/detail?slug={listing.slug}")
        self.assertEqual(response.status_code, 200)
        listing_data = response.data
        self.assertIsInstance(listing_data, dict)

        # listing.delete()

    def test_views_details_not_found(self):
        #test with non exist slug
        response = self.client.get('/api/listing/detail?slug=NotExistItem')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Test Search View
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
    #     search_terms = { 'home_type': 'House', 'max_price': 10000}
    #     response = self.client.get(f"/api/listing/search?city=&home_type={search_terms['home_type']}&max_price={search_terms['max_price']}")
    #     self.assertEqual(response.status_code, 200)
    #     listing_data = response.data
    #     print(listing_data)
        # self.assertIsInstance(listing_data['listings'], list)
        # for i in range(len(listing_data['listings'])):
        #     self.assertIn(search_terms['city'], listing_data['listings'][i]['city'])
        #     self.assertIn(search_terms['home_type'], listing_data['listings'][i]['home_type'])
        #     self.assertTrue(search_terms['max_price']>=listing_data['listings'][i]['price'])

    def test_views_search_not_found(self):
        #test with non exist slug
        response = self.client.get('/api/listing/search?search=')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

#     Test Manage View

    # Get Method
    def test_manage_view_get_method(self):
        # Create a realtor user.
        realtor = UserAccountFactory(is_realtor=True, verified=True)
        self.client.force_authenticate(realtor)
        
        # Create a listing for the realtor.
        listing = ListingFactory(realtor=realtor)
        
        # Get the listings for the realtor.
        response = self.client.get('/api/listing/manage')
        
        # Assert that the response is a 200 OK status code.
        self.assertEqual(response.status_code, 200)

        # Assert that the response contains the listing for the realtor.
        listing_data = response.data
        self.assertEqual(listing.id, int(listing_data[0]['id']))
        

    def test_manage_view_post_method(self):
        # Create a realtor user.
        realtor = UserAccountFactory(is_realtor=True, verified=True)
        self.client.force_authenticate(realtor)

        # Create a listing data dictionary for the realtor.
        listing_data = model_to_dict(ListingFactory(realtor=realtor))
        # Generate a list of image file paths
        image_files = [
            'D:/Learning/Web_Dev/Backend/Django_Python/House Owner (update)/backend/media/listings/1_FzODkVM_sDpfIyu.jpg',
            'D:/Learning/Web_Dev/Backend/Django_Python/House Owner (update)/backend/media/listings/1_FzODkVM_sDpfIyu.jpg',
        ]

        # Create the form data
        form_data = listing_data

        # Open and read image files to create file-like objects
        for i, image_file in enumerate(image_files):
            with open(image_file, 'rb') as file:
                form_data[f'uploaded_images[{i}]'] = SimpleUploadedFile(
                    name=os.path.basename(image_file),
                    content=file.read(),
                    content_type='image/jpeg'
                )

        # Post the form data
        response = self.client.post(
            '/api/listing/manage',
            data=form_data,
            format='multipart',
        )
        # print(response.content)
        # print(response.data)

        # Assert the response status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Clean up the temporary image files
        for i in range(len(image_files)):
            file = form_data[f'uploaded_images[{i}]']
            file.close()


    def test_manage_view_put_method_text_success(self):
        update_field = {'title': 'Sample Title', 'description': 'Sample Description',
                        'home_type': 'House', 'price': 1000}
        # Create a realtor user.
        realtor = UserAccountFactory(is_realtor=True, verified=True)
        self.client.force_authenticate(realtor)

        # Create a listing data dictionary for the realtor.
        listing_data = ListingFactory.create_batch(1, realtor=realtor)[0]
        ListingsImageFactory.create_batch(3, listing=listing_data)
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
        self.assertEqual(updated_listing_data.description,
                         update_field['description'])
        self.assertEqual(updated_listing_data.home_type,
                         update_field['home_type'])
        self.assertEqual(updated_listing_data.price, update_field['price'])

        # Delete the listing data.
        listing_data.delete()

    def test_manage_view_delete_method(self):
        # Create a realtor user.
        realtor = UserAccountFactory(is_realtor=True, verified=True)
        self.client.force_authenticate(realtor)
        # Create a listing for the realtor.
        listing = ListingFactory(realtor=realtor)
        # Delete the listings for the realtor.
        response = self.client.delete('/api/listing/manage/' + str(listing.id))

        # Assert that the response is a 200 OK status code.
        self.assertEqual(response.status_code, status.HTTP_200_OK)


def tearDownModule():
    print("\nDeleting temporary files...\n")
    try:
        shutil.rmtree(TEST_DIR)
    except OSError:
        pass
