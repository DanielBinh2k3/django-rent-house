from django.urls import path
from base.views.user_views import RegisterView, \
    VerifyEmail, LogInUserView, SetNewPasswordAPIView, \
    RequestPasswordResetEmail, PasswordTokenCheckAPI, \
    SupportEmail, UserProfileView

urlpatterns = [
    path('support-email', SupportEmail.as_view(), name='support-email'),
    path('register', RegisterView.as_view(), name='register'),
    path('profile/<int:pk>', UserProfileView.as_view(), name='retrieve-user-view'),
    path('email-verify/', VerifyEmail.as_view(), name='email-verify'),
    path('login', LogInUserView.as_view(), name='log-in'),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('password-reset/<uidb64>/<token>/',
         PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset-complete', SetNewPasswordAPIView.as_view(),
         name='password-reset-complete'),
]
