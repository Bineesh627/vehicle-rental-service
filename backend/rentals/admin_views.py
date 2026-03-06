import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.db.models import Sum
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
from django.utils import timezone
from .models import (
    UserProfile, RentalShop, Vehicle, Booking, KYCDocument
)

def is_admin(user):
    # Check if user role is "admin" or is_staff is True
    if user.is_authenticated:
        if user.is_staff:
            return True
        if hasattr(user, 'user_profile') and user.user_profile.role == 'admin':
            return True
    return False

# Admin access control decorator
admin_required = user_passes_test(is_admin, login_url='/login/')

@admin_required
def admin_dashboard(request):
    total_revenue = Booking.objects.filter(payment_status="completed").aggregate(Sum('total_price'))['total_price__sum'] or 0
    active_bookings = Booking.objects.filter(status__in=["active", "upcoming"]).count()
    vehicle_count = Vehicle.objects.count()
    staff_count = UserProfile.objects.filter(role="staff").count()
    pending_kyc = KYCDocument.objects.filter(status="pending").count()
    recent_bookings = Booking.objects.select_related("vehicle", "shop", "user").order_by("-start_date")[:10]

    context = {
        'total_revenue': total_revenue,
        'active_bookings': active_bookings,
        'total_vehicles': vehicle_count,
        'total_staff': staff_count,
        'pending_kyc': pending_kyc,
        'recent_bookings': recent_bookings,
    }
    return render(request, 'admin/dashboard.html', context)

@admin_required
def admin_rentalshops(request):
    shops = RentalShop.objects.all()

    # Filtering
    is_open = request.GET.get('is_open')
    if is_open is not None and is_open != '':
        is_open_bool = is_open.lower() in ('true', '1', 'yes')
        shops = shops.filter(is_open=is_open_bool)

    # Sorting
    sort_by = request.GET.get('sort_by')
    if sort_by in ['name', 'rating', 'review_count', '-name', '-rating', '-review_count']:
        shops = shops.order_by(sort_by)

    context = {
        'shops': shops,
    }
    return render(request, 'admin/rentalshop.html', context)

@admin_required
def admin_shop_detail(request, shop_id):
    shop = get_object_or_404(RentalShop, id=shop_id)
    vehicles = Vehicle.objects.filter(shop=shop)
    
    context = {
        'shop': shop,
        'vehicles': vehicles,
    }

    return render(request, 'admin/rentalshopdetails.html', context)

@admin_required
def admin_customers(request):
    customers = UserProfile.objects.filter(role="user").select_related("user")
    
    context = {
        'customers': customers,
    }
    return render(request, 'admin/customer.html', context)

@admin_required
def admin_staff(request):
    staff_list = UserProfile.objects.filter(role="staff").select_related("user")
    
    context = {
        'staff_members': staff_list,
    }
    return render(request, 'admin/rentalstaff.html', context)

@admin_required
def admin_vehicles(request):
    vehicles = Vehicle.objects.select_related("shop")

    # Filtering
    vehicle_type = request.GET.get('type')
    if vehicle_type:
        vehicles = vehicles.filter(type=vehicle_type)

    is_available = request.GET.get('is_available')
    if is_available is not None and is_available != '':
        is_available_bool = is_available.lower() in ('true', '1', 'yes')
        vehicles = vehicles.filter(is_available=is_available_bool)

    fuel_type = request.GET.get('fuel_type')
    if fuel_type:
        vehicles = vehicles.filter(fuel_type=fuel_type)

    transmission = request.GET.get('transmission')
    if transmission:
        vehicles = vehicles.filter(transmission=transmission)

    # Sorting
    sort_by = request.GET.get('sort_by')
    if sort_by in ['price_per_hour', 'price_per_day', '-price_per_hour', '-price_per_day']:
        vehicles = vehicles.order_by(sort_by)

    context = {
        'vehicles': vehicles,
    }
    return render(request, 'admin/vehicle.html', context)

@admin_required
def admin_vehicle_detail(request, vehicle_id):
    vehicle = get_object_or_404(Vehicle, id=vehicle_id)
    
    context = {
        'vehicle': vehicle,
    }
    return render(request, 'admin/vehicledetails.html', context)

@admin_required
def admin_bookings(request):
    bookings = Booking.objects.select_related("vehicle", "shop", "user")

    # Filtering
    status = request.GET.get('status')
    if status:
        bookings = bookings.filter(status=status)

    booking_type = request.GET.get('booking_type')
    if booking_type:
        bookings = bookings.filter(booking_type=booking_type)

    delivery_option = request.GET.get('delivery_option')
    if delivery_option:
        bookings = bookings.filter(delivery_option=delivery_option)

    # Sorting
    sort_by = request.GET.get('sort_by')
    if sort_by in ['start_date', 'total_price', '-start_date', '-total_price']:
        bookings = bookings.order_by(sort_by)
    else:
        bookings = bookings.order_by('-created_at') # Default sorting

    context = {
        'bookings': bookings,
    }
    return render(request, 'admin/booking.html', context)

