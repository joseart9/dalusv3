import * as React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";

export type SwitchProps = React.ComponentProps<typeof ShadcnSwitch> & {
  label?: string;
  id?: string;
};

export const Switch = React.forwardRef<
  React.ElementRef<typeof ShadcnSwitch>,
  SwitchProps
>(({ className, label, id, ...props }, ref) => {
  return (
    <div className="flex items-center gap-2">
      <ShadcnSwitch
        ref={ref}
        id={id}
        className={["cursor-pointer", className].filter(Boolean).join(" ")}
        {...props}
      />
      {label && id && <label htmlFor={id}>{label}</label>}
    </div>
  );
});

Switch.displayName = "Switch";
