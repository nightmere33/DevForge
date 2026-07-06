from django.conf import settings
from django.db import models


class SupportPlan(models.Model):
    """A maintenance / support plan clients can subscribe to after delivery."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    period_months = models.PositiveIntegerField(default=1, help_text="Billing period in months")
    features = models.TextField(blank=True, help_text="One feature per line")
    popular = models.BooleanField(default=False, help_text="Highlight this plan")
    active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'price']

    def __str__(self):
        return f"{self.name} ({self.price} {self.currency}/{self.period_months}mo)"


class Subscription(models.Model):
    STATUS_CHOICES = (
        ('requested', 'Requested'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    )
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SupportPlan, on_delete=models.PROTECT, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    note = models.TextField(blank=True, help_text="Client note, e.g. which project needs support")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client} → {self.plan.name} ({self.status})"
