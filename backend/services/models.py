from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, help_text="Font Awesome or other icon class, e.g., 'fa-code'")
    price_range = models.CharField(max_length=100, blank=True, help_text="e.g., '$500 - $2000'")
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']