import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";

export type InputProps = React.ComponentProps<typeof ShadcnInput> & {
  label?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="mb-1 block text-sm font-medium">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <ShadcnInput ref={ref} required={required} {...props} />
      </div>
    );
  }
);

Input.displayName = "Input";
