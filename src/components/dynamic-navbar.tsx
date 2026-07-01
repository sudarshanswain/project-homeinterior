"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { usePublicData } from "@/hooks/use-public-data";
import { SiteSettings } from "@/types/public-api";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function DynamicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { data: settings, loading } = usePublicData<SiteSettings>("/api/public/settings");

  // Scroll handler with 40px threshold
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${id}`);
          }
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          // Update URL without jumping
          window.history.pushState(null, "", href);
        }
        setIsMobileMenuOpen(false);
      }
    },
    []
  );

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="h-9 w-36 animate-pulse rounded bg-muted" />
            <div className="hidden lg:flex gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  const companyName = settings?.companyName || "HomeInterior";
  const phoneNumber = settings?.phone || "+91 98765 43210";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white shadow-md"
          : "bg-transparent backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "font-serif text-3xl font-bold tracking-tight transition-colors duration-300",
              isScrolled ? "text-[#0f172a]" : "text-white"
            )}
            style={{ lineHeight: 1.2 }}
          >
            {companyName}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "group relative text-sm font-medium transition-colors duration-200",
                    isScrolled
                      ? isActive
                        ? "text-[#f59e0b]"
                        : "text-[#0f172a]/80 hover:text-[#f59e0b]"
                      : isActive
                        ? "text-[#f59e0b]"
                        : "text-white/90 hover:text-[#f59e0b]"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                      isActive ? "w-full bg-[#f59e0b]" : "w-0 bg-[#f59e0b] group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Phone - visible on desktop */}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className={cn(
                "hidden items-center gap-2 text-sm font-medium transition-colors duration-200 md:flex",
                isScrolled
                  ? "text-[#0f172a]/80 hover:text-[#f59e0b]"
                  : "text-white/90 hover:text-white"
              )}
              aria-label={`Call us at ${phoneNumber}`}
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{phoneNumber}</span>
            </a>

            {/* Phone - mobile only icon */}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className={cn(
                "flex items-center justify-center rounded-lg p-2 transition-colors md:hidden",
                isScrolled
                  ? "text-[#0f172a]/80 hover:bg-gray-100"
                  : "text-white/90 hover:bg-white/10"
              )}
              aria-label={`Call us at ${phoneNumber}`}
            >
              <Phone className="h-5 w-5" />
            </a>

            <ThemeToggle
              className={cn(
                isScrolled ? "text-[#0f172a]" : "text-white"
              )}
            />

            {/* Primary CTA Button */}
            <Link
              href="/estimation"
              className="hidden rounded-full bg-[#f59e0b] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg lg:block"
            >
              Get Free Estimate
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "rounded-lg p-2 transition-colors lg:hidden",
                isScrolled
                  ? "text-[#0f172a]/80 hover:bg-gray-100"
                  : "text-white/90 hover:bg-white/10"
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
          isMobileMenuOpen ? "max-h-[32rem] border-t border-gray-200" : "max-h-0"
        )}
      >
        <nav className="flex flex-col bg-white px-4 py-6 shadow-lg">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "py-3 text-base font-medium transition-colors",
                  isActive
                    ? "text-[#f59e0b]"
                    : "text-[#0f172a]/80 hover:text-[#f59e0b]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 flex items-center gap-3 border-t border-gray-100 pt-4">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm font-medium text-[#0f172a]/80 hover:text-[#f59e0b]"
              aria-label={`Call us at ${phoneNumber}`}
            >
              <Phone className="h-4 w-4" />
              {phoneNumber}
            </a>
          </div>
          <Link
            href="/estimation"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 rounded-full bg-[#f59e0b] px-6 py-3 text-center text-sm font-medium text-white transition-all hover:scale-[1.03] hover:shadow-lg"
          >
            Get Free Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}