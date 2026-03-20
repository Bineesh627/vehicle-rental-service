# Generated manually - remove vehicle_number field from Vehicle model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rentals', '0004_booking_return_location_alter_booking_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vehicle',
            name='vehicle_number',
        ),
    ]
