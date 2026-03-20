import { Users, Wrench } from "lucide-react-native";

export type UserRole = "staff" | "user";

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
  staff: {
    icon: Wrench,
    label: "Staff",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
  },
};
