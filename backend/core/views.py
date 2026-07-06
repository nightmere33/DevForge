from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from tickets.models import Ticket, TicketMessage
from subscriptions.models import Subscription
from .emails import notify, developer_email
from .models import SiteConfiguration, Skill, ContactMessage, Testimonial, FAQ
from .permissions import IsDeveloper, IsDeveloperOrReadOnly
from .serializers import (
    SiteConfigurationSerializer, SkillSerializer, ContactMessageSerializer,
    TestimonialSerializer, FAQSerializer,
)


class SiteConfigurationView(generics.RetrieveUpdateAPIView):
    """GET is public (the frontend loads all content from here); updates are developer-only."""
    serializer_class = SiteConfigurationSerializer
    permission_classes = (IsDeveloperOrReadOnly,)

    def get_object(self):
        return SiteConfiguration.get_solo()


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = (IsDeveloperOrReadOnly,)


class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    permission_classes = (IsDeveloperOrReadOnly,)

    def get_queryset(self):
        qs = Testimonial.objects.all()
        user = self.request.user
        if not (user.is_authenticated and (getattr(user, 'role', None) == 'developer' or user.is_staff)):
            qs = qs.filter(approved=True)
        return qs


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = (IsDeveloperOrReadOnly,)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """Anyone can send a message; only the developer can list / manage them."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsDeveloper()]

    def perform_create(self, serializer):
        msg = serializer.save()
        notify(
            f"New contact message — {msg.subject}",
            f"From: {msg.name} <{msg.email}>\n\n{msg.message}",
            [developer_email()],
        )


class AdminStatsView(APIView):
    """Aggregated business insights for the admin dashboard."""
    permission_classes = (IsDeveloper,)

    def get(self, request):
        User = get_user_model()
        now = timezone.now()
        year_ago = (now - timedelta(days=365)).replace(day=1)

        tickets = Ticket.objects.all()
        done = tickets.filter(status__in=('delivered', 'closed'))

        orders_by_month = list(
            tickets.filter(created_at__gte=year_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month').annotate(count=Count('id')).order_by('month')
        )
        revenue_by_month = list(
            done.filter(price_agreed__isnull=False, updated_at__gte=year_ago)
            .annotate(month=TruncMonth('updated_at'))
            .values('month').annotate(total=Sum('price_agreed')).order_by('month')
        )
        status_breakdown = list(tickets.values('status').annotate(count=Count('id')))
        top_services = list(
            tickets.filter(service__isnull=False)
            .values('service__title').annotate(count=Count('id'))
            .order_by('-count')[:6]
        )

        return Response({
            'kpis': {
                'total_orders': tickets.count(),
                'active_orders': tickets.filter(status__in=('new', 'contacted', 'in_progress', 'review')).count(),
                'completed_orders': done.count(),
                'total_revenue': done.aggregate(t=Sum('price_agreed'))['t'] or 0,
                'clients': User.objects.filter(role='client').count(),
                'unread_messages': TicketMessage.objects.filter(read=False)
                                   .exclude(sender__role='developer').count(),
                'unread_contact': ContactMessage.objects.filter(is_read=False).count(),
                'active_subscriptions': Subscription.objects.filter(status='active').count(),
                'pending_subscriptions': Subscription.objects.filter(status='requested').count(),
            },
            'orders_by_month': [
                {'month': o['month'].strftime('%Y-%m'), 'count': o['count']} for o in orders_by_month
            ],
            'revenue_by_month': [
                {'month': r['month'].strftime('%Y-%m'), 'total': float(r['total'])} for r in revenue_by_month
            ],
            'status_breakdown': status_breakdown,
            'top_services': top_services,
        })
