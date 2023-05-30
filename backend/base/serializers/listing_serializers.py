from rest_framework import serializers
from base.models import Listing, ListingsImage, Order, City, District
from django.db import models
from django.core.files.images import ImageFile
from django.utils.dateparse import parse_datetime
import requests
from unidecode import unidecode
import re
from slugify import slugify
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.core.exceptions import ValidationError

# class DistrictSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = District
#         fields = '__all__'


# class CitySerializer(serializers.ModelSerializer):
#     districts = DistrictSerializer(many=True, read_only=True)

#     class Meta:
#         model = City
#         fields = '__all__'


class ListingsImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = ListingsImage
        fields = "__all__"


class PropertySerializer(serializers.ModelSerializer):
    images = ListingsImageSerializers(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=True),
        write_only=True
    )

    class Meta:
        model = Listing
        fields = ['id', 'title', 'address', 'city', 'district', 'zipcode',
                  'description', 'price', 'area', 'bedrooms', 'bathrooms',
                  'home_type', 'main_photo', 'images',
                  'is_published', 'uploaded_images']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['realtor'] = user.email

        title = validated_data.get('title')
        validated_data['slug'] = unidecode(title).lower()
        uploaded_images = validated_data.pop("uploaded_images")
        district_id = validated_data.pop("district").id
        city_id = validated_data.get("city").id
        try:
            district = District.objects.get(pk=district_id, city_id=city_id)
            validated_data['district'] = district
        except District.DoesNotExist:
            raise ValidationError("Invalid district ID for the selected city")
        listing = Listing.objects.create(**validated_data)

        for image in uploaded_images:
            ListingsImage.objects.create(listing=listing, image=image)

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
        ret['city'] = (instance.city).name
        ret['district'] = (instance.district).name
        ret['slug'] = instance.slug
        ret['realtor'] = instance.realtor
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
