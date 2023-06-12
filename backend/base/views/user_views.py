from rest_framework import generics, status
from django.utils.encoding import DjangoUnicodeDecodeError
import jwt
from django.core.files import File
from rest_framework.permissions import IsAuthenticated
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes, smart_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from base.send_email import Util
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions, status, generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from base.serializers.user_serializers import UserSerializer, SetNewPasswordSerializer, \
    ResetPasswordEmailRequestSerializer, EmailFormSerializer, PasswordResetSerializer,\
    LogInSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
import logging
User = get_user_model()
logger = logging.getLogger(__name__)


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(request_body=UserSerializer)
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()


            token = RefreshToken.for_user(user).access_token

            current_site = get_current_site(request).domain
            relativeLink = reverse('email-verify')

            absurl = 'http://'+current_site+relativeLink+"?token="+str(token)
            email_body = 'Hi ' + user.name + \
                ' Use the link below to verify your email \n' + absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Verify your email'}

            Util.send_email(data)

            if user.is_realtor:
                success_message = 'Realtor account created successfully'
            else:
                success_message = 'User created successfully'

            logger.info(f'{success_message}: {user.email}')

            return Response(
                {'userInfo': serializer.data, 'success': success_message},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f'Error creating user: {str(e)}')
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    @swagger_auto_schema(responses={200: UserSerializer()})
    def get(self, request, format=None):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            logger.info(f'User details retrieved: {serializer.data}')
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'User does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    def put(self, request, pk, *args, **kwargs):
        try:
            user = request.user
            user_model = User.objects.get(id=pk)
            # Get the uploaded image file from the request data
            image_profile_file = request.data.get('image_profile')

            # If an image file was uploaded, save it to the User model
            if image_profile_file:
                user.image_profile.save(
                    image_profile_file.name, File(image_profile_file))

            # Create a new dictionary with updated values
            new_data = dict(request.data)
            new_data.setdefault('name', user.name)
            new_data.setdefault('email', user.email)
            new_data.pop('image_profile', None)

            serializer = self.get_serializer(user, data=new_data)

            if serializer.is_valid():
                user_model.save()
                serializer.save()

                logger.info(f'Profile updated for user: {user.email}')
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                {'error': f'{e}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f'Error updating user profile: {str(e)}')
            return Response(
                {'error': 'Something went wrong when updating user profile'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordResetSerializer

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            return Response({'error': 'Invalid old password.'}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({'success': 'Password reset successful.'}, status=200)


class VerifyEmail(APIView):

    def get(self, request):
        try:
            token = request.GET.get('token')
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()
            logger.info(f'Email verified for user: {user.email}')
            return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            logger.error('Activation Expired')
            return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except (jwt.exceptions.DecodeError, User.DoesNotExist) as e:
            logger.error(f'Error verifying email: {str(e)}')
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f'Error verifying email: {str(e)}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogInUserView(APIView):
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(request_body=LogInSerializer)
    def post(self, request):
        try:
            serializer = LogInSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                serializer = UserProfileSerializer(user)
                logger.info(f'User logged in: {user.email}')
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                logger.error('Invalid email or password')
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f'Error logging in user: {str(e)}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    #  permission_classes = (IsAuthenticated,)
     def post(self, request):
          try:
               refresh_token = request.data["refresh_token"]
               print(refresh_token)
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    @swagger_auto_schema(request_body=ResetPasswordEmailRequestSerializer)
    def post(self, request):
        data = {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=data)
        try:
            email = request.data['email']
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                uidb64 = urlsafe_base64_encode(force_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)
                current_site = get_current_site(request=request).domain
                relativeLink = reverse(
                    'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})

                absurl = 'http://' + current_site + relativeLink
                email_body = 'Hello, \n Use Link Below to reset password \n  ' + absurl
                data = {'email_body': email_body, 'to_email': user.email,
                        'email_subject': 'Verify your email'}

                Util.send_email(data)
                logger.info(f'Reset password for user: {user.email} working')
                return Response({'success': 'We have sent you a link to reset password'},
                                status=status.HTTP_200_OK)
            else:
                logger.info(
                    f'Reset password failed, may be because it not existed: {user.email}')
                return Response({'error': 'Not found account'},
                                status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(
                f'Error when reseting password account {user.email}: {str(e)}')
            return Response(
                {'error': 'Something went wrong when retrieving user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordTokenCheckAPI(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('uidb64', openapi.IN_PATH,
                              description='User ID encoded in base 64', type=openapi.TYPE_STRING),
            openapi.Parameter('token', openapi.IN_PATH,
                              description='Password reset token', type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"success": True, 'message': "Credentials Valid", 'uidb61': uidb64, 'token': token})

        except DjangoUnicodeDecodeError as identifier:
            return Response({'error': 'Token is not valide, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)


class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    @swagger_auto_schema(request_body=SetNewPasswordSerializer)
    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer = serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)


class SupportEmail(generics.GenericAPIView):
    serializer_class = EmailFormSerializer
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(request_body=EmailFormSerializer)
    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid(raise_exception=True):
                info_email = serializer.data
                email_body = 'Hi ' + info_email['name'] + \
                    '\nYou are the customer who i have ever want. Having any problems contact us by email or phone'
                data = {'email_body': email_body, 'to_email': info_email['email'],
                        'email_subject': 'Thank you for contacting us'}
                Util.send_email(data)
                data['to_email'] = 'truonggiabjnh2003@gmail.com'
                data['subject'] = 'Report from ' + info_email['email']
                data['email_body'] = info_email['message']
                Util.send_email(data)
                return Response({"success": True}, status=status.HTTP_200_OK)
            else:
                return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
