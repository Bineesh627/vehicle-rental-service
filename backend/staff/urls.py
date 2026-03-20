from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffTaskViewSet

router = DefaultRouter()
router.register(r'tasks', StaffTaskViewSet, basename='staff-tasks')


urlpatterns = [
    path('', include(router.urls)),
]
