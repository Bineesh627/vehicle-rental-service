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
  reviews?: number;
  vehicleCount: { cars: number; bikes: number };
}

export interface Vehicle {
  id: string;
  shopId: string;
  type: "car" | "bike";
  name: string;
  brand: string;
  model: string;
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
  status: "active" | "completed" | "cancelled" | "upcoming";
}
