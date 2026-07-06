from rest_framework import viewsets
from core.permissions import IsDeveloperOrReadOnly
from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = (IsDeveloperOrReadOnly,)
