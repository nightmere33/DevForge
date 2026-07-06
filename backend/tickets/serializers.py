from rest_framework import serializers
from .models import Ticket, TicketMessage, TicketUpdate


class TicketMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = TicketMessage
        fields = ('id', 'ticket', 'sender', 'sender_username', 'sender_role',
                  'body', 'attachment', 'read', 'created_at')
        read_only_fields = ('ticket', 'sender', 'read', 'created_at')

    def validate(self, attrs):
        if not attrs.get('body', '').strip() and not attrs.get('attachment'):
            raise serializers.ValidationError('A message needs text or an attachment.')
        return attrs


class TicketUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketUpdate
        fields = ('id', 'ticket', 'title', 'body', 'progress', 'attachment', 'created_at')
        read_only_fields = ('ticket', 'created_at')


class TicketSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.username', read_only=True)
    client_email = serializers.CharField(source='client.email', read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True, default=None)
    message_count = serializers.IntegerField(source='messages.count', read_only=True)
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ('id', 'client', 'client_username', 'client_email', 'subject', 'description',
                  'service', 'service_title', 'budget', 'phone', 'whatsapp', 'deadline',
                  'status', 'priority', 'progress', 'price_agreed',
                  'message_count', 'unread_count', 'created_at', 'updated_at')
        read_only_fields = ('client', 'created_at', 'updated_at')

    def get_unread_count(self, obj) -> int:
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return 0
        return sum(1 for m in obj.messages.all() if not m.read and m.sender_id != user.id)


class TicketDetailSerializer(TicketSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    updates = TicketUpdateSerializer(many=True, read_only=True)

    class Meta(TicketSerializer.Meta):
        fields = TicketSerializer.Meta.fields + ('messages', 'updates')
