from django.urls import path
from . import views

# URL configurations for the owner backend app
urlpatterns = [
    path('', views.index_view, name='owner_index'),
    path('index.html', views.index_view, name='owner_index_file'),
    path('login.html', views.login_view, name='owner_login'),
    path('register.html', views.register_view, name='owner_register'),
    path('dashboard.html', views.dashboard_view, name='owner_dashboard'),
    path('bookingManagement.html', views.booking_management_view, name='owner_bookings'),
    path('staffManagement.html', views.staff_management_view, name='owner_staff'),
    path('vehicleManagement.html', views.vehicle_management_view, name='owner_vehicles'),
    path('Profile.html', views.profile_view, name='owner_profile'),
    path('logout/', views.logout_view, name='owner_logout'),
    path('api/staff/', views.staff_api, name='owner_staff_api'),
]
