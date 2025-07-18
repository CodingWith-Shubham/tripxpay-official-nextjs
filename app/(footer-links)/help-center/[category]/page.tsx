import Link from "next/link";
import { use } from "react";
import ArticlesFilter from "./ArticlesFilter";
import { notFound } from "next/navigation";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  publishedAt: string;
  featured?: boolean;
}

interface CategoryData {
  title: string;
  description: string;
  icon: string;
  articles: Article[];
}

interface ArticlesData {
  [key: string]: CategoryData;
}

export async function generateStaticParams() {
  // List all valid category slugs (including alternate slugs if needed)
  const categories = [
    "getting-started",
    "account-management",
    "payments-and-processing",
    "integration",
    "security",
    "billing-and-subscriptions",
    "popular-articles",
    // Add any alternate slugs if you support them, e.g.:
    "payments-processing",
    "billing-subscriptions",
  ];
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  // Duplicate articlesData and normalization logic for metadata
  const articlesData: ArticlesData = {
    "getting-started": {
      title: "Getting Started",
      description:
        "Learn the basics of TripxPay and how to set up your account.",
      icon: "BookOpen",
      articles: [], // No need to include articles for metadata
    },
    "account-management": {
      title: "Account Management",
      description: "Manage your account settings, team members, and permissions.",
      icon: "User",
      articles: [],
    },
    "payments-and-processing": {
      title: "Payments & Processing",
      description: "Learn about payment methods, processing times, and fees.",
      icon: "CreditCard",
      articles: [],
    },
    integration: {
      title: "Integration",
      description: "Integrate TripxPay with your website or booking system.",
      icon: "Code",
      articles: [],
    },
    security: {
      title: "Security",
      description: "Understand our security measures and best practices.",
      icon: "Shield",
      articles: [],
    },
    "billing-and-subscriptions": {
      title: "Billing & Subscriptions",
      description: "Manage your billing information and subscription plan.",
      icon: "DollarSign",
      articles: [],
    },
    "popular-articles": {
      title: "Popular Articles",
      description: "Most viewed and helpful articles from our help center.",
      icon: "TrendingUp",
      articles: [],
    },
  };
  const normalizedCategory = params.category
    .replace("payments-processing", "payments-and-processing")
    .replace("billing-subscriptions", "billing-and-subscriptions");
  const currentCategory = articlesData[normalizedCategory];
  if (!currentCategory) {
    return {
      title: "Help Center - Not Found",
      description: "This help center category does not exist.",
    };
  }
  return {
    title: `${currentCategory.title} | Help Center | TripxPay`,
    description: currentCategory.description,
  };
}

