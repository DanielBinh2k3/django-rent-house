from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ValidationError
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()


class UserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=255, min_length=8)
    # re_password = serializers.CharField(max_length=255, min_length=8)
    is_realtor = serializers.BooleanField(default=False)

    def validate(self, data):
        # if data['password'] != data['re_password']:
        #     raise serializers.ValidationError("Passwords do not match")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError(
                "User with this email already exists")
        return data

    def create(self, validated_data):
        # validated_data.pop('re_password')
        is_realtor = validated_data.pop('is_realtor')
        if is_realtor:
            return User.objects.create_realtor(**validated_data)
        else:
            return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    phone_number = serializers.CharField()
    image_profile = serializers.ImageField()
    class Meta:
        model = User
        fields = [ 'id','phone_number', 'image_profile', 'name',]

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.image_profile = validated_data.get('image_profile', instance.image_profile)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['email'] = instance.email
        ret['isRealtor'] = instance.is_realtor
        ret['isAdmin'] = instance.is_staff
        if not instance.image_profile:
            ret['image_profile'] = instance.image_url
        ret['phone_number'] = instance.phone_number
        ret['access_token'] = str(RefreshToken.for_user(instance).access_token)
        ret['refresh_token'] = str(RefreshToken.for_user(instance))
        return ret


class LogInSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)
    password = serializers.CharField(max_length=255, min_length=8)

    class Meta:
        fields = ['email', 'password']


class PasswordResetSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=64, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return AuthenticationFailed('The reset link is invalid', 401)
            user.set_password(password)
            user.is_password_reset_completed = True  # set the flag to True
            user.save()
            return super().validate(attrs)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)


class EmailFormSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField(max_length=255)

    class Meta:
        fields = ['name', 'email', 'subject', 'message']
