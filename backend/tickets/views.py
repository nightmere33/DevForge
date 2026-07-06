from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from core.emails import notify, developer_email, site_url
from .models import Ticket, TicketMessage
from .serializers import (
    TicketSerializer, TicketDetailSerializer, TicketMessageSerializer, TicketUpdateSerializer,
)


def is_developer(user):
    return getattr(user, 'role', None) == 'developer' or user.is_staff


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = Ticket.objects.select_related('client', 'service').prefetch_related('messages', 'updates')
        if is_developer(self.request.user):
            return qs
        return qs.filter(client=self.request.user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TicketDetailSerializer
        return TicketSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Opening the order marks messages from the other party as read
        instance.messages.exclude(sender=request.user).filter(read=False).update(read=True)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        ticket = serializer.save(client=self.request.user)
        notify(
            f"New order #{ticket.id}: {ticket.subject}",
            f"{ticket.client.username} placed a new order.\n\n"
            f"Service: {ticket.service.title if ticket.service else '-'}\n"
            f"Budget: {ticket.budget or '-'}\nPhone: {ticket.phone or '-'}\n\n"
            f"{ticket.description}\n\nManage it: {site_url(f'/orders/{ticket.id}')}",
            [developer_email()],
        )
        notify(
            f"Order #{ticket.id} received — {ticket.subject}",
            f"Hi {ticket.client.username},\n\nYour request was received. "
            f"I will contact you shortly to discuss the details.\n\n"
            f"Track your order here: {site_url(f'/orders/{ticket.id}')}",
            [ticket.client.email],
        )

    def perform_update(self, serializer):
        instance = self.get_object()
        old_status, old_progress = instance.status, instance.progress
        if not is_developer(self.request.user):
            allowed = {'subject', 'description', 'service', 'budget', 'phone', 'whatsapp', 'deadline'}
            changed = set(serializer.validated_data.keys())
            new_status = serializer.validated_data.get('status')
            if new_status and new_status not in ('closed', 'cancelled'):
                raise PermissionDenied("You can only close or cancel your own order.")
            if new_status:
                allowed.add('status')
            if not changed.issubset(allowed):
                raise PermissionDenied("You are not allowed to change these fields.")
        ticket = serializer.save()
        # Tell the client when the developer moves their order forward
        if is_developer(self.request.user) and (ticket.status != old_status or ticket.progress != old_progress):
            notify(
                f"Order #{ticket.id} update — {ticket.get_status_display()} ({ticket.progress}%)",
                f"Hi {ticket.client.username},\n\nYour order \"{ticket.subject}\" is now "
                f"\"{ticket.get_status_display()}\" at {ticket.progress}% progress.\n\n"
                f"See details: {site_url(f'/orders/{ticket.id}')}",
                [ticket.client.email],
            )

    def perform_destroy(self, instance):
        if not is_developer(self.request.user) and instance.status != 'new':
            raise PermissionDenied("Only new orders can be deleted.")
        instance.delete()

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """Total unread messages for the navbar badge."""
        count = TicketMessage.objects.filter(
            ticket__in=self.get_queryset(), read=False
        ).exclude(sender=request.user).count()
        return Response({'unread': count})

    @action(detail=True, methods=['post'])
    def messages(self, request, pk=None):
        """Post a chat message (text and/or file) in the order conversation."""
        ticket = self.get_object()
        serializer = TicketMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(ticket=ticket, sender=request.user)
        ticket.save(update_fields=['updated_at'])
        if is_developer(request.user):
            recipient, name = ticket.client.email, ticket.client.username
        else:
            recipient, name = developer_email(), 'there'
        notify(
            f"New message on order #{ticket.id} — {ticket.subject}",
            f"Hi {name},\n\n{request.user.username} wrote:\n\n"
            f"{serializer.instance.body or '(attachment)'}\n\n"
            f"Reply here: {site_url(f'/orders/{ticket.id}')}",
            [recipient],
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def updates(self, request, pk=None):
        """Developer posts a progress update (milestone, screenshot, video)."""
        if not is_developer(request.user):
            raise PermissionDenied("Only the developer can post progress updates.")
        ticket = self.get_object()
        serializer = TicketUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        update = serializer.save(ticket=ticket)
        if update.progress:
            ticket.progress = update.progress
        ticket.save(update_fields=['progress', 'updated_at'])
        notify(
            f"Progress update on order #{ticket.id} — {update.title}",
            f"Hi {ticket.client.username},\n\nNew progress update on \"{ticket.subject}\" "
            f"({update.progress}%):\n\n{update.title}\n{update.body}\n\n"
            f"See it here: {site_url(f'/orders/{ticket.id}')}",
            [ticket.client.email],
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
