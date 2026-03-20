import * as React from "react";
import { TextInput, View, Text } from "react-native";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentPropsWithoutRef<
  typeof TextInput
> {
  error?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <View className="w-full">
        <TextInput
          className={cn(
            "flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className,
          )}
          placeholderTextColor="#666"
          ref={ref}
          {...props}
        />
        {error && (
          <Text className="text-xs text-destructive mt-1">{error}</Text>
        )}
      </View>
    );
  },
);
Input.displayName = "Input";

export { Input };
