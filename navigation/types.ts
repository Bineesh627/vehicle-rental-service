import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: undefined;
  UserApp: undefined;
  AdminApp: undefined;
  OwnerApp: undefined;
  StaffApp: undefined;
  NotFound: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ShopSignup: undefined;
};

export type UserTabParamList = {
  Home: undefined;
  Explore: undefined;
  Bookings: undefined;
  Profile: undefined;
  Support: undefined;
};

export type UserStackParamList = {
  Tabs: NavigatorScreenParams<UserTabParamList>;
  Bookings: undefined;
  ShopDetails: { id: string };
  VehicleDetails: { id: string };
  Booking: { id: string };
  BookingDetails: { id: string };
  EditProfile: undefined;
  Notifications: undefined;
  Settings: undefined;
  PaymentMethods: undefined;
  SavedLocations: undefined;
  KYCVerification: undefined;
  PrivacySecurity: undefined;
};
