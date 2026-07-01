import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", as: Component = "div", ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-7xl",
      xl: "max-w-screen-2xl",
      full: "max-w-full",
    };

    return (
      <Component
        ref={ref}
        className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  background?: "default" | "muted" | "accent" | "gradient";
  spacing?: "sm" | "md" | "lg" | "xl";
  as?: React.ElementType;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, size = "lg", background = "default", spacing = "lg", as: Component = "section", children, ...props }, ref) => {
    const backgroundClasses = {
      default: "bg-background",
      muted: "bg-muted/30",
      accent: "bg-accent",
      gradient: "bg-gradient-to-br from-accent/10 via-background to-accent/5",
    };

    const spacingClasses = {
      sm: "py-12",
      md: "py-16",
      lg: "py-24",
      xl: "py-32",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          backgroundClasses[background],
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        <Container size={size}>{children}</Container>
      </Component>
    );
  }
);

Section.displayName = "Section";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, badge, title, description, align = "center", ...props }, ref) => {
    const alignClasses = {
      left: "text-left",
      center: "text-center max-w-3xl mx-auto",
      right: "text-right ml-auto",
    };

    return (
      <div
        ref={ref}
        className={cn("mb-16", alignClasses[align], className)}
        {...props}
      >
        {badge && (
          <span className="inline-block text-sm font-semibold tracking-wider text-accent uppercase">
            {badge}
          </span>
        )}
        <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";

export { Container, Section, SectionHeader };