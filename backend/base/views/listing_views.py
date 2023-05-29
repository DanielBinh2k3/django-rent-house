from django.db import transaction
from rest_framework.decorators import api_view
from django.db import connection
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from base.models import Listing, Order
from base.serializers.listing_serializers import PropertySerializer, OrderSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import Http404
from core.custom_permission import IsRealtor
import logging
import json
from base.pagination import CustomPageNumberPagination
from unidecode import unidecode
import re
from django.contrib.postgres.search import SearchVector
logger = logging.getLogger(__name__)


class ManageListingView(APIView):
    permission_classes = [IsRealtor | permissions.IsAdminUser]
    serializer_class = PropertySerializer
    parser_class = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        operation_description="Get all listings associated with a realtor",
        responses={200: PropertySerializer(many=True)}
    )
    @transaction.atomic
    def get(self, request, pk=None):
        try:
            with transaction.atomic():
                if pk != None:
                    listing = Listing.objects.get(id=pk)
                    serializer = PropertySerializer(listing)
                else:
                    listings = Listing.objects.filter(
                        realtor=request.user).all()
                    serializer = PropertySerializer(listings, many=True)

                return Response(serializer.data)
        except Exception as e:
            logger.exception(str(e))
            return Response({'error': 'An error occurred while retrieving listings.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new property listing",
        request_body=PropertySerializer,
    )
    @transaction.atomic
    def post(self, request):
        try:
            with transaction.atomic():
                serializer = PropertySerializer(
                    data=request.data, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(str(e))
            return Response({'error': 'An error occurred while creating the listing.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update an existing property listing",
        request_body=PropertySerializer,
        responses={
            200: openapi.Response(
                description="Updated",
                schema=PropertySerializer,
            ),
            400: "Bad Request",
            403: "Forbidden",
            404: "Not Found",
            500: "Internal Server Error",
        },
    )
    @transaction.atomic
    def put(self, request, pk):
        try:
            with transaction.atomic():
                listing = Listing.objects.get(id=pk)
                self.check_object_permissions(request, listing)
                original_slug = listing.slug
                serializer = PropertySerializer(
                    listing, data=request.data, partial=True, context={'request': request})
                if serializer.is_valid():
                    instance = serializer.save()

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
        except Exception as e:
            logger.exception(e)
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
    @transaction.atomic
    def delete(self, request, pk):
        try:
            with transaction.atomic():
                listing = Listing.objects.get(id=pk)
                self.check_object_permissions(request, listing)
                with connection.cursor() as cursor:
                    cursor.execute(
                        "DELETE FROM base_listing WHERE id = %s",
                        [pk]
                    )
                    affected_rows = cursor.rowcount
                return affected_rows

        except Exception as e:
            logger.exception(e)
            return Response({'error': 'Something went wrong when deleting the property.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            # Increment the view count for this listing
            listing.view_counts += 1
            listing.save()

            serializer = PropertySerializer(listing)

            return Response(
                {'listing': serializer.data},  # serialize the data here
                status=status.HTTP_200_OK
            )

        except Listing.DoesNotExist:
            logger.error(f'Listing with slug "{slug}" not found.')
            return Response(
                {'error': 'Listing not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            logger.exception(str(e))
            return Response({'error': 'An error occurred while retrieving the listing.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListingsView(APIView):
    logger = logging.getLogger(__name__)

    permission_classes = (permissions.AllowAny, )
    pagination_class = CustomPageNumberPagination

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
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(Listing.objects.filter(
                is_published=True).order_by('-date_created'), request)
            listings = PropertySerializer(page, many=True)

            return paginator.get_paginated_response(listings.data)

        except Exception as e:
            self.logger.exception(e)
            return Response(
                {'error': 'Something went wrong when retrieving listings'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchListingView(APIView):
    logger = logging.getLogger(__name__)

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
    def get(self, request, queryset=None):
        try:
            # Get query parameters
            home_type = request.GET.get('home_type')
            city = request.GET.get('city')
            max_price = request.GET.get('max_price')
            search_term = request.GET.get('search_term')

            # Build query set with all listings
            if queryset == None:
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

            # Search by title, slug, and search_vector
            if search_term:
                queryset = queryset.annotate(
                    search=SearchVector('title', 'slug', 'address')
                ).filter(search=search_term)

            # Serialize and return results
            serializer = PropertySerializer(queryset, many=True)
            return Response(serializer.data)

        except Exception as e:
            self.logger.exception(e)
            return Response(
                {'error': 'Something went wrong when searching for listings'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchListingRealtorView(SearchListingView):
    permission_classes = (IsRealtor, permissions.IsAdminUser)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('is_published', openapi.IN_QUERY,
                              description="Filter by public status", type=openapi.TYPE_BOOLEAN),
            openapi.Parameter('state', openapi.IN_QUERY,
                              description="Filter by state", type=openapi.TYPE_STRING),
        ],
        responses={status.HTTP_200_OK: PropertySerializer(many=True)}
    )
    def get(self, request):
        try:
            # Get query parameters
            is_published = request.GET.get('is_published')
            # state = request.GET.get('state')

            # Build query set with all listings for the authenticated realtor
            queryset = Listing.objects.filter(realtor=request.user)

            # Filter by public status, if is_published query parameter is present
            if is_published is not None:
                queryset = queryset.filter(
                    is_published__icontains=is_published)  # icontains va contains

            # Call parent class method to filter by home_type, city, max_price, search_term, and is_published
            serialized_data = super().get(request, queryset=queryset).data

            # Serialize and return results
            return Response(serialized_data)

        except Exception as e:
            self.logger.exception(e)
            return Response(
                {'error': 'Something went wrong when searching for listings'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


logger = logging.getLogger(__name__)


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
        try:
            orders = Order.objects.filter(renter_email=request.user)
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"An error occurred while retrieving orders: {e}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    @transaction.atomic
    def post(self, request):
        try:
            with transaction.atomic():
                serializer = OrderSerializer(
                    data=request.data, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"An error occurred while creating an order: {e}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    @transaction.atomic
    def put(self, request, pk):
        try:
            with transaction.atomic():
                order = Order.objects.get(pk=pk, listing__realtor=request.user)
                serializer = OrderSerializer(order, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"An error occurred while updating an order: {e}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_summary="Delete an order",
        operation_description="This endpoint allows authenticated users to delete an existing order.",
        responses={
            204: "Order deleted successfully.",
            401: "Authentication credentials were not provided.",
            404: "Order not found.",
        },
    )
    @transaction.atomic
    def delete(self, request, pk):
        try:
            with transaction.atomic():
                order = Order.objects.get(pk=pk, listing__realtor=request.user)
                order.delete()
            return Response({'success': "You deleted the order successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"An error occurred while deleting an order: {e}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderListingRealtorView(OrderListingNormalView):
    permission_classes = (IsRealtor | permissions.IsAdminUser)

    @swagger_auto_schema(
        operation_summary="Get a list of orders for a realtor",
        operation_description="This endpoint allows authenticated realtors to retrieve a list of their orders.",
        responses={
            200: OrderSerializer(many=True),
            401: "Authentication credentials were not provided.",
        },
    )
    @transaction.atomic
    def get(self, request):
        try:
            with transaction.atomic():
                orders = Order.objects.filter(listing__realtor=request.user)
                serializer = OrderSerializer(orders, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"An error occurred while retrieving orders: {e}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_summary="Update an order by a realtor",
        operation_description="This endpoint allows authenticated realtors to update an existing order.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'state': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['state']
        ),
        responses={
            200: OrderSerializer(),
            400: "Bad request.",
            401: "Authentication credentials were not provided or the user is not a realtor.",
            404: "Order not found.",
        },
    )
    @transaction.atomic
    def put(self, request, pk):
        try:
            with transaction.atomic():
                order = Order.objects.get(pk=pk, listing__realtor=request.user)
                state = request.data.get('state')
                if state == 'success' or state == 'decline':
                    # order.state = state
                    order.save()
                    serializer = OrderSerializer(order)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "Invalid state value."}, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"An error occurred while updating an order: {e}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_summary="Delete an order by a realtor",
        operation_description="This endpoint allows authenticated realtors to delete an existing order.",
        responses={
            204: "Order deleted successfully.",
            401: "Authentication credentials were not provided or the user is not a realtor.",
            404: "Order not found.",
        },
    )
    @transaction.atomic
    def delete(self, request, pk):
        try:
            with transaction.atomic():
                order = Order.objects.get(pk=pk, listing__realtor=request.user)
                order.delete()
                return Response({'success': "You deleted the order successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"An error occurred while deleting an order: {e}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
