"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectContextType {
  value?: string;
  onValueChange: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select compound components must be used within a Select");
  }
  return context;
}

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value, onValueChange, children, className }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div ref={selectRef} className={cn("relative", className)}>
        <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
          <SelectValue />
        </SelectTrigger>
        {isOpen && (
          <SelectContent onClose={() => setIsOpen(false)}>
            {children}
          </SelectContent>
        )}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ onClick, children, className }: SelectTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

export function SelectValue({ placeholder, children }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  const displayText = children || (context?.value ? context.value.replace(/_/g, " ") : placeholder || "Select...");
  return (
    <span className={cn(!children && !context?.value && "text-muted-foreground")}>
      {displayText}
    </span>
  );
}

interface SelectContentProps {
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ onClose, children, className }: SelectContentProps) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        "top-full mt-1 w-full",
        className
      )}
    >
      <div className="max-h-60 overflow-auto p-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<SelectItemProps>, { onClose });
          }
          return child;
        })}
      </div>
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function SelectItem({ value, children, onClose, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange } = useSelectContext();
  const isSelected = selectedValue === value;

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => {
        onValueChange(value);
        onClose?.();
      }}
    >
      <span className="truncate">{children}</span>
    </div>
  );
}

interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectLabel({ children, className }: SelectLabelProps) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  );
}

interface SelectSeparatorProps {
  className?: string;
}

export function SelectSeparator({ className }: SelectSeparatorProps) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />;
}