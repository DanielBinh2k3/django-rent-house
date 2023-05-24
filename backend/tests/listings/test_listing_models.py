from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from listing.models import Listing
from django.utils import timezone
from listing.models import Listing
from factories_listing import ListingFactory
import pytest

@pytest.mark.django_db
class ListingTest(TestCase):
    databases = ['listings', 'users']

    def test_create_listing(self):
        # Test creating a new listing
        listing = ListingFactory.create()
        self.assertIsInstance(listing, Listing)
        listing.delete()

    def test_delete_listing_with_default_images(self):
        # Test deleting a listing with default images
        listing = ListingFactory.create()
        listing.delete()
        self.assertFalse(listing.id)

    def test_delete_listing_with_uploaded_images(self):
        # Test deleting a listing with uploaded images
        listing = ListingFactory.create()
        # Upload some non-default images
        main_photo = SimpleUploadedFile("test1.jpg", b"file_content", content_type="image/jpeg")
        photo1 = SimpleUploadedFile("test2.jpg", b"file_content", content_type="image/jpeg")
        listing.main_photo = main_photo
        listing.photo1 = photo1
        listing.save()
        # Delete the listing
        listing.delete()
        self.assertFalse(listing.id)

    def test_str_representation(self):
        # Test the string representation of a listing
        listing = ListingFactory.create()
        self.assertEqual(str(listing), listing.realtor)
        listing.delete()