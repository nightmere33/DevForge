from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteConfigurationView, SkillViewSet, ContactMessageViewSet,
    TestimonialViewSet, FAQViewSet, AdminStatsView,
)

router = DefaultRouter()
router.register('skills', SkillViewSet, basename='skill')
router.register('contact', ContactMessageViewSet, basename='contact')
router.register('testimonials', TestimonialViewSet, basename='testimonial')
router.register('faqs', FAQViewSet, basename='faq')

urlpatterns = [
    path('config/', SiteConfigurationView.as_view(), name='site-config'),
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('', include(router.urls)),
]
