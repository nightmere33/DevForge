from django.contrib import admin
from .models import SupportPlan, Subscription


@admin.register(SupportPlan)
class SupportPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'currency', 'period_months', 'popular', 'active', 'order')
    list_editable = ('popular', 'active', 'order')


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'plan', 'status', 'start_date', 'end_date', 'created_at')
    list_filter = ('status', 'plan')
    search_fields = ('client__username',)
