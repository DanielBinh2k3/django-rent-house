from dateutil.relativedelta import relativedelta
from django.utils.timezone import now
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, 
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
from django.conf import settings

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
    image_url = models.URLField(blank=True, null=True)
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
    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['name']),
        ]

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

    class PropertyStatus(models.TextChoices):
        APPROVED = 'Approved'
        REJECT = 'Reject'
        OTHER = 'Other'
    # using foreign key
    realtor = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
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
    #1 trường lưu nhiều ảnh 
    main_photo = models.ImageField(
        upload_to='listings', default='/listings/placeholder.jpg')

    is_published = models.BooleanField(default=False)
    is_available = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=now)
    property_status = models.CharField(
        max_length=10, choices=HomeType.choices, default=PropertyStatus.OTHER)
    phone_contact = models.CharField(null=True, blank=True)
    view_counts = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        if self.main_photo:
            self.main_photo.storage.delete(self.main_photo.name)
        super().delete(*args, **kwargs)
    class Meta:
        indexes = [
            models.Index(fields=['realtor']),
            models.Index(fields=['city']),
            models.Index(fields=['district']),
            models.Index(fields=['price']),
            # Add more indexes for other fields...
        ]
    def __str__(self):
        return self.title
# UPload lên chỗ khác
class ListingsImage(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(upload_to="listings")
    def delete(self, *args, **kwargs):
        self.image.delete()
        super().delete(*args, **kwargs)
    def __str__(self):
        return "%s" % (self.listing)

class Order(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
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
