from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import RentalShop, Vehicle, Booking

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    role = serializers.CharField(source='profile.role', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        role = profile_data.get('role', 'user')
        
        user = User.objects.create_user(**validated_data)
        
        # UserProfile is created by signal, just update the role
        user.profile.role = role
        user.profile.save()
        
        return user

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
