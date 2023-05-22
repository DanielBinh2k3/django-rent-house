from dateutil.relativedelta import relativedelta
from django.utils.timezone import now
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager,
    PermissionsMixin
)
from django.utils import timezone
# Create your models here.


class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            name=name
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_realtor(self, email, name, password=None):
        user = self.create_user(email, name, password)

        user.is_realtor = True
        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name, password)

        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        return user


AUTH_PROVIDERS = {'facebook': 'facebook', 'google': 'google',
                  'twitter': 'twitter', 'email': 'email'}


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_realtor = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    image_profile = models.ImageField(
        upload_to='profile_images', blank=True, null=True)
    is_password_reset_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default=AUTH_PROVIDERS.get('email'))
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email


class City(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class District(models.Model):
    name = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Listing(models.Model):

    class HomeType(models.TextChoices):
        HOUSE = 'House'
        CONDO = 'Condo'
        TOWNHOUSE = 'Townhouse'
    # using foreign key
    realtor = models.EmailField(max_length=255)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    zipcode = models.CharField(max_length=20)
    description = models.TextField()
    price = models.IntegerField()
    area = models.DecimalField(max_digits=10, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    home_type = models.CharField(
        max_length=10, choices=HomeType.choices, default=HomeType.HOUSE)
    main_photo = models.ImageField(
        upload_to='listings/', default='listings/placeholder.png')
    photo1 = models.ImageField(
        upload_to='listings/', default='listings/placeholder.png')
    photo2 = models.ImageField(
        upload_to='listings/', default='listings/placeholder.png')
    photo3 = models.ImageField(
        upload_to='listings/', default='listings/placeholder.png')
    photo4 = models.ImageField(
        upload_to='listings/', default='listings/placeholder.png')
    is_published = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=now)

    def delete(self):
        self.main_photo.storage.delete(self.main_photo.name)
        self.photo1.storage.delete(self.photo1.name)
        self.photo2.storage.delete(self.photo2.name)
        self.photo3.storage.delete(self.photo3.name)
        self.photo4.storage.delete(self.photo4.name)
        super().delete()

    def __str__(self):
        return self.title


class Order(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.DO_NOTHING)
    renter_name = models.CharField(max_length=100)
    renter_email = models.EmailField(max_length=255)
    renter_phone = models.CharField(max_length=20)
    date_in = models.DateField()
    date_out = models.DateField()
    months_estimate = models.PositiveSmallIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Calculate the number of months between the check-in and check-out dates
        delta = relativedelta(self.date_out, self.date_in)
        months = delta.years * 12 + delta.months

        # Round up to the nearest month
        if delta.days > 0:
            months += 1

        # Save the months_estimate property
        self.months_estimate = months

        # Calculate the total price
        price_per_month = self.listing.price
        total_price = price_per_month * self.months_estimate

        # Save the total_price property
        self.total_price = total_price

        super(Order, self).save(*args, **kwargs)
