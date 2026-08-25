from django.contrib import admin

from .models import (
    ContactInfo,
    ContactMessage,
    Education,
    Interest,
    Profile,
    Project,
    Skill,
)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("institution", "graduation_year", "is_current", "order")
    list_filter = ("is_current",)
    search_fields = ("institution", "degree")
    ordering = ("order", "-graduation_year")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "rating", "order")
    list_filter = ("category",)
    search_fields = ("name",)
    ordering = ("order", "name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "project_type", "year", "is_featured", "order")
    list_filter = ("project_type", "is_featured")
    search_fields = ("name", "description")
    filter_horizontal = ("skills",)
    ordering = ("order", "-year")


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    search_fields = ("name",)
    ordering = ("order", "name")


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ("email", "phone")

    def has_add_permission(self, request):
        # Singleton: one row only, edit it instead of adding more.
        return not ContactInfo.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("start_year", "happy_clients", "photo", "resume")

    def has_add_permission(self, request):
        return not Profile.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "created_at", "emailed")
    list_filter = ("emailed",)
    search_fields = ("name", "email", "message")
    readonly_fields = ("name", "phone", "email", "message", "created_at", "emailed")

    def has_add_permission(self, request):
        return False
