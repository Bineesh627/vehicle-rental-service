from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import RentalShop, Vehicle, Booking, Conversation, Message, UserSettings, PaymentMethod, SavedLocation, KYCDocument
from .serializers import (
    RentalShopSerializer, VehicleSerializer, BookingSerializer,
    UserSerializer, ConversationSerializer, MessageSerializer,
    UserProfileSerializer, UserStatsSerializer,
    UserSettingsSerializer, PaymentMethodSerializer, PaymentMethodCreateSerializer,
    SavedLocationSerializer, KYCDocumentSerializer, KYCDocumentCreateSerializer,
    UserProfileUpdateSerializer,
)

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


# ── Profile Views ───────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get the current user's profile information.
    """
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """
    Get the current user's booking statistics.
    """
    from django.db.models import Sum, Count, Q
    
    # Get all bookings for the user
    user_bookings = Booking.objects.filter(
        vehicle__shop__conversations__user=request.user
    ).distinct()
    
    # Calculate statistics
    total_bookings = user_bookings.count()
    total_spent = user_bookings.aggregate(
        total=Sum('total_price')
    )['total'] or 0
    
    active_bookings = user_bookings.filter(
        status__in=['active', 'upcoming']
    ).count()
    
    completed_bookings = user_bookings.filter(
        status='completed'
    ).count()
    
    # Count unique shops the user has interacted with (saved places)
    saved_places = Conversation.objects.filter(
        user=request.user
    ).count()
    
    stats_data = {
        'total_bookings': total_bookings,
        'total_spent': total_spent,
        'saved_places': saved_places,
        'active_bookings': active_bookings,
        'completed_bookings': completed_bookings,
    }
    
    serializer = UserStatsSerializer(stats_data)
    return Response(serializer.data)


# ── Profile Management Views ───────────────────────────────────────────────────

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_update(request):
    """
    GET: Get current user profile with extended info
    PUT: Update user profile information
    """
    if request.method == 'GET':
        try:
            user_settings = UserSettings.objects.get_or_create(user=request.user)
            profile_data = {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'phone': getattr(request.user, 'phone', ''),
                'settings': UserSettingsSerializer(user_settings).data,
            }
            return Response(profile_data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'PUT':
        try:
            serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_settings_view(request):
    """
    GET: Get user notification settings
    PUT: Update user notification settings
    """
    user_settings, created = UserSettings.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserSettingsSerializer(user_settings)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSettingsSerializer(user_settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def payment_methods_view(request, pk=None):
    """
    GET: List all payment methods for user
    POST: Create new payment method
    PUT: Update payment method
    DELETE: Delete payment method
    """
    if request.method == 'GET':
        payment_methods = PaymentMethod.objects.filter(user=request.user).order_by('-is_default', '-created_at')
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PaymentMethodCreateSerializer(data=request.data)
        if serializer.is_valid():
            # If setting as default, unset other defaults
            if serializer.validated_data.get('is_default', False):
                PaymentMethod.objects.filter(user=request.user, is_default=True).update(is_default=False)
            
            payment_method = serializer.save(user=request.user)
            response_serializer = PaymentMethodSerializer(payment_method)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT' and pk:
        try:
            payment_method = PaymentMethod.objects.get(pk=pk, user=request.user)
            serializer = PaymentMethodCreateSerializer(payment_method, data=request.data, partial=True)
            if serializer.is_valid():
                # If setting as default, unset other defaults
                if serializer.validated_data.get('is_default', False):
                    PaymentMethod.objects.filter(user=request.user, is_default=True).exclude(pk=pk).update(is_default=False)
                
                serializer.save()
                response_serializer = PaymentMethodSerializer(payment_method)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PaymentMethod.DoesNotExist:
            return Response({'error': 'Payment method not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE' and pk:
        try:
            payment_method = PaymentMethod.objects.get(pk=pk, user=request.user)
            payment_method.delete()
            return Response({'message': 'Payment method deleted successfully'})
        except PaymentMethod.DoesNotExist:
            return Response({'error': 'Payment method not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def saved_locations_view(request, pk=None):
    """
    GET: List all saved locations for user
    POST: Create new saved location
    PUT: Update saved location
    DELETE: Delete saved location
    """
    if request.method == 'GET':
        locations = SavedLocation.objects.filter(user=request.user).order_by('-created_at')
        serializer = SavedLocationSerializer(locations, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SavedLocationSerializer(data=request.data)
        if serializer.is_valid():
            location = serializer.save(user=request.user)
            response_serializer = SavedLocationSerializer(location)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT' and pk:
        try:
            location = SavedLocation.objects.get(pk=pk, user=request.user)
            serializer = SavedLocationSerializer(location, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_serializer = SavedLocationSerializer(location)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SavedLocation.DoesNotExist:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE' and pk:
        try:
            location = SavedLocation.objects.get(pk=pk, user=request.user)
            location.delete()
            return Response({'message': 'Location deleted successfully'})
        except SavedLocation.DoesNotExist:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def kyc_document_view(request):
    """
    GET: Get KYC document status
    POST: Submit KYC documents
    PUT: Update KYC documents (if not verified)
    """
    try:
        kyc_doc = KYCDocument.objects.get(user=request.user)
    except KYCDocument.DoesNotExist:
        # Create new KYC document if none exists
        kyc_doc = KYCDocument.objects.create(user=request.user)    
    if request.method == 'GET':
        serializer = KYCDocumentSerializer(kyc_doc)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if kyc_doc.status != 'not_submitted':
            return Response({'error': 'KYC already submitted'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = KYCDocumentCreateSerializer(kyc_doc, data=request.data, partial=True)
        if serializer.is_valid():
            kyc_doc = serializer.save(status='pending')
            response_serializer = KYCDocumentSerializer(kyc_doc)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        if kyc_doc.status in ['verified', 'rejected']:
            return Response({'error': 'Cannot modify verified/rejected KYC'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = KYCDocumentCreateSerializer(kyc_doc, data=request.data, partial=True)
        if serializer.is_valid():
            kyc_doc = serializer.save(status='pending')
            response_serializer = KYCDocumentSerializer(kyc_doc)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Chat Views ─────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def conversation_list(request):
    """
    GET  /api/chat/conversations/
        List all conversations for the logged-in user, newest first.

    POST /api/chat/conversations/
        Body: { "shop_id": <int> }
        Get or create the conversation between the user and the shop.
    """
    if request.method == 'GET':
        convs = Conversation.objects.filter(user=request.user).prefetch_related('messages')
        serializer = ConversationSerializer(convs, many=True)
        return Response(serializer.data)

    # POST – get_or_create conversation
    shop_id = request.data.get('shop_id')
    if not shop_id:
        return Response({'error': 'shop_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    shop = get_object_or_404(RentalShop, id=shop_id)
    conv, _ = Conversation.objects.get_or_create(user=request.user, shop=shop)
    serializer = ConversationSerializer(conv)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def message_list(request, conversation_id):
    """
    GET  /api/chat/conversations/<id>/messages/
        Return all messages in the conversation (oldest first).
        Also marks incoming messages as read.

    POST /api/chat/conversations/<id>/messages/
        Body: { "text": "...", "image_url": "..." (optional) }
        Send a new message as the logged-in user (role = 'user').
    """
    conv = get_object_or_404(Conversation, id=conversation_id, user=request.user)

    if request.method == 'GET':
        # Mark unread messages from the other side as read
        conv.messages.filter(
            sender_role__in=['staff', 'owner'], is_read=False
        ).update(is_read=True)

        messages = conv.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    # POST – send message
    text = request.data.get('text', '').strip()
    image_url = request.data.get('image_url', None)

    if not text and not image_url:
        return Response(
            {'error': 'A message must have text or an image_url.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Determine sender_role from the user's profile
    try:
        sender_role = request.user.profile.role
    except Exception:
        sender_role = 'user'

    message = Message.objects.create(
        conversation=conv,
        sender=request.user,
        sender_role=sender_role,
        text=text,
        image_url=image_url,
    )

    # Bump conversation updated_at so list re-sorts correctly
    from django.utils import timezone
    conv.updated_at = timezone.now()
    conv.save(update_fields=['updated_at'])

    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


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


# ── Profile Views ───────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get the current user's profile information.
    """
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """
    Get the current user's booking statistics.
    """
    from django.db.models import Sum, Count, Q
    
    # Get all bookings for the user
    user_bookings = Booking.objects.filter(
        vehicle__shop__conversations__user=request.user
    ).distinct()
    
    # Calculate statistics
    total_bookings = user_bookings.count()
    total_spent = user_bookings.aggregate(
        total=Sum('total_price')
    )['total'] or 0
    
    active_bookings = user_bookings.filter(
        status__in=['active', 'upcoming']
    ).count()
    
    completed_bookings = user_bookings.filter(
        status='completed'
    ).count()
    
    # Count unique shops the user has interacted with (saved places)
    saved_places = Conversation.objects.filter(
        user=request.user
    ).count()
    
    stats_data = {
        'total_bookings': total_bookings,
        'total_spent': total_spent,
        'saved_places': saved_places,
        'active_bookings': active_bookings,
        'completed_bookings': completed_bookings,
    }
    
    serializer = UserStatsSerializer(stats_data)
    return Response(serializer.data)


