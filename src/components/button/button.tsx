import * as React from "react";
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ShadcnButton>
>(({ className, ...props }, ref) => {
  return (
    <ShadcnButton
      ref={ref}
      className={["cursor-pointer", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { buttonVariants };
