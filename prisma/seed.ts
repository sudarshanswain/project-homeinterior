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
            url: "/images/portfolio/kitchen-1.jpg",
            alt: "Modern minimalist kitchen overview",
            sortOrder: 1,
          },
          {
            url: "/images/portfolio/kitchen-2.jpg",
            alt: "Kitchen island with pendant lighting",
            sortOrder: 2,
          },
        ],
      },
    },
  });

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

  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Anita Desai",
        location: "Bangalore",
        rating: 5,
        content:
          "The team transformed our 3BHK into a stunning modern home. Professional, timely, and exceeded our expectations.",
        isFeatured: true,
        sortOrder: 1,
        status: ContentStatus.PUBLISHED,
      },
      {
        name: "Vikram Singh",
        location: "Delhi",
        rating: 5,
        content:
          "From consultation to completion, the experience was seamless. Our kitchen is now the heart of our home.",
        isFeatured: true,
        sortOrder: 2,
        status: ContentStatus.PUBLISHED,
      },
    ],
  });

  await prisma.faq.createMany({
    skipDuplicates: true,
    data: [
      {
        question: "How long does a typical interior project take?",
        answer:
          "Project timelines vary based on scope. A single room typically takes 4-6 weeks, while a full home interior can take 8-16 weeks.",
        category: "General",
        sortOrder: 1,
        status: ContentStatus.PUBLISHED,
      },
      {
        question: "Do you offer free consultation?",
        answer:
          "Yes, we offer a complimentary initial consultation to understand your requirements, budget, and design preferences.",
        category: "Services",
        sortOrder: 2,
        status: ContentStatus.PUBLISHED,
      },
      {
        question: "What is included in your pricing packages?",
        answer:
          "Our packages include design consultation, 3D visualization, material selection, project management, and post-completion support. Specific inclusions vary by package tier.",
        category: "Pricing",
        sortOrder: 3,
        status: ContentStatus.PUBLISHED,
      },
    ],
  });

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

  console.log("Seed completed successfully");
  console.log(`Admin user: ${admin.email}`);
  console.log(`Designer user: ${designer.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
