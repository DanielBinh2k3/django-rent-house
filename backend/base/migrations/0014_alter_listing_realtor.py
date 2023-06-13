# Generated by Django 4.2 on 2023-06-06 08:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0013_alter_listing_realtor"),
    ]

    operations = [
        migrations.AlterField(
            model_name="listing",
            name="realtor",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
    ]