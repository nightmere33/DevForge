from rest_framework import viewsets
from core.permissions import IsDeveloperOrReadOnly
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (IsDeveloperOrReadOnly,)
