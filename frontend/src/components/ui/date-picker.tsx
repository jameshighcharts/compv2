"use client"

import * as React from "react"
import { IconCalendar } from "@tabler/icons-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  className?: string
  placeholder?: string
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (date: DateRange | undefined) => void
}

const formatDate = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value)

const toStartOfDay = (value: Date): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate())

const shiftDays = (value: Date, delta: number): Date => {
  const next = new Date(value)
  next.setDate(next.getDate() + delta)
  return toStartOfDay(next)
}

const normalizeRange = (range: DateRange | undefined): DateRange | undefined => {
  if (!range?.from) {
    return undefined
  }

  const from = toStartOfDay(range.from)
  const to = toStartOfDay(range.to ?? range.from)

  if (to < from) {
    return { from: to, to: from }
  }

  return { from, to }
}

const formatRange = (range: DateRange | undefined): string | null => {
  if (!range?.from) {
    return null
  }

  if (!range.to) {
    return `${formatDate(range.from)} - End date`
  }

  return `${formatDate(range.from)} - ${formatDate(range.to)}`
}

const getPresetRange = (
  preset: "today" | "last7" | "last30" | "monthToDate",
): DateRange => {
  const today = toStartOfDay(new Date())

  if (preset === "today") {
    return { from: today, to: today }
  }

  if (preset === "last7") {
    return { from: shiftDays(today, -6), to: today }
  }

  if (preset === "last30") {
    return { from: shiftDays(today, -29), to: today }
  }

  return {
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  }
}

export function DatePicker({
  className,
  placeholder = "Pick date range",
  value,
  defaultValue,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    normalizeRange(defaultValue),
  )
  const [draftRange, setDraftRange] = React.useState<DateRange | undefined>(
    normalizeRange(defaultValue),
  )

  const selectedDate = value ?? internalDate

  const commitDate = (nextRange: DateRange | undefined) => {
    const normalized = normalizeRange(nextRange)

    if (value === undefined) {
      setInternalDate(normalized)
    }

    onChange?.(normalized)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftRange(selectedDate)
    }

    setOpen(nextOpen)
  }

  const applyRange = () => {
    commitDate(draftRange)
    setOpen(false)
  }

  const clearRange = () => {
    setDraftRange(undefined)
    commitDate(undefined)
    setOpen(false)
  }

  const cancelRange = () => {
    setDraftRange(selectedDate)
    setOpen(false)
  }

  const setPreset = (preset: "today" | "last7" | "last30" | "monthToDate") => {
    setDraftRange(getPresetRange(preset))
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "min-w-[260px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className,
          )}
        >
          <IconCalendar className="mr-2 size-4" />
          {formatRange(selectedDate) ?? placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="border-border border-b px-3 py-2">
          <p className="text-muted-foreground text-xs">Date Range</p>
          <p className="text-sm font-medium">
            {formatRange(draftRange) ?? "Select start and end date"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button type="button" variant="secondary" size="xs" onClick={() => setPreset("today")}>
              Today
            </Button>
            <Button type="button" variant="secondary" size="xs" onClick={() => setPreset("last7")}>
              Last 7 Days
            </Button>
            <Button type="button" variant="secondary" size="xs" onClick={() => setPreset("last30")}>
              Last 30 Days
            </Button>
            <Button type="button" variant="secondary" size="xs" onClick={() => setPreset("monthToDate")}>
              Month to Date
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-md border px-2 py-1.5">
              <p className="text-muted-foreground text-[11px]">Start</p>
              <p className="text-xs font-medium">{draftRange?.from ? formatDate(draftRange.from) : "Select"}</p>
            </div>
            <div className="bg-muted/30 rounded-md border px-2 py-1.5">
              <p className="text-muted-foreground text-[11px]">End</p>
              <p className="text-xs font-medium">{draftRange?.to ? formatDate(draftRange.to) : "Select"}</p>
            </div>
          </div>
        </div>

        <Calendar
          mode="range"
          selected={draftRange}
          onSelect={setDraftRange}
          numberOfMonths={2}
          defaultMonth={draftRange?.from}
          initialFocus
        />

        <div className="border-border flex items-center justify-between gap-2 border-t p-2">
          <Button type="button" variant="ghost" size="sm" onClick={clearRange}>
            Clear
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={cancelRange}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={applyRange}
              disabled={!draftRange?.from}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
