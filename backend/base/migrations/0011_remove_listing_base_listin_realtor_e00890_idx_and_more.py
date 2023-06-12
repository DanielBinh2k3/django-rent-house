# Generated by Django 4.2 on 2023-06-02 08:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0010_remove_listing_base_listin_title_286331_idx"),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name="listing", name="base_listin_realtor_e00890_idx",
        ),
        migrations.RemoveIndex(
            model_name="listing", name="base_listin_city_id_67cd3c_idx",
        ),
        migrations.RemoveIndex(
            model_name="listing", name="base_listin_distric_647611_idx",
        ),
        migrations.RemoveIndex(
            model_name="listing", name="base_listin_price_140c11_idx",
        ),
        migrations.RemoveIndex(
            model_name="useraccount", name="base_userac_email_d9cfe3_idx",
        ),
        migrations.RemoveIndex(
            model_name="useraccount", name="base_userac_name_7e48b5_idx",
        ),
    ]
