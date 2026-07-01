import { PrismaClient, Role, ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@homeinterior.local" },
    update: {},
    create: {
      email: "admin@homeinterior.local",
      passwordHash,
      role: Role.ADMIN,
      firstName: "System",
      lastName: "Admin",
      emailVerifiedAt: new Date(),
      isActive: true,
    },
  });

  const salesPassword = await bcrypt.hash("Sales@123456", 12);
  await prisma.user.upsert({
    where: { email: "sales@homeinterior.local" },
    update: {},
    create: {
      email: "sales@homeinterior.local",
      passwordHash: salesPassword,
      role: Role.SALES,
      firstName: "Priya",
      lastName: "Sharma",
      emailVerifiedAt: new Date(),
      isActive: true,
    },
  });

  const designerPassword = await bcrypt.hash("Designer@123456", 12);
  const designer = await prisma.user.upsert({
    where: { email: "designer@homeinterior.local" },
    update: {},
    create: {
      email: "designer@homeinterior.local",
      passwordHash: designerPassword,
      role: Role.DESIGNER,
      firstName: "Arjun",
      lastName: "Mehta",
      emailVerifiedAt: new Date(),
      isActive: true,
      designerProfile: {
        create: {
          bio: "Award-winning interior designer with 10+ years of experience in luxury residential spaces.",
          specialty: "Modern Luxury",
          experience: 10,
          isFeatured: true,
          sortOrder: 1,
        },
      },
    },
  });

  const customerPassword = await bcrypt.hash("Customer@123456", 12);
  await prisma.user.upsert({
    where: { email: "customer@homeinterior.local" },
    update: {},
    create: {
      email: "customer@homeinterior.local",
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      firstName: "Rahul",
      lastName: "Verma",
      phone: "+919876543210",
      emailVerifiedAt: new Date(),
      isActive: true,
    },
  });

  // ─── Site Settings ──────────────────────────────────────────────────────────

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: "HomeInterior",
      tagline: "Luxury Interior Design, Crafted for You",
      description:
        "Premium interior design services for homes, apartments, and villas. Transform your space with expert designers and end-to-end project management.",
      logo: null,
      favicon: null,
      phone: "+91 98765 43210",
      email: "hello@homeinterior.local",
      whatsapp: "919876543210",
      addressLine1: "123 Design Avenue",
      addressLine2: null,
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      postalCode: "400050",
      facebook: "https://facebook.com/homeinterior",
      instagram: "https://instagram.com/homeinterior",
      linkedin: "https://linkedin.com/company/homeinterior",
      youtube: null,
      twitter: null,
      pinterest: "https://pinterest.com/homeinterior",
      primaryColor: "#0f172a",
      secondaryColor: "#1e293b",
      accentColor: "#f59e0b",
      metaTitle: "HomeInterior | Luxury Interior Design Services",
      metaDescription:
        "Premium interior design services for homes, apartments, and villas. Transform your space with expert designers.",
      metaKeywords: "interior design, home decor, luxury interiors, Mumbai",
      googleAnalyticsId: null,
      googleTagManagerId: null,
      facebookPixelId: null,
      copyrightText: "© 2025 HomeInterior. All rights reserved.",
      defaultLanguage: "en",
      timezone: "Asia/Kolkata",
      currency: "INR",
      maintenanceMode: false,
    },
  });

  // ─── Hero Section ───────────────────────────────────────────────────────────

  await prisma.heroSection.upsert({
    where: { id: "hero-1" },
    update: {},
    create: {
      id: "hero-1",
      title: "Transform Your Space Into a Masterpiece",
      subtitle:
        "We create stunning, functional interiors that reflect your personality and elevate your lifestyle. From concept to completion, we bring your dream space to life.",
      badge: "Premium Interior Design",
      primaryCtaText: "Get Free Consultation",
      primaryCtaLink: "#contact",
      secondaryCtaText: "View Our Portfolio",
      secondaryCtaLink: "#portfolio",
      backgroundImage:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80",
      overlayOpacity: 60,
      isActive: true,
    },
  });

  // ─── Stats ──────────────────────────────────────────────────────────────────

  const stats = [
    { label: "Projects Completed", value: "2,500+", sortOrder: 1 },
    { label: "Happy Customers", value: "1,800+", sortOrder: 2 },
    { label: "Expert Designers", value: "50+", sortOrder: 3 },
    { label: "Cities Served", value: "12+", sortOrder: 4 },
  ];

  for (const stat of stats) {
    await prisma.stat.upsert({
      where: { id: `stat-${stat.sortOrder}` },
      update: {},
      create: { ...stat, id: `stat-${stat.sortOrder}`, isActive: true },
    });
  }

  // ─── Services ───────────────────────────────────────────────────────────────

  const services = [
    {
      title: "Residential Design",
      slug: "residential-design",
      description:
        "Complete home interior design tailored to your lifestyle, from modern apartments to luxury villas.",
      shortDescription: "Custom home interiors for modern living",
      icon: "sofa",
      features: ["Space planning", "Furniture selection", "Color consultation", "Lighting design"],
      sortOrder: 1,
      isFeatured: true,
    },
    {
      title: "Commercial Spaces",
      slug: "commercial-spaces",
      description:
        "Professional office and commercial interior design that enhances productivity and brand image.",
      shortDescription: "Productivity-focused commercial interiors",
      icon: "building-2",
      features: ["Office design", "Retail spaces", "Restaurant interiors", "Workstation planning"],
      sortOrder: 2,
      isFeatured: true,
    },
    {
      title: "Modular Kitchens",
      slug: "modular-kitchens",
      description:
        "Smart, space-efficient modular kitchen designs with premium finishes and innovative storage solutions.",
      shortDescription: "Smart & efficient kitchen solutions",
      icon: "chef-hat",
      features: ["Custom cabinetry", "Premium countertops", "Smart storage", "Appliance integration"],
      sortOrder: 3,
      isFeatured: true,
    },
    {
      title: "Wardrobe Design",
      slug: "wardrobe-design",
      description:
        "Custom walk-in wardrobes and built-in wardrobes designed for maximum organization and elegance.",
      shortDescription: "Elegant storage solutions",
      icon: "shirt",
      features: ["Walk-in wardrobes", "Built-in solutions", "Custom organizers", "Premium finishes"],
      sortOrder: 4,
      isFeatured: false,
    },
    {
      title: "Space Planning",
      slug: "space-planning",
      description:
        "Optimize your space with expert planning that maximizes functionality without compromising aesthetics.",
      shortDescription: "Maximize your space potential",
      icon: "ruler",
      features: ["Layout optimization", "Flow analysis", "Space utilization", "3D floor plans"],
      sortOrder: 5,
      isFeatured: false,
    },
    {
      title: "Lighting Design",
      slug: "lighting-design",
      description:
        "Ambient, task, and accent lighting solutions that create the perfect mood for every room.",
      shortDescription: "Perfect ambiance through lighting",
      icon: "lamp",
      features: ["Ambient lighting", "Task lighting", "Smart controls", "Energy efficient"],
      sortOrder: 6,
      isFeatured: false,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: { ...service, isActive: true },
    });
  }

  // ─── Process Steps ──────────────────────────────────────────────────────────

  const processSteps = [
    {
      title: "Consultation",
      description:
        "We begin with an in-depth discussion to understand your vision, requirements, and budget for the perfect interior design.",
      icon: "message-square",
      stepNumber: "01",
      sortOrder: 1,
    },
    {
      title: "Design & Planning",
      description:
        "Our expert designers create detailed 3D visualizations and floor plans tailored to your space and preferences.",
      icon: "palette",
      stepNumber: "02",
      sortOrder: 2,
    },
    {
      title: "Execution",
      description:
        "We manage the entire execution process with premium materials, skilled craftsmen, and strict quality control.",
      icon: "hammer",
      stepNumber: "03",
      sortOrder: 3,
    },
    {
      title: "Handover",
      description:
        "Final inspection, styling, and handover of your dream space with complete documentation and warranty.",
      icon: "check-circle",
      stepNumber: "04",
      sortOrder: 4,
    },
  ];

  for (const step of processSteps) {
    await prisma.processStep.upsert({
      where: { id: `step-${step.stepNumber}` },
      update: {},
      create: { ...step, id: `step-${step.stepNumber}`, isActive: true },
    });
  }

  // ─── Features (Why Choose Us) ───────────────────────────────────────────────

  const features = [
    {
      title: "Award-Winning Designs",
      description:
        "Recognized nationally for excellence in interior design with 15+ industry awards and counting.",
      icon: "award",
      sortOrder: 1,
      isFeatured: true,
    },
    {
      title: "On-Time Delivery",
      description:
        "We respect your time. Our projects are delivered on schedule with 98% on-time completion rate.",
      icon: "clock",
      sortOrder: 2,
      isFeatured: true,
    },
    {
      title: "5-Year Warranty",
      description:
        "Complete peace of mind with comprehensive warranty on all materials and workmanship.",
      icon: "shield",
      sortOrder: 3,
      isFeatured: true,
    },
    {
      title: "Premium Materials",
      description:
        "We source only the finest materials from trusted suppliers to ensure lasting quality and elegance.",
      icon: "sparkles",
      sortOrder: 4,
      isFeatured: false,
    },
    {
      title: "Expert Team",
      description:
        "50+ certified designers and architects with years of experience in luxury interior projects.",
      icon: "users",
      sortOrder: 5,
      isFeatured: false,
    },
    {
      title: "Transparent Pricing",
      description:
        "No hidden costs. Get detailed quotes upfront with flexible payment plans to suit your budget.",
      icon: "dollar-sign",
      sortOrder: 6,
      isFeatured: false,
    },
  ];

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { id: `feature-${feature.sortOrder}` },
      update: {},
      create: { ...feature, id: `feature-${feature.sortOrder}`, isActive: true },
    });
  }

  // ─── Categories ─────────────────────────────────────────────────────────────

  const categories = [
    { name: "Kitchen", slug: "kitchen", icon: "chef-hat", sortOrder: 1 },
    { name: "Bedroom", slug: "bedroom", icon: "bed", sortOrder: 2 },
    { name: "Living Room", slug: "living-room", icon: "sofa", sortOrder: 3 },
    { name: "Dining", slug: "dining", icon: "utensils", sortOrder: 4 },
    { name: "Wardrobe", slug: "wardrobe", icon: "shirt", sortOrder: 5 },
    { name: "Bathroom", slug: "bathroom", icon: "bath", sortOrder: 6 },
    { name: "Pooja Room", slug: "pooja-room", icon: "flame", sortOrder: 7 },
    { name: "Office", slug: "office", icon: "briefcase", sortOrder: 8 },
    { name: "Villa", slug: "villa", icon: "home", sortOrder: 9 },
    { name: "Apartment", slug: "apartment", icon: "building", sortOrder: 10 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const kitchen = await prisma.category.findUniqueOrThrow({
    where: { slug: "kitchen" },
  });

  const livingRoom = await prisma.category.findUniqueOrThrow({
    where: { slug: "living-room" },
  });

  const bedroom = await prisma.category.findUniqueOrThrow({
    where: { slug: "bedroom" },
  });

  // ─── Portfolio Projects ─────────────────────────────────────────────────────

  await prisma.portfolioProject.upsert({
    where: { slug: "modern-minimalist-kitchen" },
    update: {},
    create: {
      title: "Modern Minimalist Kitchen",
      slug: "modern-minimalist-kitchen",
      description:
        "A sleek, functional kitchen design featuring handleless cabinets, quartz countertops, and integrated appliances.",
      categoryId: kitchen.id,
      location: "Mumbai",
      area: "180 sq ft",
      budget: "₹4.5 Lakhs",
      duration: "6 weeks",
      isFeatured: true,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
            alt: "Modern minimalist kitchen overview",
            sortOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
            alt: "Kitchen island with pendant lighting",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.portfolioProject.upsert({
    where: { slug: "luxury-master-bedroom" },
    update: {},
    create: {
      title: "Luxury Master Bedroom",
      slug: "luxury-master-bedroom",
      description:
        "An elegant master bedroom with custom wardrobes, ambient lighting, and a sophisticated color palette.",
      categoryId: bedroom.id,
      location: "Delhi",
      area: "250 sq ft",
      budget: "₹6 Lakhs",
      duration: "8 weeks",
      isFeatured: true,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
            alt: "Luxury master bedroom with king bed",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.portfolioProject.upsert({
    where: { slug: "contemporary-living-room" },
    update: {},
    create: {
      title: "Contemporary Living Room",
      slug: "contemporary-living-room",
      description:
        "A spacious living room with modern furniture, accent walls, and perfect lighting for relaxation and entertainment.",
      categoryId: livingRoom.id,
      location: "Bangalore",
      area: "350 sq ft",
      budget: "₹8 Lakhs",
      duration: "10 weeks",
      isFeatured: true,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
            alt: "Contemporary living room with modern furniture",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  // ─── Pricing Packages ───────────────────────────────────────────────────────

  await prisma.pricingPackage.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Essential",
        slug: "essential",
        description: "Perfect for single-room transformations",
        priceFrom: 150000,
        priceTo: 350000,
        features: [
          "Single room design",
          "3D visualization",
          "Material selection guide",
          "30-day support",
        ],
        sortOrder: 1,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Premium",
        slug: "premium",
        description: "Complete home interior for apartments",
        priceFrom: 500000,
        priceTo: 1200000,
        features: [
          "Full home design",
          "Premium 3D renders",
          "Project management",
          "90-day support",
          "1 revision round",
        ],
        isPopular: true,
        sortOrder: 2,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Luxury",
        slug: "luxury",
        description: "Bespoke design for villas and large spaces",
        priceFrom: 1500000,
        priceTo: 5000000,
        features: [
          "Bespoke design consultation",
          "Unlimited 3D renders",
          "Dedicated designer",
          "Premium materials sourcing",
          "1-year support",
          "Unlimited revisions",
        ],
        sortOrder: 3,
        status: ContentStatus.PUBLISHED,
      },
    ],
  });

  // ─── Testimonials ───────────────────────────────────────────────────────────

  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Priya Sharma",
        location: "Mumbai",
        rating: 5,
        content:
          "HomeInterior transformed our 3BHK into a luxurious masterpiece. The attention to detail and quality of work exceeded our expectations. Highly recommended!",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
        isFeatured: true,
        sortOrder: 1,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Rajesh Kumar",
        location: "Delhi",
        rating: 5,
        content:
          "Professional team with excellent project management. They delivered our office interior on time and within budget. The design has boosted our team's productivity.",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
        isFeatured: true,
        sortOrder: 2,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Anita Patel",
        location: "Bangalore",
        rating: 5,
        content:
          "As an architect, I have high standards. HomeInterior not only met but exceeded them. Their craftsmanship and material selection is truly premium.",
        photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
        isFeatured: true,
        sortOrder: 3,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Vikram Singh",
        location: "Pune",
        rating: 5,
        content:
          "The modular kitchen they designed is perfect. Every inch is utilized efficiently. The team was responsive and accommodating throughout the project.",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
        isFeatured: false,
        sortOrder: 4,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Meera Reddy",
        location: "Hyderabad",
        rating: 5,
        content:
          "From consultation to final handover, the experience was seamless. They understood our vision perfectly and brought it to life beautifully.",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
        isFeatured: false,
        sortOrder: 5,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Arjun Nair",
        location: "Chennai",
        rating: 5,
        content:
          "The 3D visualization helped us visualize the final result before execution. The actual outcome was even better than what we saw in the renderings!",
        photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
        isFeatured: false,
        sortOrder: 6,
        status: ContentStatus.PUBLISHED,
      },
    ],
  });

  // ─── FAQs ───────────────────────────────────────────────────────────────────

  await prisma.faq.createMany({
    skipDuplicates: true,
    data: [
      {
        question: "What is the typical timeline for a home interior project?",
        answer:
          "The timeline varies based on the scope of the project. A standard 3BHK home interior typically takes 3-4 months from design to handover. This includes 2-3 weeks for design and planning, followed by execution and installation. We provide a detailed timeline during the consultation phase.",
        category: "General",
        sortOrder: 1,
        status: ContentStatus.PUBLISHED,
      },
      {
        question: "Do you provide 3D visualization before execution?",
        answer:
          "Yes, we provide detailed 3D renderings and walkthrough videos of your space before execution begins. This helps you visualize the final result and make any necessary adjustments. We believe in complete transparency and want you to be 100% satisfied before we proceed.",
        category: "Services",
        sortOrder: 2,
        status: ContentStatus.PUBLISHED,
      },
      {
        question: "What are your payment terms?",
        answer:
          "We offer flexible payment plans to suit your budget. Typically, we follow a milestone-based payment structure: 30% advance to start the project, 30% after material procurement, 30% during execution, and 10% upon final handover. We also offer EMI options through leading banks.",
        category: "Pricing",
        sortOrder: 3,
        status: ContentStatus.PUBLISHED,
      },
      {
        question: "Do you provide warranty on your work?",
        answer:
          "Yes, we provide a comprehensive 5-year warranty on all our workmanship and materials. This covers any manufacturing defects, workmanship issues, or material failures. Our warranty ensures complete peace of mind for your investment.",
        category: "General",
        sortOrder: 4,
        status: ContentStatus.PUBLISHED,
      },
      {
        question: "Can you work with my existing furniture and decor?",
        answer:
          "Absolutely! We believe in creating spaces that reflect your personality. Our designers can incorporate your existing furniture and decor pieces into the new design, ensuring a cohesive and personalized look that saves you money while achieving the desired aesthetic.",
        category: "Services",
        sortOrder: 5,
        status: ContentStatus.PUBLISHED,
      },
      {
        question: "Do you handle all permits and approvals?",
        answer:
          "Yes, we take care of all necessary permits, approvals, and regulatory compliance required for interior work. Our team manages the entire documentation process, ensuring a smooth and hassle-free experience for you.",
        category: "General",
        sortOrder: 6,
        status: ContentStatus.PUBLISHED,
      },
    ],
  });

  // ─── Blog Category & Post ───────────────────────────────────────────────────

  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "design-tips" },
    update: {},
    create: {
      name: "Design Tips",
      slug: "design-tips",
      description: "Expert advice for beautiful interiors",
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "10-kitchen-design-trends-2025" },
    update: {},
    create: {
      title: "10 Kitchen Design Trends for 2025",
      slug: "10-kitchen-design-trends-2025",
      excerpt:
        "Discover the latest kitchen design trends that combine functionality with stunning aesthetics.",
      content:
        "<p>The kitchen continues to evolve as the heart of the modern home. In 2025, we see a strong move toward warm minimalism, smart storage solutions, and sustainable materials.</p><p>Handleless cabinets, integrated appliances, and bold stone countertops are leading the way in luxury kitchen design.</p>",
      featuredImage: "/images/blog/kitchen-trends.jpg",
      categoryId: blogCategory.id,
      authorName: "Arjun Mehta",
      status: ContentStatus.PUBLISHED,
      metaTitle: "10 Kitchen Design Trends for 2025 | Home Interior",
      metaDescription:
        "Explore the top kitchen design trends for 2025 including warm minimalism, smart storage, and sustainable materials.",
      publishedAt: new Date(),
    },
  });

  console.log("✅ Seed completed successfully");
  console.log(`👤 Admin user: ${admin.email}`);
  console.log(`🎨 Designer user: ${designer.email}`);
  console.log(`📊 Sample data created for all CMS models`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });