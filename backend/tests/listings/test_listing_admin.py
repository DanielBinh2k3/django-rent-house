# @pytest.mark.django_db
# class TestListingAdminPanel(StaticLiveServerTestCase):
#     databases = ['listings', 'users']
#     def setUp(self):
#         self.user = UserAccountFactory(is_superuser=True, is_staff=True)
#         self.listing = Listing.objects.create(
#             realtor=self.user,
#             title='Test Listing',
#             address='123 Test St',
#             city='Testville',
#             state='CA',
#             zipcode='12345',
#             description='A test listing',
#             price=100000,
#             area=1000,
#             bedrooms=3,
#             bathrooms=2,
#             home_type='SFH',
#             is_published=False
#         )
#         self.client = Client()
#         self.client.login(username='truonggiabjnh2003@gmail.com', password='Binh&2003')
    

#     def test_list_display(self):
#         # Test that the list display shows the expected fields
#         response = self.client.get(reverse('admin:listing_listing_changelist'))
#         print(response)
#         self.assertContains(response, 'ID')
#         self.assertContains(response, 'Realtor')
#         self.assertContains(response, 'Title')
#         self.assertContains(response, 'Slug')
    
#     def test_add_listing(self):
#         # Test that a listing can be added through the admin interface
#         data = {
#             'realtor': self.user.email,
#             'title': 'New Listing',
#             'description': 'This is a new listing'
#         }
#         response = self.client.post(reverse('admin:listing_listing_add'), data)
#         print(response)
#         self.assertEqual(response.status_code, 302) # should redirect to changelist
#         # self.assertTrue(Listing.objects.filter(title='New Listing').exists())
    
#     def test_edit_listing(self):
#         # Test that a listing can be edited through the admin interface
#         data = {
#             'realtor': self.user.email,
#             'title': 'Edited Listing',
#             'description': 'This is an edited listing'
#         }
#         response = self.client.post(reverse('admin:listing_listing_change', args=[self.listing.id]), data)
#         self.assertEqual(response.status_code, 302) # should redirect to changelist
#         # self.assertTrue(Listing.objects.filter(title='Edited Listing').exists())
    
#     def test_delete_listing(self):
#         # Test that a listing can be deleted through the admin interface
#         response = self.client.post(reverse('admin:listing_listing_delete', args=[self.listing.id]), {'post': 'yes'})
#         self.assertEqual(response.status_code, 302) # should redirect to changelist
#         # self.assertFalse(Listing.objects.filter(title='Test Listing').exists())

#Ex1
import pytest
from django.test import LiveServerTestCase
from selenium import webdriver

@pytest.mark.django_db
class TestBrowser1(LiveServerTestCase):
    def test_example1(self):
        driver = webdriver.Chrome("./chromedriver")
        driver.get("%s%s" % (self.live_server_url, "/admin"))
