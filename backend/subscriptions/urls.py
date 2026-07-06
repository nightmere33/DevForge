from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupportPlanViewSet, SubscriptionViewSet

router = DefaultRouter()
router.register('plans', SupportPlanViewSet, basename='support-plan')
router.register('', SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('', include(router.urls)),
]
