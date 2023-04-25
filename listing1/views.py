from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Listing
from .serializers import PropertySerializer

class ManageListingView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user

            if not user.is_realtor:
                return Response(
                    {'error': 'User does not have necessary permissions for getting this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            slug = request.query_params.get('slug')

            if not slug:
                listing = Listing.objects.order_by('-date_created').filter(
                    realtor=user.email
                )
                listing = PropertySerializer(listing, many=True)
                
                return Response(
                    {'listings': listing.data},
                    status=status.HTTP_200_OK
                )

            if not Listing.objects.filter(
                realtor=user.email,
                slug=slug
            ).exists():
                return Response(
                    {'error': 'Listing not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            listing = Listing.objects.get(realtor=user.email, slug=slug)
            listing = PropertySerializer(listing)

            return Response(
                {'listing': listing.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving listing or listing detail'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    
    
    def post(self, request):
        try:
            user = request.user

            if not user.is_realtor:
                return Response(
                    {'error': 'User does not have necessary permissions for creating this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            data = request.data
            
            title = data['title']
            slug = data['slug']
            if Listing.objects.filter(slug=slug).exists():
                return Response(
                    {'error': 'Listing with this slug already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            address = data['address']
            city = data['city']
            zipcode = data['zipcode']
            description = data['description']
            
            home_type = data['home_type']
            
            if home_type == 'CONDO':
                home_type = 'Condo'
            elif home_type == 'TOWNHOUSE':
                home_type = 'Townhouse'
            else:
                home_type = 'House'
            
            price = data['price']
            bedrooms = data['bedrooms']
            
            bathrooms = data['bathrooms']
            
            try:
                price = float(price)
                bedrooms = int(bedrooms)
                bathrooms = float(bathrooms)
            except:
                return Response(
                    {'error': 'This field must be integer'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            main_photo = data['main_photo']
            
            photo1 = data['photo1']
            photo2 = data['photo2']
            photo3 = data['photo3']
            photo4 = data['photo4']
            
            is_published = data['is_published']
            
            if is_published == 'True':
                is_published = True
            else:
                is_published = False
            print(data)
            Listing.objects.create(
                realtor=user.email,
                title=title,
                slug=slug,
                address=address,
                city=city,
                zipcode=zipcode,
                description=description,
                price=price,
                bedrooms=bedrooms,
                bathrooms=bathrooms,
                home_type=home_type,
                main_photo=main_photo,
                photo1=photo1,
                photo2=photo2,
                photo3=photo3,
                photo4=photo4,
                is_published=is_published
            )
            
            return Response(
                {'success': 'Property created successfully'},
                status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {'error': 'Something went wrong when uploading property'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # def put(self, request):
    #     try:
    #         user = request.user

    #         if not user.is_realtor:
    #             return Response(
    #                 {'error': 'User does not have necessary permissions for updating this listing data'},
    #                 status=status.HTTP_403_FORBIDDEN
    #             )

    #         data = request.data

    #         data = self.retrieve_values(data)

    #         if data == -1:
    #             return Response(
    #                 {'error': 'Price must be an integer'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )
    #         elif data == -2:
    #             return Response(
    #                 {'error': 'Bedrooms must be an integer'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )
    #         elif data == -3:
    #             return Response(
    #                 {'error': 'Bathrooms must be a floating point value'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         title = data['title']
    #         slug = data['slug']
    #         address = data['address']
    #         city = data['city']
    #         state = data['state']
    #         zipcode = data['zipcode']
    #         description = data['description']
    #         price = data['price']
    #         bedrooms = data['bedrooms']
    #         bathrooms = data['bathrooms']
    #         sale_type = data['sale_type']
    #         home_type = data['home_type']
    #         main_photo = data['main_photo']
    #         photo_1 = data['photo_1']
    #         photo_2 = data['photo_2']
    #         photo_3 = data['photo_3']
    #         is_published = data['is_published']

    #         if not Listing.objects.filter(realtor=user.email, slug=slug).exists():
    #             return Response(
    #                 {'error': 'Listing does not exist'},
    #                 status=status.HTTP_404_NOT_FOUND
    #             )

    #         Listing.objects.filter(realtor=user.email, slug=slug).update(
    #             title=title,
    #             slug=slug,
    #             address=address,
    #             city=city,
    #             state=state,
    #             zipcode=zipcode,
    #             description=description,
    #             price=price,
    #             bedrooms=bedrooms,
    #             bathrooms=bathrooms,
    #             sale_type=sale_type,
    #             home_type=home_type,
    #             main_photo=main_photo,
    #             photo_1=photo_1,
    #             photo_2=photo_2,
    #             photo_3=photo_3,
    #             is_published=is_published
    #         )

    #         return Response(
    #             {'success': 'Listing updated successfully'},
    #             status=status.HTTP_200_OK
    #         )
    #     except:
    #         return Response(
    #             {'error': 'Something went wrong when updating listing'},
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #         )

    # def patch(self, request):
    #     try:
    #         user = request.user

    #         if not user.is_realtor:
    #             return Response(
    #                 {'error': 'User does not have necessary permissions for updating this listing data'},
    #                 status=status.HTTP_403_FORBIDDEN
    #             )

    #         data = request.data

    #         slug = data['slug']

    #         is_published = data['is_published']
    #         if is_published == 'True':
    #             is_published = True
    #         else:
    #             is_published = False

    #         if not Listing.objects.filter(realtor=user.email, slug=slug).exists():
    #             return Response(
    #                 {'error': 'Listing does not exist'},
    #                 status=status.HTTP_404_NOT_FOUND
    #             )

    #         Listing.objects.filter(realtor=user.email, slug=slug).update(
    #             is_published=is_published
    #         )

    #         return Response(
    #             {'success': 'Listing publish status updated successfully'},
    #             status=status.HTTP_200_OK
    #         )
    #     except:
    #         return Response(
    #             {'error': 'Something went wrong when updating listing'},
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #         )

    def delete(self, request):
        try:
            user = request.user

            if not user.is_realtor:
                return Response(
                    {'error': 'User does not have necessary permissions for deleting this listing data'},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data

            try:
                slug = data['slug']
            except:
                return Response(
                    {'error': 'Slug was not provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not Listing.objects.filter(realtor=user.email, slug=slug).exists():
                return Response(
                    {'error': 'Listing you are trying to delete does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )

            Listing.objects.filter(realtor=user.email, slug=slug).delete()

            if not Listing.objects.filter(realtor=user.email, slug=slug).exists():
                return Response(
                    status=status.HTTP_204_NO_CONTENT
                )
            else:
                return Response(
                    {'error': 'Failed to delete listing'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except:
            return Response(
                {'error': 'Something went wrong when deleting listing'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ListingDetailView(APIView):
    def get(self, request, format=None):
        try:
            slug = request.query_params.get('slug')

            if not slug:
                return Response(
                    {'error': 'Must provide slug'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not Listing.objects.filter(slug=slug, is_published=True).exists():
                return Response(
                    {'error': 'Published listing with this slug does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )

            listing = Listing.objects.get(slug=slug, is_published=True)
            listing = PropertySerializer(listing)

            return Response(
                {'listing': listing.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving listing detail'},
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