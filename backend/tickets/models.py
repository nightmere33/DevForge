from django.conf import settings
from django.core.validators import MaxValueValidator
from django.db import models
from services.models import Service


class Ticket(models.Model):
    """A client order / project request."""
    STATUS_CHOICES = (
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('in_progress', 'In Progress'),
        ('review', 'In Review'),
        ('delivered', 'Delivered'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    )
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tickets')
    subject = models.CharField(max_length=200)
    description = models.TextField()
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    budget = models.CharField(max_length=100, blank=True, help_text="Client's budget, e.g. '$500 - $1000'")
    phone = models.CharField(max_length=50, blank=True, help_text="Client phone so the developer can call")
    whatsapp = models.CharField(max_length=50, blank=True)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    progress = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(100)])
    price_agreed = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                       help_text="Final agreed price, used for revenue stats")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"#{self.pk} {self.subject} ({self.status})"


class TicketMessage(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ticket_messages')
    body = models.TextField(blank=True)
    attachment = models.FileField(upload_to='tickets/', blank=True, null=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message on #{self.ticket_id} by {self.sender}"


class TicketUpdate(models.Model):
    """A progress update posted by the developer (screenshot / video / milestone)."""
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    progress = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(100)])
    attachment = models.FileField(upload_to='updates/', blank=True, null=True,
                                  help_text="Screenshot or video of the progress")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Update on #{self.ticket_id}: {self.title}"
