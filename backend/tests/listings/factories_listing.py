import factory
from django.test import LiveServerTestCase
from listing.models import Listing
from factory import post_generation
from django.test import override_settings
import shutil

class ListingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Listing

    realtor = factory.Faker('email')
    title = factory.Faker('text', max_nb_chars=255)
    slug = factory.Sequence(lambda n: f'random-listing-{n}')
    address = factory.Faker('street_address')
    city = factory.Faker('random_element', 
                         elements=[x for x in ['Ha Noi', 'Ho Chi Minh']])
    state = factory.Faker('state_abbr')
    zipcode = factory.Faker('zipcode')
    description = factory.Faker('paragraph')
    price = factory.Faker('pyint', min_value=0, max_value=1000)
    area = factory.Faker('pydecimal', left_digits=6, right_digits=2, positive=True)
    bedrooms = factory.Faker('pyint')
    bathrooms = factory.Faker('pyint')
    home_type = Listing.HomeType.HOUSE
    main_photo = factory.django.ImageField(color='blue')
    photo1 = factory.django.ImageField(color='green')
    photo2 = factory.django.ImageField(color='red')
    photo3 = factory.django.ImageField(color='yellow')
    photo4 = factory.django.ImageField(color='purple')
    is_published = False

