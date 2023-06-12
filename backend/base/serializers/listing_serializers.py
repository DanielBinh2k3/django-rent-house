from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField
from base.models import Listing, ListingsImage, Order, City, District
from django.db import models
from django.core.files.images import ImageFile
from django.utils.dateparse import parse_datetime
import requests
from unidecode import unidecode
import json
from slugify import slugify
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from base.models import UserAccount
User = get_user_model()


class ListingsImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = ListingsImage
        fields = "__all__"


class UserAccountSerializer(serializers.ModelSerializer):
    # image_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email']

    def get_image_profile(self, obj):
        if obj.image_profile:
            return obj.image_profile.url
        else:
            return None


class PropertySerializer(serializers.ModelSerializer):
    # realtor = UserAccountSerializer(source='user', read_only=True)
    images = ListingsImageSerializers(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=True),
        write_only=True
    )

    class Meta:
        model = Listing
        fields = ['id',  'title', 'address', 'city', 'district', 'zipcode',
                  'description', 'price', 'area', 'bedrooms', 'bathrooms',
                  'home_type', 'main_photo', 'images',
                  'is_published', 'uploaded_images']


    def create(self, validated_data):
        realtor = self.context.get('request').user
        uploaded_images = validated_data.pop("uploaded_images", [])
        validated_data['slug'] = slugify(validated_data.get('title'))

        listing = Listing.objects.create(realtor=realtor, **validated_data)

        # Create a list of ListingsImage objects to be bulk created
        images_to_create = [
            ListingsImage(listing=listing, image=image)
            for image in uploaded_images
        ]
        # Perform bulk create
        ListingsImage.objects.bulk_create(images_to_create)

        clean_title = slugify(listing.title)
        listing.slug = f"{clean_title}-id{listing.id}"
        listing.save()

        return listing

    def update(self, listing, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        original_title = listing.title

        city_data = validated_data.pop('city', None)
        district_data = validated_data.pop('district', None)

        listing = super().update(listing, validated_data)

        if listing.title != original_title:
            clean_title = slugify(listing.title)
            listing.slug = f"{clean_title}-id{listing.id}"

        if city_data:
            city = City.objects.get(pk=city_data['id'])
            listing.city = city

        if district_data:
            district = District.objects.get(pk=district_data)
            listing.district = district

        listing.images.all().delete()

        for image in uploaded_images:
            ListingsImage.objects.create(listing=listing, image=image)
        listing.save()

        return listing

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.city:
            ret['city'] = instance.city.name
        if instance.district:
            ret['district'] = instance.district.name
        ret['slug'] = instance.slug
        if instance.realtor:
            ret['realtor'] = instance.realtor.name
        ret['date_created'] = instance.date_created.strftime('%d-%m-%Y')
        ret['view_counts'] = instance.view_counts
        return ret


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['listing', 'renter_phone', 'date_in', 'date_out']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['renter_name'] = user.name
        validated_data['renter_email'] = user.email
        order = Order.objects.create(**validated_data)
        return order

    def get_renter_name(self, obj):
        return obj.renter_name

    def get_renter_email(self, obj):
        return obj.renter_email

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['renter_name'] = instance.renter_name
        ret['renter_email'] = instance.renter_email
        ret['months_estimate'] = instance.months_estimate
        ret['total_price'] = instance.total_price
        return ret
