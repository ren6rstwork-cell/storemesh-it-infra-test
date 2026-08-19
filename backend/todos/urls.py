from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TodoViewSet, health_check

router = DefaultRouter()
router.register(r"todos", TodoViewSet, basename="todo")

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("", include(router.urls)),
]
