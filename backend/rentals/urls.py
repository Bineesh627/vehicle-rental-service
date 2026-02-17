from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RentalShopViewSet, VehicleViewSet, BookingViewSet, register, login

router = DefaultRouter()
router.register(r'shops', RentalShopViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
]
