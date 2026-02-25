from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffTaskViewSet, StaffComplaintViewSet

router = DefaultRouter()
router.register(r'tasks', StaffTaskViewSet, basename='staff-tasks')
router.register(r'complaints', StaffComplaintViewSet, basename='staff-complaints')

urlpatterns = [
    path('', include(router.urls)),
]
