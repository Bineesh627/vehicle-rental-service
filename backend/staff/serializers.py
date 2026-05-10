from django.utils import timezone as django_timezone
from rest_framework import serializers
from .models import StaffTask

DELIVERY_OPTION_LABELS = {
    'self_pickup': 'Self pickup',
    'home_delivery': 'Home delivery',
    'pickup_service': 'Pickup service',
}


def _format_dt(dt):
    if not dt:
        return ''
    if django_timezone.is_aware(dt):
        dt = django_timezone.localtime(dt)
    return dt.strftime('%a %b %d, %Y • %I:%M %p')


class StaffTaskSerializer(serializers.ModelSerializer):
    vehicleName = serializers.SerializerMethodField()
    customerName = serializers.SerializerMethodField()
    customerPhone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    scheduledTime = serializers.SerializerMethodField()
    scheduledDateDisplay = serializers.SerializerMethodField()
    deliveryOption = serializers.SerializerMethodField()
    deliveryOptionLabel = serializers.SerializerMethodField()
    bookingStartDisplay = serializers.SerializerMethodField()
    bookingEndDisplay = serializers.SerializerMethodField()

    class Meta:
        model = StaffTask
        fields = [
            'id', 'type', 'vehicleName', 'customerName', 'customerPhone', 'address',
            'scheduledTime', 'scheduledDateDisplay', 'status', 'booking_id',
            'deliveryOption', 'deliveryOptionLabel', 'bookingStartDisplay', 'bookingEndDisplay',
        ]

    def get_vehicleName(self, obj):
        return f"{obj.booking.vehicle.brand} {obj.booking.vehicle.model}" if obj.booking and obj.booking.vehicle else "Unknown Vehicle"

    def get_customerName(self, obj):
        if not obj.booking or not obj.booking.user:
            return "Unknown Customer"
        user = obj.booking.user
        name = f"{user.first_name} {user.last_name}".strip()
        return name if name else user.username

    def get_customerPhone(self, obj):
        if not obj.booking or not obj.booking.user:
            return ""
        profile = getattr(obj.booking.user, 'user_profile', None)
        if profile and profile.phone:
            return (profile.phone or "").strip()
        return ""

    def get_address(self, obj):
        """Where staff should go: customer address for home delivery, else shop address."""
        b = obj.booking
        if not b:
            return ""
        if b.delivery_option == 'home_delivery':
            addr = (b.delivery_address or "").strip()
            if addr:
                return addr
            profile = getattr(b.user, 'user_profile', None) if b.user else None
            if profile and profile.address:
                return (profile.address or "").strip()
            return ""
        if b.shop:
            shop = b.shop
            name = (shop.name or "").strip()
            line = (shop.address or "").strip()
            if name and line:
                return f"{name} — {line}"
            return name or line
        return ""

    def get_scheduledTime(self, obj):
        if obj.scheduled_time:
            dt = obj.scheduled_time
            if django_timezone.is_aware(dt):
                dt = django_timezone.localtime(dt)
            return dt.strftime("%I:%M %p")
        return ""

    def get_scheduledDateDisplay(self, obj):
        return _format_dt(obj.scheduled_time)

    def get_deliveryOption(self, obj):
        if obj.booking:
            return obj.booking.delivery_option or ''
        return ''

    def get_deliveryOptionLabel(self, obj):
        if not obj.booking:
            return ''
        key = obj.booking.delivery_option or ''
        return DELIVERY_OPTION_LABELS.get(
            key,
            key.replace('_', ' ').title() if key else '',
        )

    def get_bookingStartDisplay(self, obj):
        if obj.booking and obj.booking.start_date:
            return _format_dt(obj.booking.start_date)
        return ''

    def get_bookingEndDisplay(self, obj):
        if obj.booking and obj.booking.end_date:
            return _format_dt(obj.booking.end_date)
        return ''


