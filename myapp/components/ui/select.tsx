import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (option: SelectOption) => {
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{options.find(option => option.value === value)?.label || placeholder}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      {isOpen && (
        <ul
          className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-background border border-input rounded-md shadow-lg max-h-60 focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={cn(
                "cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-accent",
                option.value === value ? "bg-accent" : ""
              )}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
            >
              <span className={cn("block truncate", option.value === value ? "font-semibold" : "font-normal")}>
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}