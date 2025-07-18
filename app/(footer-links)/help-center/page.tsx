import HelpCenterSearch from "./HelpCenterSearch";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Help Center | TripxPay",
  description: "Find answers to your questions and learn how to get the most out of TripxPay.",
};

const categories = [
  {
    title: "Getting Started",
    icon: "BookOpen",
    description: "Learn the basics of TripxPay and how to set up your account.",
    articles: 12,
  },
  {
    title: "Account Management",
    icon: "User",
    description: "Manage your account settings, team members, and permissions.",
    articles: 8,
  },
  {
    title: "Payments & Processing",
    icon: "CreditCard",
    description: "Learn about payment methods, processing times, and fees.",
    articles: 15,
  },
  {
    title: "Integration",
    icon: "Code",
    description: "Integrate TripxPay with your website or booking system.",
    articles: 10,
  },
  {
    title: "Security",
    icon: "Shield",
    description: "Understand our security measures and best practices.",
    articles: 7,
  },
  {
    title: "Billing & Subscriptions",
    icon: "DollarSign",
    description: "Manage your billing information and subscription plan.",
    articles: 9,
  },
];

const popularArticles = [
  {
    title: "How to create a payment link",
    slug: "create-payment-link",
    description: "Step-by-step guide to generating and sharing payment links",
    content: `Creating payment links in TripxPay is simple and straightforward. First, navigate to the \"Payments\" section in your dashboard. Click on \"Create Payment Link\" and fill in the required details including amount, currency, and description. You can also set expiration dates and add customer information. Once created, you can share the link via email, SMS, or embed it in your website. Payment links are a great way to request payments without needing to build a full checkout page.`,
  },
  {
    title: "Setting up multi-currency support",
    slug: "multi-currency-support",
    description: "Enable and configure multiple currencies for your account",
    content: `To enable multi-currency support, go to your account settings and select \"Currencies\". Here you can add the currencies you want to accept. TripxPay supports over 50 currencies with automatic conversion. You can set your default settlement currency and configure exchange rate margins. Remember that currency conversion fees may apply. This feature is particularly useful if you have international customers paying in their local currencies.`,
  },
  {
    title: "Understanding processing fees",
    slug: "processing-fees",
    description: "Detailed breakdown of our transparent pricing structure",
    content: `TripxPay charges a standard processing fee of 2.9% + $0.30 per transaction for domestic cards. International cards have a 3.9% fee. ACH transfers cost 0.8% with a $5 cap. There are no monthly fees on our basic plan. Fees are deducted automatically from each payment. For high-volume merchants (over $10k/month), we offer custom pricing with reduced rates. All fees are clearly displayed before you confirm each payment.`,
  },
  {
    title: "Adding team members to your account",
    slug: "add-team-members",
    description: "Collaborate with your team using role-based permissions",
    content: `To add team members, go to \"Account Settings\" then \"Team Management\". Click \"Invite Member\" and enter their email address. You can assign roles like Admin (full access), Developer (API access), or Support (limited access). Each member will receive an email invitation to join. You can manage permissions and revoke access at any time. Team members can collaborate on the same account without sharing login credentials.`,
  },
  {
    title: "Integrating with your booking system",
    slug: "booking-system-integration",
    description: "Connect TripxPay with your existing booking platform",
    content: `TripxPay offers API and plugin integrations with most booking systems. Our REST API documentation is available in the Developer section. For popular platforms like WordPress, WooCommerce, and Shopify, we provide pre-built plugins. The integration typically takes 1-2 hours to set up. Our support team can assist with custom integration needs. All integrations support webhooks for real-time payment notifications.`,
  },
  {
    title: "Handling refunds and cancellations",
    slug: "refunds-cancellations",
    description: "Best practices for processing refunds and managing cancellations",
    content: `To process a refund, go to the transaction in your dashboard and click \"Refund\". You can do full or partial refunds. Refunds typically take 5-7 business days to appear in the customer's account. For cancellations, we recommend using our cancellation webhooks to automatically trigger refunds. There are no fees for refunds, but the original processing fees are not returned. Bulk refunds are available for CSV upload.`,
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background Effect - Opt */}
      <div className="absolute top-0 left-0 w-[300px] sm:w-[600px] h-[200px] sm:h-[400px] bg-gradient-to-br from-[#00ffb4]/30 to-transparent rotate-12 blur-[70px] sm:blur-[140px] rounded-[40%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[350px] sm:w-[650px] h-[200px] sm:h-[400px] bg-gradient-to-tr from-yellow-400/25 to-transparent rotate-180 blur-[70px] sm:blur-[140px] rounded-[30%] pointer-events-none z-0 top-[1%]" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[300px] sm:w-[500px] h-[150px] sm:h-[300px] bg-gradient-to-t from-purple-500/20 to-transparent blur-[60px] sm:blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none z-0" />
      <div className="relative z-10">
        <PageHeader
          title="Help Center"
          description="Find answers to your questions and learn how to get the most out of TripxPay."
        />
        <div className="flex-grow py-6 sm:py-12 px-4 sm:px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <HelpCenterSearch categories={categories} popularArticles={popularArticles} />
          </div>
        </div>
      </div>
    </div>
  );
}
