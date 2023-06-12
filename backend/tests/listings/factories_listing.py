import factory
from factory.django import DjangoModelFactory
from base.models import UserAccount, City, District, Listing, ListingsImage


class UserAccountFactory(DjangoModelFactory):
    class Meta:
        model = UserAccount

    email = factory.Faker('email')
    name = factory.Faker('name')
    is_realtor = True  # Optional: Set additional fields as needed
    verified = True

# Define other factories for your models


class CityFactory(DjangoModelFactory):
    class Meta:
        model = City

    name = factory.Faker('city')


class DistrictFactory(DjangoModelFactory):
    class Meta:
        model = District

    name = factory.Faker('city')
    city = factory.SubFactory(CityFactory)


import factory

class ListingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Listing

    realtor = factory.SubFactory(UserAccountFactory)
    title = factory.Sequence(lambda n: f'My Listing {n}')
    slug = factory.Sequence(lambda n: f'my-listing-id{n}')
    address = factory.Faker('street_address')
    city = factory.SubFactory(CityFactory)
    district = factory.SubFactory(DistrictFactory)
    zipcode = factory.Faker('postcode')
    description = factory.Faker('paragraph')
    price = factory.Faker('random_int', min=100000, max=1000000)
    area = factory.Faker('pydecimal', left_digits=4, right_digits=2, positive=True)
    bedrooms = factory.Faker('random_int', min=1, max=5)
    bathrooms = factory.Faker('random_int', min=1, max=4)
    home_type = factory.Faker('random_element', elements=[choice[0] for choice in Listing.HomeType.choices])
    main_photo = factory.django.ImageField(color='blue')
    is_published = factory.Faker('boolean')
    is_available = factory.Faker('boolean')
    property_status = factory.Faker('random_element', elements=[choice[0] for choice in Listing.PropertyStatus.choices])
    phone_contact = factory.Faker('phone_number')
    view_counts = factory.Faker('random_int', min=0, max=1000)

class ListingsImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ListingsImage

    listing = factory.SubFactory(ListingFactory)
    image = factory.django.ImageField(color='blue')
