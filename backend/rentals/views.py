from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import RentalShop, Vehicle, Booking
from .serializers import RentalShopSerializer, VehicleSerializer, BookingSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data.copy()
    # Map 'username' (name from frontend) to 'first_name'
    # Map 'email' to 'username' (unique identifier)
    data['first_name'] = data.get('username')
    data['username'] = data.get('email')
    
    # Ensure role is passed correctly
    rule = data.get('role', 'user')
    # The serializer expects 'profile': {'role': ...} structure for nested writes, 
    # OR we can manually handle it. 
    # Since we modified UserSerializer.create to look for profile.role in validated_data 
    # derived from source='profile.role', we need to pass it in a way DRF understands 
    # or just pass it as a separate field if we adjusted the serializer.
    
    # Actually, with source='profile.role', DRF expects the input data to match the structure 
    # unless we define it as a write-only field or handle it in validate/create.
    # Let's simplify: pass 'role' in data, acts as a simple field, serializer handles it.
    
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({
        'token': token.key,
        'user': serializer.data
    })

class RentalShopViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows rental shops to be viewed or edited.
    PRO TIP: ModelViewSet handles GET, POST, PUT, PATCH, DELETE automatically.
    """
    queryset = RentalShop.objects.all()
    serializer_class = RentalShopSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned shops, 
        but currently returns all shops.
        """
        return RentalShop.objects.all()

class VehicleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows vehicles to be viewed or edited.
    Supports filtering by shop: /api/vehicles/?shop=<shop_id>
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

    def get_queryset(self):
        """
        Logic to filter vehicles if needed.
        Currently returns all vehicles for the details page.
        """
        queryset = Vehicle.objects.all()
        shop_id = self.request.query_params.get('shop')
        if shop_id:
            queryset = queryset.filter(shop__id=shop_id)
        return queryset

class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing bookings.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
