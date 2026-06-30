"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
              {siteConfig.name}
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-background p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-background p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-background p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#services" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#process" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Services</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-muted-foreground">Residential Design</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Commercial Spaces</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Modular Kitchens</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Wardrobe Design</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Space Planning</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-sm text-muted-foreground">
                  {siteConfig.contact.address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}