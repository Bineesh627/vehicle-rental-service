export * from "./auth";

export interface RentalShop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  vehicleCount: { cars: number; bikes: number };
  distance?: number;
  operatingHours?: string;
  isOpen?: boolean;
}

export interface Vehicle {
  id: string;
  shopId: string;
  type: "car" | "bike";
  name: string;
  brand: string;
  model: string;
  number: string;
  images: string[];
  pricePerHour: number;
  pricePerDay: number;
  fuelType: string;
  transmission: string;
  seating?: number;
  isAvailable: boolean;
  features: string[];
  vehicleNumber?: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  shop: RentalShop;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "active" | "completed" | "cancelled" | "upcoming" | "pickup_requested";
  deliveryOption?: "pickup" | "delivery";
  deliveryAddress?: string;
  returnLocation?: string;
}
