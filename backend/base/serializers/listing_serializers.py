from rest_framework import serializers
from base.models import Listing, ListingsImage, Order
from django.db import models
from django.core.files.images import ImageFile
from django.utils.dateparse import parse_datetime
import requests
from unidecode import unidecode
import re
from slugify import slugify


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

    class Meta:
        model = Listing
        fields = ['id', 'title', 'address', 'city', 'district', 'zipcode',
                  'description', 'price', 'area', 'bedrooms', 'bathrooms',
                  'home_type', 'main_photo', 'images',
                  'is_published', "uploaded_images"]
    # transcation thêm vào

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['realtor'] = user.email

        # Generate the slug based on the title and the next available ID
        title = validated_data.get('title')
        validated_data['slug'] = unidecode(
            f"{title}").lower()
        uploaded_images = validated_data.pop("uploaded_images")

        # Create the new listing
        listing = Listing.objects.create(**validated_data)
        for image in uploaded_images:
            ListingsImage.objects.create(listing=listing, image=image)
        # Update the slug with the new ID
        clean_title = slugify(listing.title)
        listing.slug = f"{clean_title}-id{listing.id}"
        listing.save()

        return listing

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        original_title = instance.title

        # Update the instance with the remaining validated data
        instance = super().update(instance, validated_data)

        # Check if the title has changed
        if instance.title != original_title:
            # If the title has changed, update the slug
            clean_title = slugify(instance.title)
            instance.slug = f"{clean_title}-id{instance.id}"

        # Delete existing images associated with the product
        instance.images.all().delete()

        # Create new images for the updated product
        for image in uploaded_images:
            ListingsImage.objects.create(listing=instance, image=image)

        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['slug'] = instance.slug
        ret['realtor'] = instance.realtor
        ret['date_created'] = (instance.date_created).strftime('%d-%m-%Y')
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
