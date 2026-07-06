from django.contrib import admin
from .models import Ticket, TicketMessage, TicketUpdate


class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 0
    readonly_fields = ('sender', 'created_at')


class TicketUpdateInline(admin.TabularInline):
    model = TicketUpdate
    extra = 0
    readonly_fields = ('created_at',)


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'client', 'service', 'status', 'priority',
                    'progress', 'price_agreed', 'updated_at')
    list_filter = ('status', 'priority')
    search_fields = ('subject', 'description', 'client__username', 'phone')
    inlines = [TicketUpdateInline, TicketMessageInline]
