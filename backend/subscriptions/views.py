from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from core.emails import notify, developer_email, site_url
from core.permissions import IsDeveloperOrReadOnly
from .models import SupportPlan, Subscription
from .serializers import SupportPlanSerializer, SubscriptionSerializer


def is_developer(user):
    return getattr(user, 'role', None) == 'developer' or user.is_staff


class SupportPlanViewSet(viewsets.ModelViewSet):
    serializer_class = SupportPlanSerializer
    permission_classes = (IsDeveloperOrReadOnly,)

    def get_queryset(self):
        qs = SupportPlan.objects.all()
        user = self.request.user
        if not (user.is_authenticated and is_developer(user)):
            qs = qs.filter(active=True)
        return qs


class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = Subscription.objects.select_related('client', 'plan')
        if is_developer(self.request.user):
            return qs
        return qs.filter(client=self.request.user)

    def perform_create(self, serializer):
        sub = serializer.save(client=self.request.user, status='requested')
        notify(
            f"New subscription request — {sub.plan.name}",
            f"{sub.client.username} requested the \"{sub.plan.name}\" support plan "
            f"({sub.plan.price} {sub.plan.currency} / {sub.plan.period_months} months).\n\n"
            f"Note: {sub.note or '-'}\n\nManage: {site_url('/admin/subscriptions')}",
            [developer_email()],
        )

    def perform_update(self, serializer):
        instance = self.get_object()
        if not is_developer(self.request.user):
            # Clients can only cancel their own subscription
            changed = set(serializer.validated_data.keys())
            if changed - {'status', 'note'} or serializer.validated_data.get('status') not in (None, 'cancelled'):
                raise PermissionDenied("You can only cancel your subscription.")
        old_status = instance.status
        sub = serializer.save()
        if is_developer(self.request.user) and sub.status == 'active' and old_status != 'active':
            notify(
                f"Your {sub.plan.name} subscription is active",
                f"Hi {sub.client.username},\n\nYour \"{sub.plan.name}\" support subscription is now active"
                + (f" until {sub.end_date}" if sub.end_date else "") +
                f".\n\nDetails: {site_url('/dashboard')}",
                [sub.client.email],
            )
