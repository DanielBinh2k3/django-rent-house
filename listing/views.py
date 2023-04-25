from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Listing
from .serializers import PropertySerializer

class ManageListingView(APIView):
    def get(self, request):
        listings = Listing.objects.filter(realtor=request.user).all()
        serializer = PropertySerializer(listings, many=True)
        return Response(serializer.data )

    def post(self, request):
        try:
            user = request.user
            if not user.is_realtor:
                return Response(
                    {'error': 'User does not have necessary permissions for creating this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = PropertySerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {'success': 'Property created successfully'},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response(
                {'error': 'Something went wrong when uploading property'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ListingsView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            if not Listing.objects.filter(is_published=True).exists():
                return Response(
                    {'error': 'No published listings in the database'},
                    status=status.HTTP_404_NOT_FOUND
                )

            listings = Listing.objects.order_by('-date_created').filter(is_published=True)
            listings = PropertySerializer(listings, many=True)

            return Response(
                {'listings': listings.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving listings'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ListingDetailView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request):
        try:
            slug = request.query_params.get('slug')
            listing = Listing.objects.get(slug=slug, is_published=True)
            serializer = PropertySerializer(listing)

            return Response(
                {'listing': serializer.data},
                status=status.HTTP_200_OK
            )

        except Listing.DoesNotExist:
            return Response(
                {'error': 'Listing not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        except:
            return Response(
                {'error': 'Something went wrong when retrieving the listing'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )