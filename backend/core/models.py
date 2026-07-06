from django.db import models


class SiteConfiguration(models.Model):
    """Singleton holding every piece of editable site content."""
    # Branding
    site_name = models.CharField(max_length=100, default="DevForge")
    tagline = models.CharField(max_length=200, blank=True, default="Crafting Code, Building Solutions")

    # Hero section
    hero_title = models.CharField(max_length=200, default="DevForge – Crafting Code, Building Solutions")
    hero_subtitle = models.TextField(
        blank=True,
        default="Full-stack developer & Master's student in Computer Science specializing in "
                "Mobile Networks and Embedded Systems. I build web apps, mobile apps and automation tools."
    )
    hero_cta_text = models.CharField(max_length=100, default="Start a Project")

    # Stats shown on the home page
    years_experience = models.PositiveIntegerField(default=3)
    projects_completed = models.PositiveIntegerField(default=20)
    happy_clients = models.PositiveIntegerField(default=10)

    # About section (supports plain paragraphs, one per line)
    about_title = models.CharField(max_length=200, default="About Me")
    about_text = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='site/', blank=True, null=True)
    cv_file = models.FileField(upload_to='site/', blank=True, null=True, help_text="Downloadable CV / resume")

    # Contact info
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)
    availability = models.CharField(max_length=200, blank=True, default="Available for freelance work")

    # Social links
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    whatsapp = models.CharField(max_length=50, blank=True, help_text="Number with country code, e.g. +213...")
    fiverr_url = models.URLField(blank=True)
    upwork_url = models.URLField(blank=True)

    # Footer
    footer_text = models.CharField(max_length=300, blank=True, default="Built with React & Django.")

    class Meta:
        verbose_name = "Site configuration"

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce a single row
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.site_name


class Skill(models.Model):
    CATEGORY_CHOICES = (
        ('languages', 'Languages'),
        ('web', 'Web & Frameworks'),
        ('mobile', 'Mobile'),
        ('automation', 'Automation & Testing'),
        ('embedded', 'Networks & Embedded'),
        ('tools', 'Tools & Other'),
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='tools')
    level = models.PositiveIntegerField(default=80, help_text="Proficiency 0-100")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    """Client reviews shown on the landing page (only when approved)."""
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=150, blank=True, help_text="e.g. 'Founder, TechShop'")
    content = models.TextField()
    rating = models.PositiveIntegerField(default=5, help_text="1-5 stars")
    approved = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.rating}★)"


class FAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'FAQ'

    def __str__(self):
        return self.question


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} — {self.name}"
