from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import (
    RentalShop, Vehicle, Booking, Conversation, Message,
    UserSettings, PaymentMethod, SavedLocation, KYCDocument
)

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
    role = serializers.CharField(source='profile.role', read_only=True)

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
