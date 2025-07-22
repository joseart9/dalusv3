import * as React from "react";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  name: string;
  label?: string;
  options: ComboboxOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-\s_]/g, "");
}

export const Combobox: React.FC<ComboboxProps> = ({
  name,
  label,
  options,
  value: controlledValue,
  onChange,
  required = false,
  placeholder = "Selecciona...",
  disabled = false,
  multiple = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | string[]
  >(multiple ? [] : "");
  const [search, setSearch] = React.useState("");
  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  // For multi-select, value is string[]; for single, string
  const selectedValues: string[] = multiple
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : value
    ? [value as string]
    : [];

  const handleSelect = (selectedLabel: string) => {
    const selectedOption = options.find(
      (option) => option.label === selectedLabel
    );
    const selectedValue = selectedOption ? selectedOption.value : "";
    if (multiple) {
      let newValues: string[];
      if (selectedValues.includes(selectedValue)) {
        newValues = selectedValues.filter((v) => v !== selectedValue);
      } else {
        newValues = [...selectedValues, selectedValue];
      }
      if (!controlledValue) setUncontrolledValue(newValues);
      if (onChange) onChange(newValues);
    } else {
      if (!controlledValue)
        setUncontrolledValue(selectedValue === value ? "" : selectedValue);
      if (onChange) onChange(selectedValue === value ? "" : selectedValue);
      setOpen(false);
    }
    if (!multiple) setOpen(false);
  };

  // Filter options by normalized label (case-insensitive, ignore dashes/spaces/diacritics)
  const normalizedSearch = normalize(search);
  const filteredOptions = options.filter((option) =>
    normalize(option.label).includes(normalizedSearch)
  );

  const selectedLabels = selectedValues
    .map((val) => options.find((option) => option.value === val)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedLabels || placeholder}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 min-w-[200px]">
          <Command>
            <CommandInput
              placeholder="Buscar..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.label)}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Hidden input(s) for form compatibility */}
      {multiple ? (
        selectedValues.map((val) => (
          <input
            key={val}
            type="hidden"
            name={name}
            value={val}
            required={required}
          />
        ))
      ) : (
        <input type="hidden" name={name} value={value} required={required} />
      )}
    </div>
  );
};
