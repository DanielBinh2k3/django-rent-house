# Generated by Django 4.2 on 2023-05-30 08:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0006_alter_order_listing"),
    ]

    operations = [
        migrations.AddField(
            model_name="listing",
            name="is_available",
            field=models.BooleanField(default=False),
        ),
    ]
