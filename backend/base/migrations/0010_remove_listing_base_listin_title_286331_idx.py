# Generated by Django 4.2 on 2023-06-02 08:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0009_listing_base_listin_realtor_e00890_idx_and_more"),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name="listing", name="base_listin_title_286331_idx",
        ),
    ]
