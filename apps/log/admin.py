import re

from django.contrib import admin
from django import forms
from django.utils.html import format_html

from .models import TicketLog, TicketLogAttachments


class ImageModelInline(admin.TabularInline):
    model = TicketLogAttachments
    extra = 0
    readonly_fields = ('preview', 'img',)
    max_num = 0
    can_delete = False

    def has_change_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.filter()

    def preview(self, obj):
        return format_html(
            '<div id="lightgallery"><a href="{}" data-lg-size="1600-2400"><img src="{}" height="50" /></a></div>',
            re.sub(r"^/media/", "/django-admin-media/", obj.img.url),
            re.sub(r"^/media/", "/django-admin-media/", obj.img.url),
        )

    preview.short_description = 'Preview'


class TicketLogForm(forms.ModelForm):
    class Meta:
        model = TicketLog
        fields = (
            "code", "user", "title", "hash_tags",
            "resolve_state", "resolve_date", "resolve_msg",
        )


FIELDS_HAS_CHANGE_TICKET = [
    'resolve_state',
    'resolve_date',
    'resolve_msg',
]


@admin.register(TicketLog)
class TicketLogAdmin(admin.ModelAdmin):
    form = TicketLogForm
    inlines = [ImageModelInline]
    empty_value_display = "-empty-"
    list_select_related = ["user"]
    list_display = ["code", "user", "title", "hash_tags", "resolve_state", "date_created"]
    ordering = ["-date_created"]
    search_fields = ["title", "code", "remarks"]
    list_filter = ["resolve_state", "date_created"]

    def has_add_permission(self, request):
        return False

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return [field.name for field in obj._meta.fields if field.name not in FIELDS_HAS_CHANGE_TICKET]
        return []

    class Media:
        js = (
            'admin/lightgallery_2.7.1/lightgallery.min.js',
            'admin/lightgallery_2.7.1/initializations.js',
        )
        css = {
            'all': (
                'admin/lightgallery_2.7.1/lightgallery.min.css',
                'admin/lightgallery_2.7.1/lg-medium-zoom.min.css',
            )
        }
