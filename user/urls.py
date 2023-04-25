from django.urls import path
from .views import RegisterView, RetrieveUserView, VerifyEmail, LogInUserView

urlpatterns = [
    path('register', RegisterView.as_view(), name = 'register'),
    path('profile', RetrieveUserView.as_view(), name = 'retrieve-user-view'),
    path('email-verify/', VerifyEmail.as_view(), name = 'email-verify' ),
    path('login', LogInUserView.as_view(), name ='log-in')
]