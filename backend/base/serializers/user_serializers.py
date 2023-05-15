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
    re_password = serializers.CharField(max_length=255, min_length=8)
    is_realtor = serializers.BooleanField(default=False)

    def validate(self, data):
        if data['password'] != data['re_password']:
            raise serializers.ValidationError("Passwords do not match")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError(
                "User with this email already exists")
        return data

    def create(self, validated_data):
        validated_data.pop('re_password')
        is_realtor = validated_data.pop('is_realtor')
        if is_realtor:
            return User.objects.create_realtor(**validated_data)
        else:
            return User.objects.create_user(**validated_data)

class GetUserDetailsSerializer(serializers.ModelSerializer):
    image_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'image_profile']

    def get_image_profile(self, obj):
        if obj.image_profile:
            return obj.image_profile.url
        else:
            return None

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['isRealtor'] = instance.is_realtor
        ret['isAdmin'] = instance.is_staff
        ret['image_profile'] = self.get_image_profile(instance)
        ret['token'] = str(RefreshToken.for_user(instance).access_token)
        return ret

class LogInSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)
    password = serializers.CharField(max_length=255, min_length=8)
    class Meta:
        fields = ['email', 'password']

class UploadProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'image_profile')
        read_only_fields = ('id',)

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


