from django.db import models
from django.contrib.auth.models import User

class RentalShop(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    rating = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)
    operating_hours = models.CharField(max_length=100, blank=True, null=True)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('car', 'Car'),
        ('bike', 'Bike'),
    ]
    
    shop = models.ForeignKey(RentalShop, related_name='vehicles', on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=VEHICLE_TYPES)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    number = models.CharField(max_length=50) # Registration number
    images = models.JSONField(default=list) # List of image URLs
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    fuel_type = models.CharField(max_length=50)
    transmission = models.CharField(max_length=50)
    seating = models.IntegerField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    features = models.JSONField(default=list) # List of features
    vehicle_number = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.number})"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('upcoming', 'Upcoming'),
    ]

    vehicle = models.ForeignKey(Vehicle, related_name='bookings', on_delete=models.CASCADE)
    shop = models.ForeignKey(RentalShop, related_name='bookings', on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')

    def __str__(self):
        return f"Booking {self.id} - {self.vehicle.name}"

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
        ('owner', 'Owner'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
