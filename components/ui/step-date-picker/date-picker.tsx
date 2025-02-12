"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-black border-[#333] hover:bg-[#111] transition-colors",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black border-[#333]">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="bg-black text-white"
          classNames={{
            day_selected: "bg-white text-black hover:bg-white hover:text-black",
            day_today: "bg-accent text-accent-foreground",
            day: "text-white hover:bg-[#333] focus:bg-[#333] focus:text-white",
            head_cell: "text-white",
            cell: "text-white",
            nav_button: "text-white hover:bg-[#333]",
            nav_button_previous: "text-white hover:bg-[#333]",
            nav_button_next: "text-white hover:bg-[#333]",
            caption: "text-white",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

