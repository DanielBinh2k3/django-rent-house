# Generated by Django 4.2 on 2023-06-02 09:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0012_listing_base_listin_realtor_e00890_idx_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="listing",
            name="realtor",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="listings",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
