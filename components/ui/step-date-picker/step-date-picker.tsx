"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StepDatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function StepDatePicker({ value, onChange }: StepDatePickerProps) {
  const [step, setStep] = React.useState<"year" | "month" | "day">("year")
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null)
  const [open, setOpen] = React.useState(false)

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setStep("month")
  }

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setStep("day")
  }

  const handleDaySelect = (day: number) => {
    if (selectedYear !== null && selectedMonth !== null) {
      const selectedDate = new Date(selectedYear, selectedMonth, day)
      onChange?.(selectedDate)
      setOpen(false)
      setStep("year")
    }
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const renderYearSelector = () => (
    <ScrollArea className="h-72 w-48">
      <div className="grid grid-cols-3 gap-1 p-2">
        {years.map((year) => (
          <Button
            key={year}
            onClick={() => handleYearSelect(year)}
            variant="ghost"
            className="text-sm text-white hover:bg-[#333]"
          >
            {year}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )

  const renderMonthSelector = () => (
    <div className="grid grid-cols-3 gap-1 p-2">
      {months.map((month, index) => (
        <Button
          key={month}
          onClick={() => handleMonthSelect(index)}
          variant="ghost"
          className="text-sm text-white hover:bg-[#333]"
        >
          {month.slice(0, 3)}
        </Button>
      ))}
    </div>
  )

  const renderDaySelector = () => {
    if (selectedYear === null || selectedMonth === null) return null
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    return (
      <div className="grid grid-cols-7 gap-1 p-2">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <Button
            key={day}
            onClick={() => handleDaySelect(day)}
            variant="ghost"
            className="text-sm text-white hover:bg-[#333]"
          >
            {day}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        <div className="p-2 flex justify-between items-center border-b border-[#333]">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-white"
            onClick={() => setStep(step === "day" ? "month" : "year")}
            disabled={step === "year"}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium text-white">
            {step === "year" && "Select Year"}
            {step === "month" && "Select Month"}
            {step === "day" && "Select Day"}
          </div>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>
        {step === "year" && renderYearSelector()}
        {step === "month" && renderMonthSelector()}
        {step === "day" && renderDaySelector()}
      </PopoverContent>
    </Popover>
  )
}

