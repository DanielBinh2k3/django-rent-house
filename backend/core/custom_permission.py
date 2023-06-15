from rest_framework.permissions import BasePermission
from rest_framework import permissions


class IsRealtor(permissions.BasePermission):
    """
    Custom permission to only allow listing owners, realtors, to update or delete listings.
    """

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and (user.is_realtor and user.verified)

    def has_object_permission(self, request, view, obj):
        # Check if the user making the request is the owner of the listing, a realtor, or an admin user
        return obj.realtor == request.user or request.user.is_staff == True
