from rest_framework import serializers
from .models import SupportPlan, Subscription


class SupportPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportPlan
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.username', read_only=True)
    client_email = serializers.CharField(source='client.email', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='plan.price', max_digits=10, decimal_places=2, read_only=True)
    plan_currency = serializers.CharField(source='plan.currency', read_only=True)
    plan_period_months = serializers.IntegerField(source='plan.period_months', read_only=True)

    class Meta:
        model = Subscription
        fields = ('id', 'client', 'client_username', 'client_email', 'plan', 'plan_name',
                  'plan_price', 'plan_currency', 'plan_period_months', 'status', 'note',
                  'start_date', 'end_date', 'created_at', 'updated_at')
        read_only_fields = ('client', 'created_at', 'updated_at')
