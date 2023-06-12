from .models import UserAccount


def delete_user_data(email):
    if UserAccount.objects.filter(email=email).exists():
        UserAccount.objects.filter(email=email).delete()
