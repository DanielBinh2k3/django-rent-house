from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from base.models import Listing
from factories_listing import ListingFactory, ListingsImageFactory
import pytest
import shutil
from django.test import TestCase, override_settings

TEST_DIR = 'test_data'
@override_settings(MEDIA_ROOT=(TEST_DIR + '/media'))
@pytest.mark.django_db
class ListingTest(TestCase):
    def setUp(self):
        self.listing = ListingFactory.create()
        ListingsImageFactory.create_batch(3, listing=self.listing)  


    def test_create_listing(self):
        # Test creating a new listing
        self.assertIsInstance(self.listing, Listing)

    def test_delete_listing(self):
        # Delete the listing
        self.listing.delete()

        # Fetch the listing again from the database using the stored ID
        deleted_listing = Listing.objects.filter(id=self.listing.id).first()

        self.assertIsNone(deleted_listing)  # Check if the listing is deleted

def tearDownModule():
    print("\nDeleting temporary files...\n")
    try:
        shutil.rmtree(TEST_DIR)
    except OSError:
        pass
