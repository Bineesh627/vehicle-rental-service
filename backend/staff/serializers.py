from rest_framework import serializers
from .models import StaffTask, StaffComplaint
from rentals.serializers import BookingSerializer

class StaffTaskSerializer(serializers.ModelSerializer):
    vehicleName = serializers.SerializerMethodField()
    customerName = serializers.SerializerMethodField()
    customerPhone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    scheduledTime = serializers.SerializerMethodField()

    class Meta:
        model = StaffTask
        fields = ['id', 'type', 'vehicleName', 'customerName', 'customerPhone', 'address', 'scheduledTime', 'status', 'booking_id']

    def get_vehicleName(self, obj):
        return f"{obj.booking.vehicle.brand} {obj.booking.vehicle.model}" if obj.booking and obj.booking.vehicle else "Unknown Vehicle"

    def get_customerName(self, obj):
        if not obj.booking or not obj.booking.user: return "Unknown Customer"
        user = obj.booking.user
        name = f"{user.first_name} {user.last_name}".strip()
        return name if name else user.username

    def get_customerPhone(self, obj):
        if obj.booking and obj.booking.user and hasattr(obj.booking.user, 'user_profile'):
            return obj.booking.user.user_profile.phone or ""
        return ""

    def get_address(self, obj):
        # Prefer booking's delivery address, but fallback if needed
        return obj.booking.delivery_address if obj.booking and obj.booking.delivery_address else ""

    def get_scheduledTime(self, obj):
        # Format time for the frontend: e.g. "10:00 AM"
        # Since it's naive, we can just format it natively or use DRF's representation.
        if obj.scheduled_time:
            return obj.scheduled_time.strftime("%I:%M %p")
        return ""

class StaffComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffComplaint
        fields = ['id', 'subject', 'details', 'is_resolved', 'created_at']
        read_only_fields = ['id', 'is_resolved', 'created_at']

