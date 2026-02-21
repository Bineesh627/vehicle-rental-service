from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RentalShopViewSet, VehicleViewSet, BookingViewSet,
    register, login,
    conversation_list, message_list,
    user_profile, user_stats,
    user_profile_update, user_settings_view,
    payment_methods_view, saved_locations_view, kyc_document_view,
)

router = DefaultRouter()
router.register(r'shops', RentalShopViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'bookings', BookingViewSet)

# Auto-generated routes:
# /api/shops/     -> List/Create/Detail Rental Shops
# /api/vehicles/  -> List/Create/Detail Vehicles
# /api/bookings/  -> List/Create/Detail Bookings
#
# Chat routes:
# GET  /api/chat/conversations/              -> list user's conversations
# POST /api/chat/conversations/              -> get or create conversation with a shop
# GET  /api/chat/conversations/<id>/messages/ -> get all messages in conversation
# POST /api/chat/conversations/<id>/messages/ -> send a message
urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    # Profile
    path('profile/', user_profile, name='user-profile'),
    path('profile/stats/', user_stats, name='user-stats'),
    path('profile/update/', user_profile_update, name='user-profile-update'),
    path('profile/settings/', user_settings_view, name='user-settings'),
    # Payment Methods
    path('payments/', payment_methods_view, name='payment-methods'),
    path('payments/<int:pk>/', payment_methods_view, name='payment-method-detail'),
    # Saved Locations
    path('locations/', saved_locations_view, name='saved-locations'),
    path('locations/<int:pk>/', saved_locations_view, name='saved-location-detail'),
    # KYC
    path('kyc/', kyc_document_view, name='kyc-document'),
    # Chat
    path('chat/conversations/', conversation_list, name='chat-conversations'),
    path('chat/conversations/<int:conversation_id>/messages/', message_list, name='chat-messages'),
]
