from rest_framework import serializers
from .models import RentalShop, Vehicle, Booking

class RentalShopSerializer(serializers.ModelSerializer):
    vehicleCount = serializers.SerializerMethodField()

    class Meta:
        model = RentalShop
        fields = '__all__'

    def get_vehicleCount(self, obj):
        cars = obj.vehicles.filter(type='car').count()
        bikes = obj.vehicles.filter(type='bike').count()
        return {'cars': cars, 'bikes': bikes}

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
