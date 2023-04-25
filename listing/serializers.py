from rest_framework import serializers
from .models import Listing

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'title', 'slug', 'address', 'city', 'state', 'zipcode',
                  'description', 'price', 'area', 'bedrooms', 'bathrooms',
                  'home_type', 'main_photo', 'photo1', 'photo2', 'photo3',
                  'photo4', 'is_published']
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['realtor'] = user.email
        property = Listing.objects.create(**validated_data)
        return property