from django.urls import path
from base.views import listing_views
from base.views.listing_views import ManageListingView, ListingsView, \
    ListingDetailView, SearchListingView, SearchListingRealtorView,\
    OrderListingNormalView, OrderListingRealtorView \

urlpatterns = [
    path('manage', ManageListingView.as_view(), name='manage-listing'),
    path('manage/<int:pk>', ManageListingView.as_view(), name='manage-listing-detail'),
    path('get-listings', ListingsView.as_view(), name='listings'),
    path('detail', ListingDetailView.as_view(), name='listing-detail'),
    path('search', SearchListingView.as_view(), name='search-listing'),
    path('manage/search', SearchListingRealtorView.as_view(), name='search-realtor-listing'),
    path('order', OrderListingNormalView.as_view(), name='order-listing-normal'),
    path('manage/order', OrderListingRealtorView.as_view(), name='order-listing-realtor'),
]
