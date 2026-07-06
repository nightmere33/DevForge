"""Lightweight email notifications. Uses console backend in dev, SMTP when configured."""
from django.conf import settings
from django.core.mail import send_mail


def site_url(path: str = '') -> str:
    return f"{settings.SITE_URL.rstrip('/')}{path}"


def notify(subject: str, body: str, recipients):
    """Fire-and-forget notification; never break the request on email failure."""
    recipients = [r for r in recipients if r]
    if not recipients:
        return
    try:
        send_mail(
            subject=f"[{settings.SITE_NAME}] {subject}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=True,
        )
    except Exception:
        pass


def developer_email() -> str:
    """The site owner's notification address (configurable on the site)."""
    from core.models import SiteConfiguration
    try:
        return SiteConfiguration.get_solo().email or settings.DEFAULT_FROM_EMAIL
    except Exception:
        return settings.DEFAULT_FROM_EMAIL
