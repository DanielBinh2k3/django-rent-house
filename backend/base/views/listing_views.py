from rest_framework.decorators import api_view
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from base.models import Listing, Order
from base.serializers.listing_serializers import PropertySerializer, OrderSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import Http404
import json


class ManageListingView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    @swagger_auto_schema(
        operation_description="Get all listings associated with a realtor",
        responses={200: PropertySerializer(many=True)}
    )
    def get(self, request):
        listings = Listing.objects.filter(realtor=request.user).all()
        serializer = PropertySerializer(listings, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Create a new property listing",
        responses={
            201: openapi.Response(
                description="Created",
                schema=PropertySerializer()
            ),
            400: "Bad Request",
            403: "Forbidden"
        }
    )
    def post(self, request):
        user = request.user
        if not user.is_realtor:
            return Response(
                {'error': 'User does not have necessary permissions for creating this listing data'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PropertySerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update an existing property listing",
        responses={
            200: openapi.Response(
                description="Updated",
                schema=PropertySerializer()
            ),
            400: "Bad Request",
            403: "Forbidden",
            404: "Not Found"
        }
    )
    def put(self, request, pk):
        user = request.user
        if not user.is_realtor:
            return Response(
                {'error': 'User does not have necessary permissions for updating this listing data'},
                status=status.HTTP_403_FORBIDDEN
            )

        listing = get_object_or_404(
            Listing.objects.filter(realtor=user), pk=pk)
        serializer = PropertySerializer(
            instance=listing, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete an existing property listing",
        responses={
            204: "No Content",
            403: "Forbidden",
            404: "Not Found"
        }
    )
    def delete(self, request, pk):
        user = request.user
        if not user.is_realtor:
            return Response(
                {'error': 'User does not have necessary permissions for deleting this listing data'},
                status=status.HTTP_403_FORBIDDEN
            )

        listing = get_object_or_404(
            Listing.objects.filter(realtor=user), pk=pk)
        listing.delete()

        return Response({'message': 'Listing deleted successfully.'}, status=status.HTTP_200_OK)


class ListingDetailView(APIView):
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(
        operation_description="Get a single published listing by slug",
        manual_parameters=[
            openapi.Parameter(
                name="slug",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description="The slug of the requested listing"
            )
        ]
    )
    def get(self, request):
        try:
            slug = request.query_params.get('slug')
            listing = Listing.objects.get(slug=slug, is_published=True)
            serializer = PropertySerializer(listing)

            return Response(
                {'listing': serializer.data},  # serialize the data here
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


class ListingPkDetailView(APIView):
    def get_object(self, pk):
        try:
            return Listing.objects.get(pk=pk)
        except Listing.DoesNotExist:
            raise Http404

    @swagger_auto_schema(
        operation_description="Get a single property listing by ID",
        responses={
            200: PropertySerializer(),
            403: "Forbidden",
            404: "Not Found",
            500: "Internal Server Error"
        }
    )
    def get(self, request, pk):
        property = self.get_object(pk)
        serializer = PropertySerializer(property)
        serialized_data = serializer.data  # Convert serialized data to a dictionary
        return Response(json.dumps(serialized_data), content_type='application/json')

    @swagger_auto_schema(
        operation_description="Update an existing property listing",
        responses={
            200: openapi.Response(
                description="Updated",
                schema=PropertySerializer()
            ),
            400: "Bad Request",
            403: "Forbidden",
            404: "Not Found",
            500: "Internal Server Error"
        }
    )
    def put(self, request, pk):
        try:
            user = request.user
            if not user.is_realtor:
                return Response(
                    {'error': 'User does not have necessary permissions for updating this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            listing = Listing.objects.get(id=pk)
            if str(listing) != str(user):
                return Response(
                    {'error': 'User does not have permission to update this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            original_title = listing.title  # Store the original title of the listing

            serializer = PropertySerializer(
                listing, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                instance = serializer.save()
                # Check if the title has changed
                if instance.title != original_title:
                    # Generate new slug based on the updated title
                    new_slug = '-'.join(instance.title.split()
                                        ) + '-' + str(instance.id)
                    instance.slug = new_slug
                    instance.save()

                return Response(
                    serializer.data,
                    status=status.HTTP_200_OK
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Listing.DoesNotExist:
            return Response(
                {'error': 'Listing does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        except:
            return Response(
                {'error': 'Something went wrong when updating property'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        operation_description="Delete an existing property listing",
        responses={
            204: "No Content",
            404: "Not Found",
            500: "Internal Server Error"
        }
    )
    def delete(self, request, pk):
        property = self.get_object(pk)
        property.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ListingsView(APIView):
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(
        operation_description="Get a list of all published property listings",
        responses={
            200: PropertySerializer(many=True),
            404: "Not Found",
            500: "Internal Server Error"
        }
    )
    def get(self, request, format=None):
        try:
            if not Listing.objects.filter(is_published=True).exists():
                return Response(
                    {'error': 'No published listings in the database'},
                    status=status.HTTP_404_NOT_FOUND
                )

            listings = Listing.objects.order_by(
                '-date_created').filter(is_published=True)
            listings = PropertySerializer(listings, many=True)

            return Response(
                listings.data,
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving listings'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchListingView(APIView):
    permission_classes = (permissions.AllowAny, )

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('home_type', openapi.IN_QUERY,
                              description="Filter by home type", type=openapi.TYPE_STRING),
            openapi.Parameter('city', openapi.IN_QUERY,
                              description="Filter by city", type=openapi.TYPE_STRING),
            openapi.Parameter('max_price', openapi.IN_QUERY,
                              description="Filter by maximum price", type=openapi.TYPE_NUMBER),
            openapi.Parameter('search_term', openapi.IN_QUERY,
                              description="Search by title or slug", type=openapi.TYPE_STRING),
        ],
        responses={status.HTTP_200_OK: PropertySerializer(many=True)}
    )
    def get(self, request):
        # Get query parameters
        home_type = request.GET.get('home_type')
        city = request.GET.get('city')
        max_price = request.GET.get('max_price')
        search_term = request.GET.get('search_term')

        # Build query set with all listings
        queryset = Listing.objects.all()

        # Filter by home_type
        if home_type:
            queryset = queryset.filter(home_type__icontains=home_type)

        # Filter by city
        if city:
            queryset = queryset.filter(city__icontains=city)

        # Filter by max_price
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Search by title or slug
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) | Q(slug__icontains=search_term))

        # Serialize and return results
        serializer = PropertySerializer(queryset, many=True)
        return Response(serializer.data)


class OrderListingNormalView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    @swagger_auto_schema(
        operation_summary="Get a list of orders",
        operation_description="This endpoint allows authenticated users to retrieve a list of their orders.",
        responses={
            200: OrderSerializer(many=True),
            401: "Authentication credentials were not provided.",
        },
    )
    def get(self, request):
        orders = Order.objects.filter(listing__realtor=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Create an order",
        operation_description="This endpoint allows authenticated users to create a new order.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'listing': openapi.Schema(type=openapi.TYPE_INTEGER),
                'renter_phone': openapi.Schema(type=openapi.TYPE_STRING),
                'date_in': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE),
                'date_out': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE),
            },
            required=['listing', 'renter_phone', 'date_in', 'date_out']
        ),
    )
    def post(self, request):
        serializer = OrderSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Update an order",
        operation_description="This endpoint allows authenticated users to update an existing order.",
        request_body=OrderSerializer,
        responses={
            200: OrderSerializer(),
            400: "Bad request.",
            401: "Authentication credentials were not provided.",
            404: "Order not found.",
        },
    )
    def put(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, listing__realtor=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Delete an order",
        operation_description="This endpoint allows authenticated users to delete an existing order.",
        responses={
            204: "Order deleted successfully.",
            401: "Authentication credentials were not provided.",
            404: "Order not found.",
        },
    )
    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, listing__realtor=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        order.delete()
        return Response({'success': "You deleted the order successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@swagger_auto_schema(request_body=openapi.Schema(
    type='object',
    properties={
        'id': openapi.Schema(type='integer'),
        'image_type': openapi.Schema(type='string', enum=['main_photo', 'photo1', 'photo2', 'photo3', 'photo4']),
        'image': openapi.Schema(type='file')
    },
    required=['id', 'image_type', 'image']
))
def uploadImages(request):
    data = request.data

    # Extract the product ID and image type from the request data
    product_id = data['id']
    image_type = data['image_type']

    # Get the product with the given ID
    try:
        product = Listing.objects.get(id=product_id)
    except Listing.DoesNotExist:
        return Response(f'Product with ID {product_id} does not exist', status=404)

    # Update the image field with the uploaded image file
    file = request.FILES.get('image')
    if file is not None:
        if image_type == 'main_photo':
            product.main_photo = file
        elif image_type.startswith('photo') and len(image_type) == 6 and image_type[-1].isdigit():
            index = int(image_type[-1])
            if index >= 1 and index <= 4:
                setattr(product, image_type, file)
            else:
                return Response('Invalid image type', status=400)
        else:
            return Response('Invalid image type', status=400)

    # Save the changes to the database
    product.save()

    # Return a success response
    return Response('Image was uploaded successfully')
