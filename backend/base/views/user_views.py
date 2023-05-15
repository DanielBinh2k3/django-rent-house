from django.contrib.auth import get_user_model
User=get_user_model()
from base.serializers.user_serializers import UserSerializer, SetNewPasswordSerializer, \
    ResetPasswordEmailRequestSerializer, EmailFormSerializer, LogInSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from base.send_email import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
import jwt 
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, force_bytes, smart_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers
from django.utils.encoding import DjangoUnicodeDecodeError  
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(request_body=UserSerializer)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            token = RefreshToken.for_user(user).access_token

            current_site = get_current_site(request).domain
            relativeLink = reverse('email-verify')
                            
            absurl = 'http://'+current_site+relativeLink+"?token="+str(token)
            email_body = 'Hi '+ user.name + \
                ' Use the link below to verify your email \n' + absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Verify your email'}

            Util.send_email(data)

            if user.is_realtor:
                success_message = 'Realtor account created successfully'
            else:
                success_message = 'User created successfully'

            return Response(
                {'userInfo': serializer.data, 'success': success_message},
                status=status.HTTP_201_CREATED
            )
        else:
            print(serializer.data)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

class RetrieveUserView(APIView):
    @swagger_auto_schema(responses={200: UserSerializer()})
    def get(self, request, format=None):
        try:
            user = request.user
            user = UserSerializer(user)

            return Response(
                {'user': user.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving user details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class VerifyEmail(generics.GenericAPIView):
    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class LogInUserView(APIView):
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(request_body=LogInSerializer)
    def post(self, request):
        serializer = LogInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            
            response_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'isAdmin': user.is_staff,
                'isRealtor': user.is_realtor,
                'token': str(RefreshToken.for_user(user).access_token),
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    # def delete(self, request):
    #     logout(request)
    #     return Response({'success': 'Logout successful'})

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer
    @swagger_auto_schema(request_body=ResetPasswordEmailRequestSerializer)
    def post(self, request):
        data = {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=data)

        email = request.data['email']
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})

            absurl = 'http://' + current_site + relativeLink
            email_body = 'Hello, \n Use Link Below to reset password \n  ' + absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Verify your email'}
        
            Util.send_email(data)
        return Response({'success': 'We have sent you a link to reset password'},
                        status=status.HTTP_200_OK)

class PasswordTokenCheckAPI(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('uidb64', openapi.IN_PATH, description='User ID encoded in base 64', type=openapi.TYPE_STRING),
            openapi.Parameter('token', openapi.IN_PATH, description='Password reset token', type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request, uidb64, token):
        try: 
            id=smart_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=id)
            
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
                print(info_email)
                email_body = 'Hi '+ info_email['name'] + \
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
        except:
            return Response(
                {'error': 'Something went wrong when send email'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

