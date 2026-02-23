from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import (
    RentalShop, Vehicle, Booking, Conversation, Message,
    UserSettings, PaymentMethod, SavedLocation, KYCDocument, UserProfile, Notification
)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    role = serializers.CharField(source='user_profile.role', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('user_profile', {})
        role = profile_data.get('role', 'user')
        
        user = User.objects.create_user(**validated_data)
        
        # UserProfile is created by signal, just update the role
        user.user_profile.role = role
        user.user_profile.save()
        
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
    """Serializer for booking model with validation"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'vehicle', 'shop', 'booking_type', 
            'start_date', 'end_date', 'duration',
            'base_price', 'delivery_fee', 'service_fee', 'total_price',
            'delivery_option', 'delivery_address', 'payment_method', 
            'payment_status', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'total_price', 'payment_status', 'status', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add nested representation for frontend
        representation['vehicle'] = VehicleSerializer(instance.vehicle).data
        representation['shop'] = RentalShopSerializer(instance.shop).data
        return representation
    def validate(self, data):
        """Validate booking data"""
        vehicle = data.get('vehicle')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        booking_type = data.get('booking_type')
        duration = data.get('duration')
        
        # Check vehicle availability
        if vehicle and not vehicle.is_available:
            raise serializers.ValidationError("Vehicle is not available for booking")
        
        # Validate date logic
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError("End date must be after start date")
        
        # Check for overlapping bookings
        if vehicle and start_date and end_date:
            overlapping_bookings = Booking.objects.filter(
                vehicle=vehicle,
                status__in=['active', 'upcoming'],
                start_date__lt=end_date,
                end_date__gt=start_date
            ).exclude(id=self.instance.id if self.instance else None)
            
            if overlapping_bookings.exists():
                raise serializers.ValidationError("Vehicle is already booked for this time period")
        
        # Calculate and validate total price
        base_price = data.get('base_price', 0)
        delivery_fee = data.get('delivery_fee', 0)
        service_fee = data.get('service_fee', 5)
        calculated_total = base_price + delivery_fee + service_fee
        
        if booking_type == 'hour':
            expected_base = vehicle.price_per_hour * duration if vehicle else 0
        else:
            expected_base = vehicle.price_per_day * duration if vehicle else 0
            
        if abs(float(base_price) - float(expected_base)) > 0.01:
            raise serializers.ValidationError("Price calculation mismatch")
        
        data['total_price'] = calculated_total
        return data
    
    def create(self, validated_data):
        """Create booking with automatic field population"""
        # Set shop from vehicle
        vehicle = validated_data.get('vehicle')
        if vehicle:
            validated_data['shop'] = vehicle.shop
        
        return super().create(validated_data)

class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new bookings"""
    vehicle_id = serializers.IntegerField(write_only=True)
    booking_type = serializers.ChoiceField(choices=Booking.BOOKING_TYPES)
    start_date = serializers.DateTimeField()
    duration = serializers.IntegerField(min_value=1)
    delivery_option = serializers.ChoiceField(choices=Booking.DELIVERY_OPTIONS, default='self')
    delivery_address = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=Booking.PAYMENT_METHODS)
    
    class Meta:
        model = Booking
        fields = [
            'vehicle_id', 'booking_type', 'start_date', 'duration',
            'delivery_option', 'delivery_address', 'payment_method'
        ]
    
    def validate_vehicle_id(self, value):
        """Validate vehicle exists and is available"""
        try:
            vehicle = Vehicle.objects.get(id=value, is_available=True)
            return vehicle
        except Vehicle.DoesNotExist:
            raise serializers.ValidationError("Vehicle not found or not available")
    
    def validate(self, data):
        """Validate booking creation data"""
        vehicle = data.get('vehicle_id')
        start_date = data.get('start_date')
        duration = data.get('duration')
        booking_type = data.get('booking_type')
        delivery_option = data.get('delivery_option')
        
        # Validate delivery address if delivery option is selected
        if delivery_option == 'delivery' and not data.get('delivery_address'):
            raise serializers.ValidationError("Delivery address is required for home delivery")
        
        # Calculate end date based on booking type and duration
        from datetime import timedelta
        if booking_type == 'hour':
            end_date = start_date + timedelta(hours=duration)
            base_price = vehicle.price_per_hour * duration
        else:
            end_date = start_date + timedelta(days=duration)
            base_price = vehicle.price_per_day * duration
        
        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            vehicle=vehicle,
            status__in=['active', 'upcoming'],
            start_date__lt=end_date,
            end_date__gt=start_date
        )
        
        if overlapping_bookings.exists():
            raise serializers.ValidationError("Vehicle is already booked for this time period")
        
        # Prepare booking data
        delivery_fee = 10 if delivery_option == 'delivery' else 0
        service_fee = 5
        booking_data = {
            'vehicle': vehicle,
            'shop': vehicle.shop,
            'booking_type': booking_type,
            'start_date': start_date,
            'end_date': end_date,
            'duration': duration,
            'base_price': base_price,
            'delivery_fee': delivery_fee,
            'service_fee': service_fee,
            'total_price': float(base_price) + delivery_fee + service_fee,
            'delivery_option': delivery_option,
            'delivery_address': data.get('delivery_address'),
            'payment_method': data.get('payment_method'),
        }
        
        return booking_data


