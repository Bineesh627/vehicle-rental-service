import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rentals.models import RentalShop, Vehicle, Booking
from django.utils import timezone
from decimal import Decimal

def seed():
    print("Clearing existing data...")
    Booking.objects.all().delete()
    Vehicle.objects.all().delete()
    RentalShop.objects.all().delete()

    print("Seeding Rental Shops...")
    shop1 = RentalShop.objects.create(
        name="SpeedWheels Rentals",
        address="123 Main Street, Downtown",
        latitude=12.9716,
        longitude=77.5946,
        phone="1234567890",
        image="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        rating=4.8,
        review_count=234,
        operating_hours="8:00 AM - 10:00 PM",
        is_open=True
    )
    
    shop2 = RentalShop.objects.create(
        name="Urban Rides Co.",
        address="456 Oak Avenue, Midtown",
        latitude=12.975,
        longitude=77.6,
        phone="9876543210",
        image="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
        rating=4.6,
        review_count=189,
        operating_hours="7:00 AM - 9:00 PM",
        is_open=True
    )

    shop3 = RentalShop.objects.create(
        name="Premium Motors",
        address="789 Luxury Lane, Uptown",
        latitude=12.96,
        longitude=77.58, 
        image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
        rating=4.9,
        review_count=156,
        operating_hours="9:00 AM - 8:00 PM",
        is_open=True
    )

    print("Seeding Vehicles...")
    # Shop 1 Vehicles
    Vehicle.objects.create(
        shop=shop1,
        type='car',
        name="Toyota Camry",
        brand="Toyota",
        model="Camry 2024",
        number="KA 01 AB 1234",
        images=[
            "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
            "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
        ],
        price_per_hour=Decimal('15.00'),
        price_per_day=Decimal('89.00'),
        fuel_type="Petrol",
        transmission="Automatic",
        seating=5,
        is_available=True,
        features=["GPS", "Bluetooth", "USB Charging", "Air Conditioning"]
    )

    Vehicle.objects.create(
        shop=shop1,
        type='car',
        name="Honda Civic",
        brand="Honda",
        model="Civic 2023",
        number="KA 01 AB 5678",
        images=[
            "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80",
        ],
        price_per_hour=Decimal('12.00'),
        price_per_day=Decimal('75.00'),
        fuel_type="Petrol",
        transmission="Manual",
        seating=5,
        is_available=True,
        features=["GPS", "Bluetooth", "Backup Camera"]
    )
    
    Vehicle.objects.create(
        shop=shop1,
        type='bike',
        name="Royal Enfield Classic",
        brand="Royal Enfield",
        model="Classic 350",
        number="KA 01 AB 9012",
        images=[
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        ],
        price_per_hour=Decimal('8.00'),
        price_per_day=Decimal('45.00'),
        fuel_type="Petrol",
        transmission="Manual",
        is_available=True,
        features=["Helmet Included", "Luggage Box"]
    )

    # Shop 2 Vehicles
    Vehicle.objects.create(
        shop=shop2,
        type='bike',
        name="Honda Activa",
        brand="Honda",
        model="Activa 6G",
        number="KA 01 AB 3456",
        images=[
            "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800&q=80",
        ],
        price_per_hour=Decimal('5.00'),
        price_per_day=Decimal('30.00'),
        fuel_type="Petrol",
        transmission="Automatic",
        is_available=False,
        features=["Helmet Included", "Mobile Holder"]
    )

    # Shop 3 Vehicles
    Vehicle.objects.create(
        shop=shop3,
        type='car',
        name="BMW 3 Series",
        brand="BMW",
        model="330i 2024",
        number="KA 01 AB 7890",
        images=[
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        ],
        price_per_hour=Decimal('35.00'),
        price_per_day=Decimal('199.00'),
        fuel_type="Petrol",
        transmission="Automatic",
        seating=5,
        is_available=True,
        features=[
            "GPS",
            "Leather Seats",
            "Sunroof",
            "Premium Sound",
            "360° Camera",
        ]
    )

    print("Data seeded successfully!")

if __name__ == '__main__':
    seed()