@admin_required
def admin_payments(request):
    # Retrieve bookings that have a payment_status set (or are not null/empty if that's the requirement)
    # The requirement says payment_status__isnull=False, but in the model it's a CharField with default='pending'. 
    # Usually we filter out empty strings as well. Let's use what the prompt specifically requested.
    payments = Booking.objects.filter(payment_status__isnull=False)

    # Filtering
    payment_method = request.GET.get('payment_method')
    if payment_method:
        payments = payments.filter(payment_method=payment_method)

    payment_status = request.GET.get('payment_status')
    if payment_status:
        payments = payments.filter(payment_status=payment_status)

    context = {
        'payments': payments,
    }
    return render(request, 'admin/payment.html', context)

@admin_required
def admin_owners(request):
    owners = UserProfile.objects.filter(role="owner").select_related("user")
    
    context = {
        'owners': owners,
    }
    return render(request, 'admin/ownermanagement.html', context)

@admin_required
@require_POST
def approve_owner(request, owner_id):
    User.objects.filter(id=owner_id).update(is_active=True)
    return redirect('admin_owners_list')

@admin_required
@require_POST
def reject_owner(request, owner_id):
    User.objects.filter(id=owner_id).update(is_active=False)
    return redirect('admin_owners_list')

@admin_required
@require_POST
def delete_owner(request, owner_id):
    User.objects.filter(id=owner_id).delete()
    return redirect('admin_owners_list')

@admin_required
def admin_owner_detail(request, owner_id):
    from django.contrib import messages
    try:
        owner = UserProfile.objects.select_related('user').get(user__id=owner_id, role='owner')
    except UserProfile.DoesNotExist:
        messages.error(request, "Owner not found.")
        return redirect('admin_owner_management')

    # Get their first associated shop if it exists
    shop = owner.shops.first() if hasattr(owner, 'shops') else None
    
    context = {
        'owner': owner,
        'shop': shop,
    }
    return render(request, 'admin/ownerdetails.html', context)

@admin_required
def admin_kyc_list(request):
    from django.utils import timezone
    from django.contrib import messages

    if request.method == 'POST':
        action = request.POST.get('action')
        kyc_id = request.POST.get('kyc_id')

        try:
            kyc = KYCDocument.objects.get(id=kyc_id)

            if action == 'approve':
                kyc.status = 'verified'
                kyc.verified_at = timezone.now()
                kyc.rejection_reason = None
                kyc.reviewed_by = request.user
                kyc.save()
                messages.success(request, f"KYC for {kyc.full_name} has been approved.")

            elif action == 'reject':
                reason = request.POST.get('rejection_reason', '').strip()
                if not reason:
                    messages.error(request, "Please provide a rejection reason.")
                else:
                    kyc.status = 'rejected'
                    kyc.rejection_reason = reason
                    kyc.verified_at = None
                    kyc.reviewed_by = request.user
                    kyc.save()
                    messages.success(request, f"KYC for {kyc.full_name} has been rejected.")

        except KYCDocument.DoesNotExist:
            messages.error(request, "KYC record not found.")
        except Exception as e:
            messages.error(request, f"Error processing KYC action: {str(e)}")

        return redirect('admin_kyc_management')

    # GET – list KYC documents with optional status filter
    status_filter = request.GET.get('status', '')
    kyc_docs = KYCDocument.objects.select_related('user', 'reviewed_by').order_by('-submitted_at')

    if status_filter in ('pending', 'verified', 'rejected', 'not_submitted'):
        kyc_docs = kyc_docs.filter(status=status_filter)

    counts = {
        'total': KYCDocument.objects.count(),
        'pending': KYCDocument.objects.filter(status='pending').count(),
        'verified': KYCDocument.objects.filter(status='verified').count(),
        'rejected': KYCDocument.objects.filter(status='rejected').count(),
    }

    return render(request, 'admin/kycmanagement.html', {
        'kyc_docs': kyc_docs,
        'status_filter': status_filter,
        'counts': counts,
    })

@admin_required
def admin_kyc_detail(request, kyc_id):
    from django.utils import timezone
    from django.contrib import messages

    try:
        kyc = KYCDocument.objects.select_related('user', 'reviewed_by').get(id=kyc_id)
    except KYCDocument.DoesNotExist:
        messages.error(request, "KYC record not found.")
        return redirect('admin_kyc_management')

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'approve':
            kyc.status = 'verified'
            kyc.verified_at = timezone.now()
            kyc.rejection_reason = None
            kyc.reviewed_by = request.user
            kyc.save()
            messages.success(request, f"KYC for {kyc.full_name} has been approved successfully.")
            return redirect('admin_kyc_management')

        elif action == 'reject':
            reason = request.POST.get('rejection_reason', '').strip()
            if not reason:
                messages.error(request, "Please provide a rejection reason.")
            else:
                kyc.status = 'rejected'
                kyc.rejection_reason = reason
                kyc.verified_at = None
                kyc.reviewed_by = request.user
                kyc.save()
                messages.success(request, f"KYC for {kyc.full_name} has been rejected.")
                return redirect('admin_kyc_management')

    return render(request, 'admin/kycdetails.html', {'kyc': kyc})
