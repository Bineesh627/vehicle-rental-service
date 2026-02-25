from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import StaffTask, StaffComplaint
from .serializers import StaffTaskSerializer, StaffComplaintSerializer

class StaffTaskViewSet(viewsets.ModelViewSet):
    serializer_class = StaffTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return tasks assigned to the currently logged in staff member
        return StaffTask.objects.filter(staff=self.request.user).order_by('-created_at')
        
    def update(self, request, *args, **kwargs):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(StaffTask.STATUS_CHOICES).keys():
            task.status = new_status
            task.save()
            return Response(self.get_serializer(task).data)
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

class StaffComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = StaffComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StaffComplaint.objects.filter(staff=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(staff=self.request.user)

