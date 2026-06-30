export const siteConfig = {
  name: "HomeInterior",
  tagline: "Luxury Interior Design, Crafted for You",
  description:
    "Premium interior design services for homes, apartments, and villas. Transform your space with expert designers and end-to-end project management.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/images/og-default.jpg",
  contact: {
    phone: "+91 98765 43210",
    email: "hello@homeinterior.local",
    address: "123 Design Avenue, Bandra West, Mumbai 400050, India",
  },
  social: {
    facebook: "https://facebook.com/homeinterior",
    instagram: "https://instagram.com/homeinterior",
    linkedin: "https://linkedin.com/company/homeinterior",
    pinterest: "https://pinterest.com/homeinterior",
  },
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210",
  stats: [
    { label: "Projects Completed", value: "2,500+" },
    { label: "Happy Customers", value: "1,800+" },
    { label: "Expert Designers", value: "50+" },
    { label: "Cities Served", value: "12+" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
