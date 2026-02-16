import os
import django
import sys

# Add the project directory to the sys.path
sys.path.append(os.getcwd())

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

from rentals.models import RentalShop, Vehicle, Booking

print("Django setup successful.")
print(f"RentalShop count: {RentalShop.objects.count()}")
print(f"Vehicle count: {Vehicle.objects.count()}")
print(f"Booking count: {Booking.objects.count()}")