# ── Chat Serializers ───────────────────────────────────────────────────────────

class MessageSerializer(serializers.ModelSerializer):
    """Serialises a single chat message."""
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_name = serializers.CharField(source='sender.first_name', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender_id', 'sender_name',
            'sender_role', 'text', 'image_url', 'is_read', 'created_at',
        ]
        read_only_fields = ['id', 'sender_id', 'sender_name', 'sender_role', 'is_read', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    """Serialises a conversation with preview info for the chat list."""
    shop_id = serializers.IntegerField(source='shop.id', read_only=True)
    shop_name = serializers.CharField(source='shop.name', read_only=True)
    # is_online is a placeholder; you can flip this to a real presence flag later
    is_online = serializers.SerializerMethodField()
    last_message_text = serializers.SerializerMethodField()
    last_message_time = serializers.SerializerMethodField()
    unread_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'shop_id', 'shop_name',
            'is_online', 'last_message_text', 'last_message_time',
            'unread_count', 'updated_at',
        ]

    def get_is_online(self, obj):
        return False  # Extend with WebSocket presence later

    def get_last_message_text(self, obj):
        msg = obj.last_message
        return msg.text if msg else ''

    def get_last_message_time(self, obj):
        msg = obj.last_message
        if not msg:
            return ''
        # Return a short human-readable time string
        from django.utils import timezone
        from datetime import timedelta
        now = timezone.now()
        delta = now - msg.created_at
        if delta < timedelta(days=1):
            local = msg.created_at.astimezone()
            return local.strftime('%I:%M %p')
        elif delta < timedelta(days=7):
            return msg.created_at.strftime('%a')
        else:
            return msg.created_at.strftime('%d/%m/%y')


# ── Profile Serializers ───────────────────────────────────────────────────────────

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializes user profile information."""
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    role = serializers.CharField(source='user_profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'role']

class UserStatsSerializer(serializers.Serializer):
    """Serializes user booking statistics."""
    total_bookings = serializers.IntegerField()
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2)
    saved_places = serializers.IntegerField()
    active_bookings = serializers.IntegerField()
    completed_bookings = serializers.IntegerField()


# ── Profile Management Serializers ───────────────────────────────────────────────────────────

class UserSettingsSerializer(serializers.ModelSerializer):
    """Serializes user notification settings."""
    class Meta:
        model = UserSettings
        fields = [
            'push_notifications', 'email_notifications', 'sms_notifications',
            'booking_updates', 'payment_alerts', 'promotions', 'reminders'
        ]

class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializes payment methods with sensitive data masking."""
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'type', 'name', 'details', 'is_default', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class PaymentMethodCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new payment methods."""
    class Meta:
        model = PaymentMethod
        fields = [
            'type', 'name', 'details', 'card_number', 'card_holder', 
            'expiry_date', 'is_default'
        ]

class SavedLocationSerializer(serializers.ModelSerializer):
    """Serializes saved locations."""
    class Meta:
        model = SavedLocation
        fields = ['id', 'name', 'address', 'type', 'latitude', 'longitude', 'created_at']
        read_only_fields = ['id', 'created_at']

class KYCDocumentSerializer(serializers.ModelSerializer):
    """Serializes KYC documents."""
    class Meta:
        model = KYCDocument
        fields = [
            'full_name', 'date_of_birth', 'address', 'phone', 'email',
            'driving_license_number', 'secondary_doc_type', 'secondary_doc_number',
            'status', 'submitted_at', 'verified_at'
        ]
        read_only_fields = ['status', 'submitted_at', 'verified_at']

class KYCDocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer for submitting KYC documents."""
    class Meta:
        model = KYCDocument
        fields = [
            'full_name', 'date_of_birth', 'address', 'phone', 'email',
            'driving_license_number', 'driving_license_photo',
            'secondary_doc_type', 'secondary_doc_number', 'secondary_doc_photo'
        ]

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile information."""
    first_name = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False)
    
    class Meta:
        model = User
        fields = ['first_name', 'email', 'phone']
    
    def update(self, instance, validated_data):
        # Update User fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        
        # Handle address separately since it's in UserProfile
        address = self.context.get('address')
        if address is not None:
            user_profile, created = UserProfile.objects.get_or_create(user=instance)
            user_profile.address = address
            user_profile.save()
        
        return instance

from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'is_read', 'created_at']
        read_only_fields = ['created_at']
