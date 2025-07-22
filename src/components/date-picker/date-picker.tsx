"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  label,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  // Convert value (string) to Date, parsing as local date to avoid timezone issues
  const parseLocalDate = (dateString: string): Date | undefined => {
    if (typeof dateString !== "string") return undefined;
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return undefined;
    // month is 0-indexed in JS Date
    return new Date(year, month - 1, day);
  };
  const date = typeof value === "string" ? parseLocalDate(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (onChange) {
      onChange(date ? date.toISOString().slice(0, 10) : "");
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
            disabled={disabled}
          >
            {date ? date.toLocaleDateString() : "Selecciona fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
