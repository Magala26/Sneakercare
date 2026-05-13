"use client"

import * as React from "react"
import { Clock2Icon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

interface CalendarWithTimeProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedStartTime: string;
  onStartTimeChange: (time: string) => void;
  selectedEndTime: string;
  onEndTimeChange: (time: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function CalendarWithTime({
  selectedDate,
  onDateChange,
  selectedStartTime,
  onStartTimeChange,
  selectedEndTime,
  onEndTimeChange,
  minDate,
  maxDate,
}: CalendarWithTimeProps) {
  return (
    <Card size="sm" className="mx-auto w-full">
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          className="p-0"
        />
      </CardContent>
      <CardFooter className="border-t bg-card flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                value={selectedStartTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-to"
                type="time"
                step="1"
                value={selectedEndTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}
