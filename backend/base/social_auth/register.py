
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
import os
import random
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


def generate_username(name):

    username = "".join(name.split(' ')).lower()
    if not User.objects.filter(name=username).exists():
        return username
    else:
        random_username = username + str(random.randint(0, 1000))
        return generate_username(random_username)


def register_social_user(provider, user_id, email, name):
    filtered_user_by_email = User.objects.filter(email=email)

    if filtered_user_by_email.exists():

        if provider == filtered_user_by_email[0].auth_provider:

            registered_user = authenticate(
                email=email, password=os.environ.get('SOCIAL_SECRET'))

            return {
                'name': registered_user.name,
                'email': registered_user.email, }

        else:
            raise AuthenticationFailed(
                detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

    else:
        user = {
            'name': generate_username(name), 'email': email,
            'password': os.environ.get('SOCIAL_SECRET')}
        user = User.objects.create_user(**user)
        user.verified = True
        user.auth_provider = provider
        user.save()

        new_user = authenticate(
            email=email, password=os.environ.get('SOCIAL_SECRET'))
        return {
            'name': new_user.name,
            'email': new_user.email,
            'tokens': str(RefreshToken.for_user(new_user).access_token)
        }
