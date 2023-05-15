from django.urls import path
from base.views import listing_views
from base.views.listing_views import ManageListingView, ListingsView, \
    ListingDetailView, SearchListingView, ListingPkDetailView, \
    OrderListingNormalView

urlpatterns = [
    path('manage', ManageListingView.as_view()),
    path('get-listings', ListingsView.as_view()),
    path('detail', ListingDetailView.as_view()),
    path('detail/<int:pk>', ListingPkDetailView.as_view()),
    path('search', SearchListingView.as_view()),
    path('order', OrderListingNormalView.as_view()),
    path('upload-image', listing_views.uploadImages,)
]