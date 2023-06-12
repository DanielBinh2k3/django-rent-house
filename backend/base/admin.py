from django.contrib import admin
from .models import Listing
from django.contrib.auth import get_user_model
User = get_user_model()
from .extras import delete_user_data


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    # A handy constant for the name of the alternate database.
    using = "default"
    list_display = ('id', 'name', 'email',  )
    list_display_links = ('id', 'name', 'email', )
    search_fields = ('id','name', 'email')
    list_per_page = 10

    def save_model(self, request, obj, form, change):
        # Tell Django to save objects to the 'other' database.
        obj.save(using=self.using)

    def delete_model(self, request, obj):
        # Tell Django to delete objects from the 'other' database
        email = obj.email
        print("Delete the email", email)
        obj.delete(using=self.using)
        print("CALLING TO DELETE THE DATA...")
        delete_user_data(email)
        print("FINISH DELETE")

    def get_queryset(self, request):
        # Tell Django to look for objects on the 'other' database.
        return super().get_queryset(request).using(self.using)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Tell Django to populate ForeignKey widgets using a query
        # on the 'other' database.
        return super().formfield_for_foreignkey(
            db_field, request, using=self.using, **kwargs
        )

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        # Tell Django to populate ManyToMany widgets using a query
        # on the 'other' database.
        return super().formfield_for_manytomany(
            db_field, request, using=self.using, **kwargs
        )
admin.site.register(User, UserAdmin)

class ListingAdmin(admin.ModelAdmin):
    # A handy constant for the name of the alternate database.
    using = "default"
    list_display = ('id', 'realtor', 'title', 'slug', )
    list_display_links = ('id', 'realtor', 'title', 'slug', )
    list_filter = ('realtor',)
    search_fields = ('title', 'description')
    list_per_page = 10

    def save_model(self, request, obj, form, change):
        # Tell Django to save objects to the 'other' database.
        obj.save(using=self.using)

    def delete_model(self, request, obj):
        # Tell Django to delete objects from the 'other' database
        obj.delete(using=self.using)

    def get_queryset(self, request):
        # Tell Django to look for objects on the 'other' database.
        return super().get_queryset(request).using(self.using)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Tell Django to populate ForeignKey widgets using a query
        # on the 'other' database.
        return super().formfield_for_foreignkey(
            db_field, request, using=self.using, **kwargs
        )

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        # Tell Django to populate ManyToMany widgets using a query
        # on the 'other' database.
        return super().formfield_for_manytomany(
            db_field, request, using=self.using, **kwargs
        )


admin.site.register(Listing, ListingAdmin)

