from rest_framework import viewsets
from .models import RentalShop, Vehicle, Booking
from .serializers import RentalShopSerializer, VehicleSerializer, BookingSerializer

class RentalShopViewSet(viewsets.ModelViewSet):
    queryset = RentalShop.objects.all()
    serializer_class = RentalShopSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
