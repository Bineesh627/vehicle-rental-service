import Constants from "expo-constants";
import { Vehicle, RentalShop } from "@/types";

const getBaseUrl = () => {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(":")[0];
    if (localhost) {
        return `http://${localhost}:8000/api`;
    }
    return "http://192.168.43.122:8000/api";
};

const API_BASE_URL = getBaseUrl();

export const api = {
    async getVehicles(): Promise<Vehicle[]> {
        const response = await fetch(`${API_BASE_URL}/vehicles/`);
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        return data.map(mapBackendVehicleToFrontend);
    },

    async getVehicle(id: string): Promise<Vehicle> {
        const response = await fetch(`${API_BASE_URL}/vehicles/${id}/`);
        if (!response.ok) throw new Error("Failed to fetch vehicle");
        const data = await response.json();
        return mapBackendVehicleToFrontend(data);
    },
    
    async getRentalShops(): Promise<RentalShop[]> {
        const response = await fetch(`${API_BASE_URL}/shops/`);
        if (!response.ok) throw new Error("Failed to fetch shops");
        const data = await response.json();
        return data.map(mapBackendShopToFrontend);
    },

    async getRentalShop(id: string): Promise<RentalShop> {
        const response = await fetch(`${API_BASE_URL}/shops/${id}/`);
        if (!response.ok) throw new Error("Failed to fetch shop");
        const data = await response.json();
        return mapBackendShopToFrontend(data);
    },

    async getShopVehicles(shopId: string): Promise<Vehicle[]> {
        const response = await fetch(`${API_BASE_URL}/vehicles/?shop=${shopId}`);
        if (!response.ok) throw new Error("Failed to fetch shop vehicles");
        const data = await response.json();
        return data.map(mapBackendVehicleToFrontend);
    }
};

const mapBackendVehicleToFrontend = (data: any): Vehicle => {
    return {
        id: data.id.toString(),
        shopId: data.shop.toString(), // or data.shop_id if DRF returns ID
        type: data.type,
        name: data.name,
        brand: data.brand,
        model: data.model,
        number: data.number,
        images: data.images || [],
        pricePerHour: parseFloat(data.price_per_hour),
        pricePerDay: parseFloat(data.price_per_day),
        fuelType: data.fuel_type,
        transmission: data.transmission,
        seating: data.seating,
        isAvailable: data.is_available,
        features: data.features || [],
        vehicleNumber: data.vehicle_number
    };
};

const mapBackendShopToFrontend = (data: any): RentalShop => {
    return {
        id: data.id.toString(),
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        image: data.image,
        rating: data.rating,
        reviewCount: data.review_count,
        operatingHours: data.operating_hours,
        isOpen: data.is_open,
        vehicleCount: data.vehicleCount || { cars: 0, bikes: 0 },
        // distance is usually calculated on frontend based on user location
    };
};
