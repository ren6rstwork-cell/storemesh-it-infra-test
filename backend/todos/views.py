from django.db import connection
from django.http import JsonResponse
from rest_framework import viewsets

from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    """CRUD API for todo items, backed by PostgreSQL."""

    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


def health_check(request):
    """Simple health/readiness endpoint used to verify the DB connection.

    Nginx and container orchestrators can call this to confirm the
    Django service (and its link to PostgreSQL) is up.
    """
    db_status = "ok"
    try:
        connection.ensure_connection()
    except Exception as exc:  # pragma: no cover - defensive
        db_status = f"error: {exc}"

    return JsonResponse({"status": "ok", "database": db_status})
