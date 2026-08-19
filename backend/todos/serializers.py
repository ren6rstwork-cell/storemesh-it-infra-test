from rest_framework import serializers

from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ["id", "title", "is_done", "created_at"]
        read_only_fields = ["id", "created_at"]
