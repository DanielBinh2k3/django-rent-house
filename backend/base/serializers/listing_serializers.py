from rest_framework import serializers
from base.models import Listing, Order
from django.db import models
from django.core.files.images import ImageFile
import requests
from unidecode import unidecode


class PropertySerializer(serializers.ModelSerializer):
    main_photo = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = ['id', 'title', 'address', 'city', 'district', 'zipcode',
                  'description', 'price', 'area', 'bedrooms', 'bathrooms',
                  'home_type', 'main_photo', 'photo1', 'photo2', 'photo3',
                  'photo4', 'is_published']

    def get_main_photo(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['realtor'] = user.email

        # Generate the slug based on the title and the next available ID
        validated_data['slug'] = '-'.join(
            unidecode(validated_data['title']).split())

        property = Listing.objects.create(**validated_data)
        # update slug after create
        return property


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
