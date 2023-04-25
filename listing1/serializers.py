from rest_framework import serializers
from .models import Listing

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'
