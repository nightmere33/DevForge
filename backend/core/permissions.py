from rest_framework import permissions


class IsDeveloper(permissions.BasePermission):
    """Only the site owner (role=developer) or staff can access."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (getattr(request.user, 'role', None) == 'developer' or request.user.is_staff)
        )


class IsDeveloperOrReadOnly(permissions.BasePermission):
    """Anyone can read, only the developer can write."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return IsDeveloper().has_permission(request, view)