export default function ViewArticlesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const unwrappedParams = use(params);
  const category = unwrappedParams.category;
  const articlesData: ArticlesData = {
    "getting-started": {
      title: "Getting Started",
      description:
        "Learn the basics of TripxPay and how to set up your account.",
      icon: "BookOpen",
      articles: [
        {
          id: 1,
          title: "Creating Your Account",
          excerpt:
            "Sign up with email and business details. Complete verification within 48 hours.",
          readTime: "2 min read",
          tags: ["setup", "beginner"],
          publishedAt: "2024-01-15",
        },
        {
          id: 2,
          title: "First Payment Setup",
          excerpt:
            "Connect your bank account securely. Process your first transaction in minutes.",
          readTime: "3 min read",
          tags: ["payments", "setup"],
          publishedAt: "2024-01-14",
        },
        {
          id: 3,
          title: "Dashboard Overview",
          excerpt:
            "Understand how to navigate your TripxPay dashboard and track payments.",
          readTime: "3 min read",
          tags: ["dashboard", "beginner"],
          publishedAt: "2024-01-13",
        },
        {
          id: 4,
          title: "Setting Up Notifications",
          excerpt: "Enable SMS or email alerts for key account activities.",
          readTime: "2 min read",
          tags: ["alerts", "settings"],
          publishedAt: "2024-01-12",
        },
        {
          id: 5,
          title: "Customizing Your Profile",
          excerpt:
            "Add a logo, business info, and user preferences for a personalized experience.",
          readTime: "2 min read",
          tags: ["profile", "customization"],
          publishedAt: "2024-01-11",
        },
        {
          id: 6,
          title: "Inviting Team Members",
          excerpt:
            "Collaborate securely by giving access to employees with role-based permissions.",
          readTime: "3 min read",
          tags: ["team", "permissions"],
          publishedAt: "2024-01-10",
        },
        {
          id: 7,
          title: "Exploring Reports",
          excerpt:
            "Generate transaction summaries and monthly performance insights.",
          readTime: "4 min read",
          tags: ["reports", "insights"],
          publishedAt: "2024-01-09",
        },
        {
          id: 8,
          title: "Linking Multiple Accounts",
          excerpt:
            "Manage multiple business profiles under one TripxPay login.",
          readTime: "3 min read",
          tags: ["accounts", "advanced"],
          publishedAt: "2024-01-08",
        },
        {
          id: 9,
          title: "Understanding Fees",
          excerpt:
            "Get a breakdown of processing fees and how they're calculated.",
          readTime: "2 min read",
          tags: ["fees", "payments"],
          publishedAt: "2024-01-07",
        },
        {
          id: 10,
          title: "Basic Troubleshooting",
          excerpt:
            "Resolve common issues like login errors and unverified accounts.",
          readTime: "3 min read",
          tags: ["help", "support"],
          publishedAt: "2024-01-06",
        },
        {
          id: 11,
          title: "Integrating with eCommerce",
          excerpt:
            "Connect TripxPay with your Shopify or WooCommerce store easily.",
          readTime: "4 min read",
          tags: ["integration", "ecommerce"],
          publishedAt: "2024-01-05",
        },
        {
          id: 12,
          title: "Switching from Another Provider",
          excerpt:
            "Learn how to migrate data and continue payments without disruption.",
          readTime: "3 min read",
          tags: ["migration", "setup"],
          publishedAt: "2024-01-04",
        },
      ],
    },
    "account-management": {
      title: "Account Management",
      description:
        "Manage your account settings, team members, and permissions.",
      icon: "User",
      articles: [
        {
          id: 3,
          title: "Password Security",
          excerpt:
            "Change password every 90 days. Enable two-factor authentication for extra security.",
          readTime: "2 min read",
          tags: ["security", "login"],
          publishedAt: "2024-01-13",
        },
        {
          id: 4,
          title: "Team Access",
          excerpt:
            "Add up to 5 team members. Set custom permissions for each role.",
          readTime: "3 min read",
          tags: ["team", "access"],
          publishedAt: "2024-01-12",
        },
        {
          id: 5,
          title: "Updating Business Information",
          excerpt:
            "Change your business name, address, and contact info from the settings panel.",
          readTime: "2 min read",
          tags: ["profile", "settings"],
          publishedAt: "2024-01-11",
        },
        {
          id: 6,
          title: "Managing Notifications",
          excerpt: "Customize which alerts you receive by email or SMS.",
          readTime: "2 min read",
          tags: ["notifications", "preferences"],
          publishedAt: "2024-01-10",
        },
        {
          id: 7,
          title: "Viewing Login History",
          excerpt:
            "Track sign-ins by location and device to detect suspicious activity.",
          readTime: "2 min read",
          tags: ["security", "logs"],
          publishedAt: "2024-01-09",
        },
        {
          id: 8,
          title: "Deactivating a Team Member",
          excerpt: "Remove or suspend user access without affecting your data.",
          readTime: "2 min read",
          tags: ["team", "access"],
          publishedAt: "2024-01-08",
        },
        {
          id: 9,
          title: "Billing Settings",
          excerpt:
            "Update your billing address, payment method, and view past invoices.",
          readTime: "3 min read",
          tags: ["billing", "settings"],
          publishedAt: "2024-01-07",
        },
        {
          id: 10,
          title: "Deleting Your Account",
          excerpt:
            "Steps to permanently close your TripxPay account and export your data.",
          readTime: "3 min read",
          tags: ["account", "deletion"],
          publishedAt: "2024-01-06",
        },
      ],
    },
    "payments-and-processing": {
      title: "Payments & Processing",
      description: "Learn about payment methods, processing times, and fees.",
      icon: "CreditCard",
      articles: [
        {
          id: 5,
          title: "Accepted Cards",
          excerpt:
            "Visa, Mastercard, Amex supported. Process international cards with 3.5% fee.",
          readTime: "2 min read",
          tags: ["cards", "fees"],
          publishedAt: "2024-01-11",
        },
        {
          id: 6,
          title: "Bank Transfers",
          excerpt:
            "ACH transfers take 3-5 days. Instant transfers available for 1% fee.",
          readTime: "2 min read",
          tags: ["banking", "transfers"],
          publishedAt: "2024-01-10",
        },
        {
          id: 7,
          title: "Processing Times",
          excerpt:
            "Most card payments settle within 1-2 business days. Delays may occur on holidays.",
          readTime: "2 min read",
          tags: ["timing", "settlement"],
          publishedAt: "2024-01-09",
        },
        {
          id: 8,
          title: "Refunds & Chargebacks",
          excerpt:
            "Issue full or partial refunds. Handle disputes within 14 days of notice.",
          readTime: "3 min read",
          tags: ["refunds", "chargebacks"],
          publishedAt: "2024-01-08",
        },
        {
          id: 9,
          title: "Payout Schedule",
          excerpt:
            "Daily, weekly, or monthly payouts. Customize per business need.",
          readTime: "2 min read",
          tags: ["payout", "schedule"],
          publishedAt: "2024-01-07",
        },
        {
          id: 10,
          title: "International Payments",
          excerpt:
            "Accept over 130 currencies. FX fee of 2% applies on conversions.",
          readTime: "2 min read",
          tags: ["international", "currency"],
          publishedAt: "2024-01-06",
        },
        {
          id: 11,
          title: "Mobile Payments",
          excerpt:
            "Support for Apple Pay and Google Pay on web and mobile apps.",
          readTime: "2 min read",
          tags: ["mobile", "digitalwallets"],
          publishedAt: "2024-01-05",
        },
        {
          id: 12,
          title: "Recurring Billing",
          excerpt: "Set up automatic subscriptions and retry failed payments.",
          readTime: "3 min read",
          tags: ["subscriptions", "automation"],
          publishedAt: "2024-01-04",
        },
        {
          id: 13,
          title: "Payment Links",
          excerpt:
            "Generate one-time or recurring payment links for your customers.",
          readTime: "2 min read",
          tags: ["links", "remote"],
          publishedAt: "2024-01-03",
        },
        {
          id: 14,
          title: "Failed Payment Handling",
          excerpt:
            "Automatically notify customers and retry failed transactions.",
          readTime: "2 min read",
          tags: ["failures", "notifications"],
          publishedAt: "2024-01-02",
        },
        {
          id: 15,
          title: "Transaction Limits",
          excerpt:
            "Maximum per-transaction amount: $50,000. Custom limits available on request.",
          readTime: "2 min read",
          tags: ["limits", "restrictions"],
          publishedAt: "2024-01-01",
        },
        {
          id: 16,
          title: "Fees Breakdown",
          excerpt:
            "Transparent pricing: 2.9% + $0.30 per transaction. Discounts for high volume.",
          readTime: "3 min read",
          tags: ["fees", "pricing"],
          publishedAt: "2023-12-31",
        },
        {
          id: 17,
          title: "Manual Payment Entry",
          excerpt:
            "Enter offline payments manually for full transaction tracking.",
          readTime: "2 min read",
          tags: ["offline", "manual"],
          publishedAt: "2023-12-30",
        },
        {
          id: 18,
          title: "Crypto Payments",
          excerpt:
            "Accept Bitcoin, Ethereum, and USDC with automatic conversion to USD.",
          readTime: "3 min read",
          tags: ["crypto", "conversion"],
          publishedAt: "2023-12-29",
        },
        {
          id: 19,
          title: "Payment Integrations",
          excerpt:
            "Use our APIs to integrate payments into your website or app.",
          readTime: "3 min read",
          tags: ["integration", "api"],
          publishedAt: "2023-12-28",
        },
      ],
    },
    integration: {
      title: "Integration",
      description: "Integrate TripxPay with your website or booking system.",
      icon: "Code",
      articles: [
        {
          id: 7,
          title: "API Basics",
          excerpt:
            "Generate API keys in dashboard. Use sandbox mode for testing.",
          readTime: "3 min read",
          tags: ["api", "developers"],
          publishedAt: "2024-01-09",
        },
        {
          id: 8,
          title: "WordPress Plugin",
          excerpt:
            "Install plugin in 2 minutes. Customize checkout appearance.",
          readTime: "2 min read",
          tags: ["wordpress", "plugin"],
          publishedAt: "2024-01-08",
        },
        {
          id: 9,
          title: "Webhook Setup",
          excerpt:
            "Receive real-time payment events. Secure with secret signing keys.",
          readTime: "3 min read",
          tags: ["webhooks", "security"],
          publishedAt: "2024-01-07",
        },
        {
          id: 10,
          title: "Booking System Integration",
          excerpt:
            "Connect TripxPay with leading travel and event booking platforms.",
          readTime: "2 min read",
          tags: ["booking", "integration"],
          publishedAt: "2024-01-06",
        },
        {
          id: 11,
          title: "Testing Environment",
          excerpt:
            "Use sandbox environment to simulate payments without real charges.",
          readTime: "2 min read",
          tags: ["testing", "sandbox"],
          publishedAt: "2024-01-05",
        },
        {
          id: 12,
          title: "API Error Handling",
          excerpt: "Understand and respond to common API errors gracefully.",
          readTime: "3 min read",
          tags: ["api", "errors"],
          publishedAt: "2024-01-04",
        },
        {
          id: 13,
          title: "JavaScript SDK",
          excerpt:
            "Embed secure checkout using our JavaScript SDK in under 5 minutes.",
          readTime: "2 min read",
          tags: ["sdk", "frontend"],
          publishedAt: "2024-01-03",
        },
        {
          id: 14,
          title: "Mobile App Integration",
          excerpt: "Integrate with iOS and Android apps using our mobile SDKs.",
          readTime: "3 min read",
          tags: ["mobile", "sdk"],
          publishedAt: "2024-01-02",
        },
        {
          id: 15,
          title: "Authentication & Rate Limits",
          excerpt:
            "Protect your integration with token auth. Review usage limits.",
          readTime: "2 min read",
          tags: ["auth", "limits"],
          publishedAt: "2024-01-01",
        },
        {
          id: 16,
          title: "Custom Checkout Flow",
          excerpt:
            "Design a fully branded payment experience with advanced API features.",
          readTime: "3 min read",
          tags: ["custom", "checkout"],
          publishedAt: "2023-12-31",
        },
      ],
    },
    security: {
      title: "Security",
      description: "Understand our security measures and best practices.",
      icon: "Shield",
      articles: [
        {
          id: 9,
          title: "PCI Compliance",
          excerpt:
            "Level 1 certified provider. Annual security audits conducted.",
          readTime: "2 min read",
          tags: ["compliance", "standards"],
          publishedAt: "2024-01-07",
        },
        {
          id: 10,
          title: "Fraud Prevention",
          excerpt: "AI monitors transactions 24/7. Set custom risk rules.",
          readTime: "3 min read",
          tags: ["fraud", "protection"],
          publishedAt: "2024-01-06",
        },
        {
          id: 11,
          title: "Data Encryption Standards",
          excerpt:
            "All data is encrypted at rest and in transit using AES-256.",
          readTime: "2 min read",
          tags: ["security", "encryption"],
          publishedAt: "2024-01-05",
        },
        {
          id: 12,
          title: "Multi-Factor Authentication",
          excerpt:
            "Enhance login security with SMS, email, or authenticator apps.",
          readTime: "2 min read",
          tags: ["authentication", "MFA"],
          publishedAt: "2024-01-04",
        },
        {
          id: 13,
          title: "Incident Response Plan",
          excerpt:
            "Our team is ready 24/7 to address any potential breach swiftly.",
          readTime: "3 min read",
          tags: ["response", "security"],
          publishedAt: "2024-01-03",
        },
        {
          id: 14,
          title: "GDPR Compliance Guide",
          excerpt:
            "Learn how we handle user data in accordance with GDPR rules.",
          readTime: "4 min read",
          tags: ["compliance", "privacy"],
          publishedAt: "2024-01-02",
        },
        {
          id: 15,
          title: "Secure API Access",
          excerpt:
            "Use API keys and OAuth2 to keep integrations secure and manageable.",
          readTime: "3 min read",
          tags: ["API", "security"],
          publishedAt: "2024-01-01",
        },
      ],
    },
    "billing-and-subscriptions": {
      title: "Billing & Subscriptions",
      description: "Manage your billing information and subscription plan.",
      icon: "DollarSign",
      articles: [
        {
          id: 11,
          title: "Plan Options",
          excerpt:
            "Starter, Pro and Enterprise plans. Compare features and limits.",
          readTime: "2 min read",
          tags: ["plans", "pricing"],
          publishedAt: "2024-01-05",
        },
        {
          id: 12,
          title: "Upgrading Plans",
          excerpt: "Change plans anytime. Prorated charges apply.",
          readTime: "2 min read",
          tags: ["upgrade", "billing"],
          publishedAt: "2024-01-04",
        },
        {
          id: 13,
          title: "Viewing Invoices",
          excerpt:
            "Download past invoices and track billing history from your dashboard.",
          readTime: "2 min read",
          tags: ["invoices", "records"],
          publishedAt: "2024-01-03",
        },
        {
          id: 14,
          title: "Payment Methods",
          excerpt: "Add or update credit cards and bank accounts securely.",
          readTime: "2 min read",
          tags: ["payment", "methods"],
          publishedAt: "2024-01-02",
        },
        {
          id: 15,
          title: "Failed Payments",
          excerpt:
            "Understand common reasons for failed payments and how to resolve them.",
          readTime: "3 min read",
          tags: ["errors", "payments"],
          publishedAt: "2024-01-01",
        },
        {
          id: 16,
          title: "Canceling Subscription",
          excerpt:
            "Cancel anytime. Access continues until the end of the billing cycle.",
          readTime: "2 min read",
          tags: ["cancel", "subscription"],
          publishedAt: "2023-12-31",
        },
        {
          id: 17,
          title: "Refund Policy",
          excerpt: "Understand our refund process and how to request one.",
          readTime: "2 min read",
          tags: ["refund", "policy"],
          publishedAt: "2023-12-30",
        },
        {
          id: 18,
          title: "Billing Contacts",
          excerpt:
            "Assign billing-specific contacts for invoice and payment communication.",
          readTime: "2 min read",
          tags: ["contacts", "billing"],
          publishedAt: "2023-12-29",
        },
        {
          id: 19,
          title: "Taxes & Invoicing",
          excerpt:
            "Add tax IDs and generate invoices with localized tax details.",
          readTime: "2 min read",
          tags: ["tax", "invoicing"],
          publishedAt: "2023-12-28",
        },
      ],
    },
    "popular-articles": {
      title: "Popular Articles",
      description: "Most viewed and helpful articles from our help center.",
      icon: "TrendingUp",
      articles: [
        {
          id: 13,
          title: "How to Process Your First Payment",
          excerpt:
            "Complete step-by-step guide to processing payments. Set up in under 5 minutes.",
          readTime: "4 min read",
          tags: ["payments", "getting-started"],
          publishedAt: "2024-01-20",
          featured: true,
        },
        {
          id: 14,
          title: "Understanding Transaction Fees",
          excerpt:
            "Breakdown of all fees including processing, international, and chargeback costs.",
          readTime: "3 min read",
          tags: ["fees", "pricing"],
          publishedAt: "2024-01-18",
          featured: true,
        },
        {
          id: 15,
          title: "Setting Up Recurring Payments",
          excerpt:
            "Create subscription billing for your customers. Manage payment schedules easily.",
          readTime: "5 min read",
          tags: ["subscriptions", "recurring"],
          publishedAt: "2024-01-16",
        },
        {
          id: 16,
          title: "API Integration Guide",
          excerpt:
            "Connect TripxPay to your application. Includes code examples and best practices.",
          readTime: "8 min read",
          tags: ["api", "integration", "developers"],
          publishedAt: "2024-01-14",
        },
        {
          id: 17,
          title: "Handling Payment Disputes",
          excerpt:
            "Respond to chargebacks effectively. Reduce dispute rates and protect revenue.",
          readTime: "6 min read",
          tags: ["disputes", "chargebacks"],
          publishedAt: "2024-01-12",
        },
        {
          id: 18,
          title: "Multi-Currency Processing",
          excerpt:
            "Accept payments in 150+ currencies. Automatic conversion and settlement options.",
          readTime: "4 min read",
          tags: ["currency", "international"],
          publishedAt: "2024-01-10",
        },
        {
          id: 19,
          title: "Mobile Payment Solutions",
          excerpt:
            "Accept payments on mobile devices. SDK integration for iOS and Android apps.",
          readTime: "7 min read",
          tags: ["mobile", "sdk"],
          publishedAt: "2024-01-08",
        },
        {
          id: 20,
          title: "Compliance and Regulations",
          excerpt:
            "Stay compliant with PCI DSS, GDPR, and regional payment regulations.",
          readTime: "5 min read",
          tags: ["compliance", "regulations"],
          publishedAt: "2024-01-06",
        },
      ],
    },
  };

  const normalizedCategory = category
    .replace("payments-processing", "payments-and-processing")
    .replace("billing-subscriptions", "billing-and-subscriptions");

  const currentCategory = articlesData[normalizedCategory];

  if (!currentCategory) {
    return notFound();
  }

  const articles = currentCategory.articles;
  const allTags = [
    "all",
    ...new Set(articles.flatMap((article) => article.tags)),
  ];
  const categoryInfo = {
    title: currentCategory.title,
    description: currentCategory.description,
    icon: currentCategory.icon,
  };

  // Helper to render the icon (same as before)
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "User":
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "CreditCard":
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case "Code":
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case "Shield":
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "DollarSign":
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "TrendingUp":
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[250px] sm:w-[350px] lg:w-[500px] h-[150px] sm:h-[200px] lg:h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[60px] sm:blur-[80px] lg:blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[280px] sm:w-[400px] lg:w-[550px] h-[150px] sm:h-[200px] lg:h-[300px] bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[60px] sm:blur-[80px] lg:blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:10px_10px] sm:[background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="py-2 sm:py-4 px-3 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Link
                href="/help-center"
                className="text-gray-400 hover:text-teal-400 transition-colors duration-300 truncate max-w-[120px] sm:max-w-none"
              >
                Help Center
              </Link>
              <svg
                className="w-3 h-3 text-gray-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-teal-400 truncate">
                {currentCategory.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="py-3 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="bg-teal-500/20 p-2.5 sm:p-4 rounded-lg text-teal-400 border border-teal-500/30 flex-shrink-0">
                {renderIcon(currentCategory.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 break-words leading-tight">
                  {currentCategory.title}
                </h1>
                <p className="text-gray-300 text-sm sm:text-lg leading-relaxed">
                  {currentCategory.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Filter and List (Client Component) */}
        <ArticlesFilter
          articles={articles}
          allTags={allTags}
          normalizedCategory={normalizedCategory}
          categoryInfo={categoryInfo}
        />
      </div>
    </div>
  );
}
