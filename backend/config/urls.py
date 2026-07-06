"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'DevForge API is running. This is only the backend — '
                   'the website itself is the React app (run `npm start` in /frontend, '
                   'then open http://localhost:3000).',
        'endpoints': {
            'django_admin': '/admin/',
            'site_config': '/api/core/config/',
            'skills': '/api/core/skills/',
            'contact': '/api/core/contact/',
            'services': '/api/services/',
            'projects': '/api/projects/',
            'tickets': '/api/tickets/',
            'auth': ['/api/users/register/', '/api/users/login/', '/api/users/token/refresh/', '/api/users/me/'],
        },
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/services/', include('services.urls')),
    path('api/tickets/', include('tickets.urls')),
    path('api/core/', include('core.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
]
# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)