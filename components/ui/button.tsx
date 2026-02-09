import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react-native";

const buttonVariants = cva("flex-row items-center justify-center rounded-xl", {
  variants: {
    variant: {
      default: "bg-primary",
      destructive: "bg-destructive",
      outline: "border-2 border-primary bg-transparent",
      secondary: "bg-secondary",
      ghost: "bg-transparent",
      link: "bg-transparent",
      accent: "bg-accent",
      glass: "bg-white/10 border border-white/20",
    },
    size: {
      default: "h-12 px-6",
      sm: "h-10 px-4",
      lg: "h-14 px-8",
      icon: "h-12 w-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const buttonTextVariants = cva("text-sm font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-primary",
      secondary: "text-secondary-foreground",
      ghost: "text-primary",
      link: "text-primary underline",
      accent: "text-accent-foreground",
      glass: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ButtonProps
>(({ className, variant, size, children, isLoading, ...props }, ref) => {
  return (
    <TouchableOpacity
      className={cn(
        buttonVariants({ variant, size, className }),
        isLoading && "opacity-50",
      )}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />
      )}
      {typeof children === "string" ? (
        <Text className={cn(buttonTextVariants({ variant }))}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
