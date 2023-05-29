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


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    districts = DistrictSerializer(many=True, read_only=True)

    class Meta:
        model = City
        fields = '__all__'


class ListingsImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = ListingsImage
        fields = "__all__"


class PropertySerializer(serializers.ModelSerializer):
    images = ListingsImageSerializers(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True
    )
    city = CitySerializer()
    district = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all())

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['title', 'address', 'city', 'district'],
            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'address': openapi.Schema(type=openapi.TYPE_STRING),
                'city': openapi.Schema(type=openapi.TYPE_INTEGER),
                'district': openapi.Schema(type=openapi.TYPE_INTEGER),
                # Add more properties as needed...
                'uploaded_images': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_FILE),
                ),
            },
        ),
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

        city_data = validated_data.pop('city', None)
        district_data = validated_data.pop('district', None)

        listing = Listing.objects.create(**validated_data)

        if city_data:
            city = City.objects.get(pk=city_data['id'])
            listing.city = city

        if district_data:
            district = District.objects.get(pk=district_data)
            listing.district = district

        listing.save()

        for image in uploaded_images:
            ListingsImage.objects.create(listing=listing, image=image)

        clean_title = slugify(listing.title)
        listing.slug = f"{clean_title}-id{listing.id}"
        listing.save()

        return listing

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        original_title = instance.title

        city_data = validated_data.pop('city', None)
        district_data = validated_data.pop('district', None)

        instance = super().update(instance, validated_data)

        if instance.title != original_title:
            clean_title = slugify(instance.title)
            instance.slug = f"{clean_title}-id{instance.id}"

        if city_data:
            city = City.objects.get(pk=city_data['id'])
            instance.city = city

        if district_data:
            district = District.objects.get(pk=district_data)
            instance.district = district

        instance.save()

        instance.images.all().delete()

        for image in uploaded_images:
            ListingsImage.objects.create(listing=instance, image=image)

        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['city'] = CitySerializer(instance.city).data
        ret['district'] = DistrictSerializer(instance.district).data
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
