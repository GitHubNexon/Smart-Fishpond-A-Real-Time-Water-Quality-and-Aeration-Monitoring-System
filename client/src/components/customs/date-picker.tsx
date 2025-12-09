'use client';

import * as React from 'react';
import { parseDate } from 'chrono-node';
import { CalendarIcon } from 'lucide-react';
import { DropdownNavProps, DropdownProps } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@syntaxsentinel/date-utils';

interface DatePickerProps {
  label?: string;
  name?: string;
  value?: string | Date;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Tomorrow or next week',
  className,
  required = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const initialDate =
    typeof value === 'string' ? parseDate(value) || undefined : value;

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [inputValue, setInputValue] = React.useState<string>(
    date ? formatDate.isoDate(date) : '',
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    if (value) {
      const parsed =
        typeof value === 'string' ? parseDate(value) || new Date(value) : value;
      setDate(parsed);
      setInputValue(formatDate.isoDate(parsed));
      setMonth(parsed);
    } else {
      setDate(undefined);
      setInputValue('');
      setMonth(undefined);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    if (text) {
      const parsed = new Date(text);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
        setMonth(parsed);
        onChange?.(formatDate.isoDate(parsed));
      }
    }
  };

  const handleSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (selected) {
      const formatted = formatDate.isoDate(selected);
      setInputValue(formatted);
      setMonth(selected);
      onChange?.(formatted);
    }
  };

  const id = React.useId();

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {label && (
        <Label htmlFor={name} className="px-1">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? formatDate.shortDate(date) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            classNames={{
              month_caption: 'mx-0',
            }}
            captionLayout="dropdown"
            defaultMonth={date || new Date()}
            startMonth={new Date(1900, 0)}
            endMonth={new Date(2100, 11)}
            month={month}
            onMonthChange={setMonth}
            hideNavigation
            components={{
              DropdownNav: (props: DropdownNavProps) => (
                <div className="flex w-full items-center gap-2">
                  {props.children}
                </div>
              ),
              Dropdown: (props: DropdownProps) => (
                <Select
                  value={String(props.value)}
                  onValueChange={(value) => {
                    if (props.onChange) {
                      // Call original onChange for react-day-picker
                      handleCalendarChange(value, props.onChange);

                      // Update month and date
                      const newMonth = new Date(month || new Date());
                      // Detect year vs month dropdown
                      const isYearDropdown =
                        props.options && Number(props.options[0]?.value) > 12;

                      if (isYearDropdown) {
                        newMonth.setFullYear(Number(value));
                      } else {
                        newMonth.setMonth(Number(value));
                      }

                      setMonth(newMonth);
                      setDate(newMonth);
                      onChange?.(formatDate.isoDate(newMonth));
                    }
                  }}
                >
                  <SelectTrigger className="h-8 w-fit font-medium first:grow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                    {props.options?.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

function handleCalendarChange(
  value: string | number,
  callback: (e: React.ChangeEvent<HTMLSelectElement>) => void,
) {
  const _event = {
    target: {
      value: String(value),
    },
  } as React.ChangeEvent<HTMLSelectElement>;
  callback(_event);
}
