import { Shield, Store, Users, Wrench } from "lucide-react-native";

export type UserRole = "admin" | "owner" | "staff" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
}

export const mockUsers = [
  {
    email: "admin@rental.com",
    password: "admin123",
    user: {
      id: "admin-1",
      name: "System Admin",
      email: "admin@rental.com",
      phone: "+1 555-0100",
      role: "admin" as UserRole,
    },
  },
  {
    email: "owner@rental.com",
    password: "owner123",
    user: {
      id: "owner-1",
      name: "John Owner",
      email: "owner@rental.com",
      phone: "+1 555-0200",
      role: "owner" as UserRole,
    },
  },
  {
    email: "staff@rental.com",
    password: "staff123",
    user: {
      id: "staff-1",
      name: "Mike Staff",
      email: "staff@rental.com",
      phone: "+1 555-0300",
      role: "staff" as UserRole,
    },
  },
  {
    email: "user@rental.com",
    password: "user123",
    user: {
      id: "user-1",
      name: "Sarah Customer",
      email: "user@rental.com",
      phone: "+1 555-0400",
      role: "user" as UserRole,
    },
  },
];

export const roleInfo: Record<
  UserRole,
  { icon: any; label: string; color: string; bgColor: string }
> = {
  user: {
    icon: Users,
    label: "Customer",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  owner: {
    icon: Store,
    label: "Shop Owner",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.1)",
  },
  staff: {
    icon: Wrench,
    label: "Staff",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
  },
  admin: {
    icon: Shield,
    label: "Admin",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
};
