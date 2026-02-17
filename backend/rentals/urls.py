from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RentalShopViewSet, VehicleViewSet, BookingViewSet, register, login

router = DefaultRouter()
router.register(r'shops', RentalShopViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'bookings', BookingViewSet)

# Using DefaultRouter automatically generates the API Root and CRUD routes:
# /api/shops/ -> List/Create Rental Shops
# /api/vehicles/ -> List/Create Vehicles
# /api/bookings/ -> List/Create Bookings
urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
]
