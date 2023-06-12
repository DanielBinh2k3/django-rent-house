import factory
from base.models import UserAccount
from django.contrib.auth import get_user_model

class UserAccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserAccount

    email = factory.Sequence(lambda n: f'user{n}@example.com')
    name = factory.Sequence(lambda n: f'User {n}')
    password = factory.PostGenerationMethodCall('set_password', 'password')
    # Add a field for the 'is_realtor' attribute
    is_realtor = False

class UserAccountManagerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Sequence(lambda n: f'user{n}@example.com')
    name = factory.Faker('name')
    password = factory.PostGenerationMethodCall('set_password', 'password')
    # Add a field for the 'is_realtor' attribute
    is_realtor = False
