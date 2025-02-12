"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";



interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  countries: { name: string; code: string; flag: string }[];

}

export function CountrySelector({ value, onChange, countries = [] }: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);
  console.log('countries', countries);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-black border-[#333] hover:bg-[#111] transition-colors"
        >
          {value
            ? countries.find((country) => country.code === value)?.name || "Select country..."
            : "Select country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-black border-[#333]">
        <Command>
          <CommandInput placeholder="Search country..." className="bg-black text-white" />
          <CommandEmpty className="text-white">No country found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {countries.map((country) => (
              <CommandItem
                key={country.code}
                onSelect={() => {
                  onChange(country.code);
                  setOpen(false);
                }}
                className="text-white hover:bg-[#333]"
              >
                <Check className={cn("mr-2 h-4 w-4", value === country.code ? "opacity-100" : "opacity-0")} />
                <span className="mr-2">{country.flag}</span>
                {country.name} ({country.code})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
