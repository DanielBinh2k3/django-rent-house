from rest_framework import serializers
from django.core.files.images import ImageFile
import requests


class PropertySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'name', 'description', 'image']

    def get_image(self, obj):
        request = self.context['request']
        image_url = request.data.get('image_url')
        image_file = request.data.get('image_file')

        if image_url:
            # Check if the URL is valid
            try:
                response = requests.get(image_url)
                response.raise_for_status()
            except (requests.exceptions.RequestException, ValueError):
                raise serializers.ValidationError('Invalid image URL')

            # Create an ImageFile from the downloaded image
            image_name = image_url.split('/')[-1]
            image_content = response.content
            image_file = ImageFile(image_content, name=image_name)
        elif image_file:
            # Use the uploaded image file
            image_name = image_file.name
        else:
            # No image provided
            return None

        # Save the image to mediaroot and return its URL
        image_file.name = f"property_images/{image_name}"
        image_file.open()
        self.context['request'].FILES['image'] = image_file
        return self.context['request'].build_absolute_uri(image_file.url)
