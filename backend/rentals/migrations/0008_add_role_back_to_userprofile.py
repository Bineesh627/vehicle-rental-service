# Generated migration to add role field back to UserProfile
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('rentals', '0007_remove_userprofile_role_userprofile_address_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='role',
            field=models.CharField(
                choices=[('user', 'User'), ('staff', 'Staff'), ('admin', 'Admin'), ('owner', 'Owner')],
                default='user',
                max_length=10
            ),
        ),
    ]
