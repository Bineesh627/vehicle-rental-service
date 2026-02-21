"""
Management command: seed_chat

Creates sample chat data so you can immediately test the chat feature:
  - A demo user      (email: testuser@demo.com, password: testpass123)
  - A conversation   between that user and the first available shop
  - 8 sample messages back and forth

Usage:
    python manage.py seed_chat
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rentals.models import RentalShop, UserProfile, Conversation, Message


SAMPLE_MESSAGES = [
    ("user",  "Hi! Is the Toyota Camry still available for tomorrow?"),
    ("staff", "Hello! Yes, it's available. Which time slot were you thinking?"),
    ("user",  "I'd like to pick it up around 10 AM and return by 6 PM."),
    ("staff", "That works great! The hourly rate is $15, so that would be $120 for 8 hours."),
    ("user",  "Sounds good. Do you need any documents from me?"),
    ("staff", "Just a valid driving licence and a government-issued ID. You can bring them when you arrive."),
    ("user",  "Perfect, I'll book it now through the app. Thank you!"),
    ("staff", "Great! We'll have the car ready for you. See you tomorrow at 10 AM 😊"),
]


class Command(BaseCommand):
    help = "Seeds sample chat data for testing."

    def handle(self, *args, **options):
        # ── 1. Ensure a demo user exists ──────────────────────────────────────
        user, user_created = User.objects.get_or_create(
            username="testuser@demo.com",
            defaults={
                "email": "testuser@demo.com",
                "first_name": "Test User",
            },
        )
        if user_created:
            user.set_password("testpass123")
            user.save()
            self.stdout.write(self.style.SUCCESS("✔ Created demo user: testuser@demo.com / testpass123"))
        else:
            self.stdout.write("→ Demo user already exists.")

        # Ensure profile exists and has role 'user'
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = "user"
        profile.save()

        # ── 2. Ensure a staff user exists (to reply as staff) ─────────────────
        staff_user, staff_created = User.objects.get_or_create(
            username="staff@demo.com",
            defaults={
                "email": "staff@demo.com",
                "first_name": "Shop Staff",
            },
        )
        if staff_created:
            staff_user.set_password("staffpass123")
            staff_user.save()
            self.stdout.write(self.style.SUCCESS("✔ Created staff user: staff@demo.com / staffpass123"))
        else:
            self.stdout.write("→ Staff user already exists.")

        staff_profile, _ = UserProfile.objects.get_or_create(user=staff_user)
        staff_profile.role = "staff"
        staff_profile.save()

        # ── 3. Pick a shop ────────────────────────────────────────────────────
        shop = RentalShop.objects.first()
        if not shop:
            # Create a placeholder shop if none exist
            shop = RentalShop.objects.create(
                name="SpeedWheels Rentals",
                address="123 Main Street, City",
                latitude=0.0,
                longitude=0.0,
                phone="+91 98765 43210",
                rating=4.5,
                review_count=42,
                operating_hours="9 AM – 8 PM",
                is_open=True,
            )
            self.stdout.write(self.style.SUCCESS(f"✔ Created placeholder shop: {shop.name}"))
        else:
            self.stdout.write(f"→ Using existing shop: {shop.name}")

        # ── 4. Get or create the conversation ─────────────────────────────────
        conv, conv_created = Conversation.objects.get_or_create(user=user, shop=shop)
        if conv_created:
            self.stdout.write(self.style.SUCCESS(f"✔ Created conversation #{conv.id}"))
        else:
            self.stdout.write(f"→ Conversation #{conv.id} already exists.")

        # ── 5. Add sample messages (only if conversation is empty) ────────────
        if conv.messages.exists():
            self.stdout.write("→ Messages already exist — skipping seed to avoid duplicates.")
        else:
            for role, text in SAMPLE_MESSAGES:
                sender = user if role == "user" else staff_user
                Message.objects.create(
                    conversation=conv,
                    sender=sender,
                    sender_role=role,
                    text=text,
                )
            self.stdout.write(self.style.SUCCESS(f"✔ Added {len(SAMPLE_MESSAGES)} sample messages."))

        # ── Summary ───────────────────────────────────────────────────────────
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("━" * 50))
        self.stdout.write(self.style.SUCCESS("  Chat seed complete! Login credentials:"))
        self.stdout.write(f"  User  → email: testuser@demo.com  password: testpass123")
        self.stdout.write(f"  Staff → email: staff@demo.com     password: staffpass123")
        self.stdout.write(f"  Shop  → {shop.name} (ID: {shop.id})")
        self.stdout.write(f"  Conv  → ID: {conv.id}")
        self.stdout.write(self.style.SUCCESS("━" * 50))
