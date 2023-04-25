from django.contrib.auth import get_user_model
User=get_user_model()
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
import jwt 
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
# Create your views here.

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        try:
            data = request.data

            name = data['name']
            email = data['email']
            email = email.lower()
            password = data['password']
            re_password = data['re_password']
            is_realtor = data['is_realtor']

            if is_realtor == 'True':
                is_realtor = True
            else:
                is_realtor = False

            if password == re_password:
                if len(password) >= 8:
                    if not User.objects.filter(email=email).exists():
                        if not is_realtor:
                            User.objects.create_user(name=name, email=email, password=password)

                            user = User.objects.get(email=email)
                            token = RefreshToken.for_user(user).access_token

                            current_site = get_current_site(request).domain
                            relativeLink = reverse('email-verify')
                            
                            absurl = 'http://'+current_site+relativeLink+"?token="+str(token)
                            email_body = 'Hi '+ name + \
                                ' Use the link below to verify your email \n' + absurl
                            data = {'email_body': email_body, 'to_email': email,
                                    'email_subject': 'Verify your email'}

                            Util.send_email(data)

                            return Response(
                                {'success': 'User created successfully'},
                                status=status.HTTP_201_CREATED
                            )
                        else:
                            User.objects.create_realtor(name=name, email=email, password=password)

                            user = User.objects.get(email=email)
                            token = RefreshToken.for_user(user).access_token

                            current_site = get_current_site(request).domain
                            relativeLink = reverse('email-verify')
                            
                            absurl = 'http://'+current_site+relativeLink+"?token="+str(token)
                            email_body = 'Hi '+ name + \
                                ' Use the link below to verify your email \n' + absurl
                            data = {'email_body': email_body, 'to_email': email,
                                    'email_subject': 'Verify your email'}

                            Util.send_email(data)

                            return Response(
                                {'success': 'Realtor account created successfully'},
                                status=status.HTTP_201_CREATED
                            )
                    else:
                        return Response(
                            {'error': 'User with this email already exists'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    return Response(
                        {'error': 'Password must be at least 8 characters in length'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {'error': 'Passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except:
            return Response(
                {'error': 'Something went wrong when registering an account'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RetrieveUserView(APIView):
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

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            
            response_data = {
                'id': user.id,
                'username': user.name,
                'email': user.email,
                'isAdmin': user.is_staff,
                'isRealtor': user.is_realtor,
                'token': str(RefreshToken.for_user(user).access_token),
            }
            return Response(response_data)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    # def delete(self, request):
    #     logout(request)
    #     return Response({'success': 'Logout successful'})