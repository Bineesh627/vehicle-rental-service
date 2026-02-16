export interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
  image?: string;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export const chatData: Chat[] = [
  {
    id: "1",
    name: "SpeedWheels Rentals",
    lastMessage: "Hey, is the car still available?",
    time: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: "m1",
        text: "Hi there!",
        sender: "them",
        timestamp: "10:00 AM",
      },
      {
        id: "m2",
        text: "I saw your listing for the Toyota Camry.",
        sender: "them",
        timestamp: "10:01 AM",
      },
      {
        id: "m3",
        text: "Yes, it is available.",
        sender: "me",
        timestamp: "10:05 AM",
      },
      {
        id: "m4",
        text: "Great! Can I rent it for tomorrow?",
        sender: "them",
        timestamp: "10:30 AM",
      },
    ],
  },
  {
    id: "2",
    name: "Urban Rides Co.",
    lastMessage: "Thanks for the quick response!",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: "m1",
        text: "Do you have any bikes available?",
        sender: "them",
        timestamp: "Yesterday",
      },
      {
        id: "m2",
        text: "Yes, we have a few mountain bikes.",
        sender: "me",
        timestamp: "Yesterday",
      },
      {
        id: "m3",
        text: "Perfect, I'll stop by later.",
        sender: "them",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "3",
    name: "Premium Motors",
    lastMessage: "What are your opening hours?",
    time: "Mon",
    unreadCount: 5,
    isOnline: true,
    messages: [
      {
        id: "m1",
        text: "Hello",
        sender: "them",
        timestamp: "Mon",
      },
      {
        id: "m2",
        text: "What are your opening hours?",
        sender: "them",
        timestamp: "Mon",
      },
    ],
  },
];
