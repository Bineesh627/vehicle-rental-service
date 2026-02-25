// Mock Data for Vehicle Owner Dashboard
const mockData = {
    // Shop data
    shops: [
        {
            id: 1,
            name: "City Car Rentals",
            address: "123 Main Street, Downtown, NY 10001",
            phone: "+1 (555) 123-4567",
            email: "city@rental.com",
            status: "active"
        },
        {
            id: 2,
            name: "Airport Auto Hire",
            address: "456 Airport Road, Terminal 2, NY 10453",
            phone: "+1 (555) 234-5678",
            email: "airport@rental.com",
            status: "active"
        },
        {
            id: 3,
            name: "Suburban Van Rentals",
            address: "789 Suburban Plaza, Westside, NY 10023",
            phone: "+1 (555) 345-6789",
            email: "suburban@rental.com",
            status: "active"
        }
    ],

    // Staff data
    staff: [
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@rental.com",
            phone: "+1 (555) 111-2222",
            status: "active",
            joinDate: "2023-01-15"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.johnson@rental.com",
            phone: "+1 (555) 333-4444",
            status: "active",
            joinDate: "2023-03-20"
        },
        {
            id: 3,
            name: "Mike Wilson",
            email: "mike.wilson@rental.com",
            phone: "+1 (555) 555-6666",
            status: "active",
            joinDate: "2023-02-10"
        },
        {
            id: 4,
            name: "Emily Davis",
            email: "emily.davis@rental.com",
            phone: "+1 (555) 777-8888",
            status: "active",
            joinDate: "2023-04-05"
        },
        {
            id: 5,
            name: "Robert Brown",
            email: "robert.brown@rental.com",
            phone: "+1 (555) 999-0000",
            status: "inactive",
            joinDate: "2023-01-20"
        }
    ],

    // Vehicle/Shop data (Repurposed for RentalShop)
    vehicles: [
        {
            id: 1,
            name: "Downtown Exotics",
            address: "123 Main St, New York, NY",
            latitude: 40.7128,
            longitude: -74.0060,
            phone: "+1 (555) 123-4567",
            rating: 4.8,
            review_count: 124,
            operating_hours: "9:00 AM - 6:00 PM",
            is_open: true,
            status: "available",
            image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            name: "Airport Economy Rentals",
            address: "JFK Terminal 4, NY",
            latitude: 40.6413,
            longitude: -73.7781,
            phone: "+1 (555) 987-6543",
            rating: 4.2,
            review_count: 89,
            operating_hours: "24/7",
            is_open: true,
            status: "available",
            image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400"
        }
    ],

    // Booking data
    bookings: [
        {
            id: 1,
            vehicleId: 2,
            vehicleName: "Honda Civic",
            customerName: "Alice Cooper",
            customerEmail: "alice.cooper@email.com",
            customerPhone: "+1 (555) 123-0001",
            startDate: "2024-02-20",
            endDate: "2024-02-25",
            status: "pending",
            totalAmount: 200,
            assignedStaffId: null,
            createdAt: "2024-02-18"
        },
        {
            id: 2,
            vehicleId: 4,
            vehicleName: "Tesla Model 3",
            customerName: "Bob Martin",
            customerEmail: "bob.martin@email.com",
            customerPhone: "+1 (555) 123-0002",
            startDate: "2024-02-22",
            endDate: "2024-02-24",
            status: "active",
            totalAmount: 170,
            assignedStaffId: 2,
            createdAt: "2024-02-19"
        },
        {
            id: 3,
            vehicleId: 7,
            vehicleName: "BMW 3 Series",
            customerName: "Carol White",
            customerEmail: "carol.white@email.com",
            customerPhone: "+1 (555) 123-0003",
            startDate: "2024-02-15",
            endDate: "2024-02-18",
            status: "completed",
            totalAmount: 360,
            assignedStaffId: 1,
            createdAt: "2024-02-14"
        },
        {
            id: 4,
            vehicleId: 1,
            vehicleName: "Toyota Camry",
            customerName: "David Lee",
            customerEmail: "david.lee@email.com",
            customerPhone: "+1 (555) 123-0004",
            startDate: "2024-02-26",
            endDate: "2024-02-28",
            status: "pending",
            totalAmount: 90,
            assignedStaffId: null,
            createdAt: "2024-02-20"
        },
        {
            id: 5,
            vehicleId: 3,
            vehicleName: "Ford F-150",
            customerName: "Emma Thompson",
            customerEmail: "emma.thompson@email.com",
            customerPhone: "+1 (555) 123-0005",
            startDate: "2024-02-19",
            endDate: "2024-02-21",
            status: "active",
            totalAmount: 150,
            assignedStaffId: 4,
            createdAt: "2024-02-17"
        },
        {
            id: 6,
            vehicleId: 5,
            vehicleName: "Chevrolet Tahoe",
            customerName: "Frank Garcia",
            customerEmail: "frank.garcia@email.com",
            customerPhone: "+1 (555) 123-0006",
            startDate: "2024-02-10",
            endDate: "2024-02-12",
            status: "completed",
            totalAmount: 190,
            assignedStaffId: 2,
            createdAt: "2024-02-09"
        },
        {
            id: 7,
            vehicleId: 6,
            vehicleName: "Nissan Altima",
            customerName: "Grace Kim",
            customerEmail: "grace.kim@email.com",
            customerPhone: "+1 (555) 123-0007",
            startDate: "2024-03-01",
            endDate: "2024-03-05",
            status: "pending",
            totalAmount: 168,
            assignedStaffId: null,
            createdAt: "2024-02-20"
        },
        {
            id: 8,
            vehicleId: 8,
            vehicleName: "Jeep Wrangler",
            customerName: "Henry Zhang",
            customerEmail: "henry.zhang@email.com",
            customerPhone: "+1 (555) 123-0008",
            startDate: "2024-02-13",
            endDate: "2024-02-15",
            status: "completed",
            totalAmount: 130,
            assignedStaffId: 1,
            createdAt: "2024-02-12"
        },
        {
            id: 9,
            vehicleId: 2,
            vehicleName: "Honda Civic",
            customerName: "Isabella Rodriguez",
            customerEmail: "isabella.rodriguez@email.com",
            customerPhone: "+1 (555) 123-0009",
            startDate: "2024-03-10",
            endDate: "2024-03-15",
            status: "pending",
            totalAmount: 200,
            assignedStaffId: null,
            createdAt: "2024-02-20"
        },
        {
            id: 10,
            vehicleId: 4,
            vehicleName: "Tesla Model 3",
            customerName: "Jack Anderson",
            customerEmail: "jack.anderson@email.com",
            customerPhone: "+1 (555) 123-0010",
            startDate: "2024-02-05",
            endDate: "2024-02-07",
            status: "completed",
            totalAmount: 170,
            assignedStaffId: 3,
            createdAt: "2024-02-04"
        }
    ]
};

// Calculate statistics
const calculateStats = () => {
    const totalRevenue = mockData.bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0);
    
    const activeBookings = mockData.bookings.filter(b => b.status === 'active').length;
    const totalVehicles = mockData.vehicles.length;
    const totalStaff = mockData.staff.filter(s => s.status === 'active').length;
    
    return {
        totalRevenue,
        activeBookings,
        totalVehicles,
        totalStaff
    };
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockData, calculateStats };
}