# ── Profile Management Views ───────────────────────────────────────────────────

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_update(request):
    """
    GET: Get current user profile with extended info
    PUT: Update user profile information
    """
    if request.method == 'GET':
        try:
            user_settings = UserSettings.objects.get_or_create(user=request.user)
            profile_data = {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'phone': getattr(request.user, 'phone', ''),
                'settings': UserSettingsSerializer(user_settings).data,
            }
            return Response(profile_data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'PUT':
        try:
            serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_settings_view(request):
    """
    GET: Get user notification settings
    PUT: Update user notification settings
    """
    user_settings, created = UserSettings.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserSettingsSerializer(user_settings)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSettingsSerializer(user_settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def payment_methods_view(request, pk=None):
    """
    GET: List all payment methods for user
    POST: Create new payment method
    PUT: Update payment method
    DELETE: Delete payment method
    """
    if request.method == 'GET':
        payment_methods = PaymentMethod.objects.filter(user=request.user).order_by('-is_default', '-created_at')
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PaymentMethodCreateSerializer(data=request.data)
        if serializer.is_valid():
            # If setting as default, unset other defaults
            if serializer.validated_data.get('is_default', False):
                PaymentMethod.objects.filter(user=request.user, is_default=True).update(is_default=False)
            
            payment_method = serializer.save(user=request.user)
            response_serializer = PaymentMethodSerializer(payment_method)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT' and pk:
        try:
            payment_method = PaymentMethod.objects.get(pk=pk, user=request.user)
            serializer = PaymentMethodCreateSerializer(payment_method, data=request.data, partial=True)
            if serializer.is_valid():
                # If setting as default, unset other defaults
                if serializer.validated_data.get('is_default', False):
                    PaymentMethod.objects.filter(user=request.user, is_default=True).exclude(pk=pk).update(is_default=False)
                
                serializer.save()
                response_serializer = PaymentMethodSerializer(payment_method)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PaymentMethod.DoesNotExist:
            return Response({'error': 'Payment method not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE' and pk:
        try:
            payment_method = PaymentMethod.objects.get(pk=pk, user=request.user)
            payment_method.delete()
            return Response({'message': 'Payment method deleted successfully'})
        except PaymentMethod.DoesNotExist:
            return Response({'error': 'Payment method not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def saved_locations_view(request, pk=None):
    """
    GET: List all saved locations for user
    POST: Create new saved location
    PUT: Update saved location
    DELETE: Delete saved location
    """
    if request.method == 'GET':
        locations = SavedLocation.objects.filter(user=request.user).order_by('-created_at')
        serializer = SavedLocationSerializer(locations, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SavedLocationSerializer(data=request.data)
        if serializer.is_valid():
            location = serializer.save(user=request.user)
            response_serializer = SavedLocationSerializer(location)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT' and pk:
        try:
            location = SavedLocation.objects.get(pk=pk, user=request.user)
            serializer = SavedLocationSerializer(location, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_serializer = SavedLocationSerializer(location)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SavedLocation.DoesNotExist:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE' and pk:
        try:
            location = SavedLocation.objects.get(pk=pk, user=request.user)
            location.delete()
            return Response({'message': 'Location deleted successfully'})
        except SavedLocation.DoesNotExist:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def kyc_document_view(request):
    """
    GET: Get KYC document status
    POST: Submit KYC documents
    PUT: Update KYC documents (if not verified)
    """
    kyc_doc, created = KYCDocument.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        serializer = KYCDocumentSerializer(kyc_doc)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if kyc_doc.status != 'not_submitted':
            return Response({'error': 'KYC already submitted'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = KYCDocumentCreateSerializer(kyc_doc, data=request.data, partial=True)
        if serializer.is_valid():
            kyc_doc = serializer.save(status='pending')
            response_serializer = KYCDocumentSerializer(kyc_doc)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        if kyc_doc.status in ['verified', 'rejected']:
            return Response({'error': 'Cannot modify verified/rejected KYC'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = KYCDocumentCreateSerializer(kyc_doc, data=request.data, partial=True)
        if serializer.is_valid():
            kyc_doc = serializer.save(status='pending')
            response_serializer = KYCDocumentSerializer(kyc_doc)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
