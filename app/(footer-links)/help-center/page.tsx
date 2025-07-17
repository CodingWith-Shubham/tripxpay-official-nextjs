"use client";
import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

interface Article {
  title: string;
  slug: string;
  description: string;
  content?: string;
}

interface Category {
  title: string;
  icon: string;
  description: string;
  articles: number;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleLiveChatClick = () => {
    // Dispatches event to open chatbot
    const event = new CustomEvent("openChatbot");
    window.dispatchEvent(event);

    // Scrolls to bottom where chatbot is located
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleEmailClick = () => {
    const subject = "Support Request - TripXPay Help";
    const body =
      "Hello TripXPay Support Team,\n\nI need assistance with the following:\n\n[Please describe your issue here]";
    window.location.href = `mailto:tripxpay@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const categories: Category[] = [
    {
      title: "Getting Started",
      icon: "BookOpen",
      description:
        "Learn the basics of TripxPay and how to set up your account.",
      articles: 12,
    },
    {
      title: "Account Management",
      icon: "User",
      description:
        "Manage your account settings, team members, and permissions.",
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

  const popularArticles: Article[] = [
    {
      title: "How to create a payment link",
      slug: "create-payment-link",
      description: "Step-by-step guide to generating and sharing payment links",
      content: `Creating payment links in TripxPay is simple and straightforward. First, navigate to the "Payments" section in your dashboard. Click on "Create Payment Link" and fill in the required details including amount, currency, and description. You can also set expiration dates and add customer information. Once created, you can share the link via email, SMS, or embed it in your website. Payment links are a great way to request payments without needing to build a full checkout page.`,
    },
    {
      title: "Setting up multi-currency support",
      slug: "multi-currency-support",
      description: "Enable and configure multiple currencies for your account",
      content: `To enable multi-currency support, go to your account settings and select "Currencies". Here you can add the currencies you want to accept. TripxPay supports over 50 currencies with automatic conversion. You can set your default settlement currency and configure exchange rate margins. Remember that currency conversion fees may apply. This feature is particularly useful if you have international customers paying in their local currencies.`,
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
      content: `To add team members, go to "Account Settings" then "Team Management". Click "Invite Member" and enter their email address. You can assign roles like Admin (full access), Developer (API access), or Support (limited access). Each member will receive an email invitation to join. You can manage permissions and revoke access at any time. Team members can collaborate on the same account without sharing login credentials.`,
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
      description:
        "Best practices for processing refunds and managing cancellations",
      content: `To process a refund, go to the transaction in your dashboard and click "Refund". You can do full or partial refunds. Refunds typically take 5-7 business days to appear in the customer's account. For cancellations, we recommend using our cancellation webhooks to automatically trigger refunds. There are no fees for refunds, but the original processing fees are not returned. Bulk refunds are available for CSV upload.`,
    },
  ];

  const getCategorySlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "and")
      .replace("payments-and-processing", "payments-processing")
      .replace("billing-and-subscriptions", "billing-subscriptions");
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "User":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "CreditCard":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        );
      case "Code":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        );
      case "Shield":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.40A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "DollarSign":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

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
            {/*  Search Bar - Mobile opt */}
            <div className="mb-8 sm:mb-16">
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 pl-12 sm:pl-14 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 text-base sm:text-lg transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-teal-500/10"
                  />
                  <svg
                    className="absolute left-4 sm:left-5 top-4 sm:top-5 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-colors duration-300 group-hover:text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Categories Section*/}
            <div className="mb-12 sm:mb-20">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Browse by Category
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                  Explore our comprehensive knowledge base organized by topics
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/help-center/${getCategorySlug(category.title)}`}
                    className="group block h-full"
                  >
                    <div className="h-full flex flex-col bg-gray-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-800/50 transform transition-all duration-500 hover:translate-y-[-4px] sm:hover:translate-y-[-8px] hover:bg-gray-900/80 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/20 group cursor-pointer relative overflow-hidden">
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl" />

                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-start mb-4 sm:mb-6">
                          <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 p-3 sm:p-4 rounded-lg sm:rounded-xl text-teal-400 mr-3 sm:mr-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-teal-500/30 border border-teal-500/20 flex-shrink-0">
                            {renderIcon(category.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 transition-all duration-300 group-hover:text-teal-400 group-hover:translate-x-1 line-clamp-2">
                              {category.title}
                            </h3>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="text-xs sm:text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                                {category.articles} articles
                              </span>
                              <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>
                              <span className="text-xs sm:text-sm text-teal-500 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 hidden sm:inline">
                                Explore →
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed transition-colors duration-300 group-hover:text-white mb-4 sm:mb-6 flex-1 line-clamp-3">
                          {category.description}
                        </p>

                        {/* Progress indicator */}
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden mt-auto">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Two Column Layout - on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              <div>
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 border border-blue-500/30 flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Popular Articles
                  </h2>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-800/50 overflow-hidden hover:border-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10">
                  <div className="divide-y divide-gray-800/50">
                    {popularArticles.map((article, index) => (
                      <Link
                        key={index}
                        href={`/help-center/articles/${article.slug}`}
                        className="block p-4 sm:p-6 transition-all duration-300 hover:bg-gray-800/60 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-start sm:items-center">
                          <div className="bg-teal-500/20 p-2 rounded-lg mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110 border border-teal-500/30 flex-shrink-0 mt-1 sm:mt-0">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 transition-colors duration-300 group-hover:text-teal-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-300 font-medium transition-all duration-300 group-hover:text-white group-hover:translate-x-1 text-sm sm:text-base line-clamp-2 mb-1">
                              {article.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-400 line-clamp-2">
                              {article.description}
                            </p>
                          </div>
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-400 ml-2 flex-shrink-0"
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
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Support Section - also responsive */}
              <div>
                <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 border border-blue-500/30 flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Need More Help?
                  </h2>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800/50 transition-all duration-300 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl" />
                  <div className="relative z-10">
                    <p className="text-gray-300 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
                      Can't find what you're looking for? Our support team is
                      here to help you with any questions or issues.
                    </p>

                    <div className="space-y-3 sm:space-y-4">
                      {/* Live Chat */}
                      <button
                        onClick={handleLiveChatClick}
                        className="w-full flex items-center p-3 sm:p-4 md:p-6 bg-gray-800/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-700/50 transform transition-all duration-300 hover:translate-y-[-1px] sm:hover:translate-y-[-2px] md:hover:translate-y-[-4px] hover:bg-gray-800/80 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/20 group text-left relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl" />
                        <div className="bg-teal-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 md:mr-6 transition-all duration-300 group-hover:scale-110 border border-teal-500/30 relative z-10 flex-shrink-0">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-400 transition-colors duration-300 group-hover:text-teal-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        </div>
                        <div className="relative z-10 flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 group-hover:text-teal-400">
                            Live Chat
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300">
                            Get instant help from our support team
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-400 relative z-10 ml-2 flex-shrink-0"
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
                      </button>

                      {/* Email */}
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=tripxpay@gmail.com&su=Support%20Request%20-%20TripXPay%20Help&body=Hello%20TripXPay%20Support%20Team,%0A%0AI%20need%20assistance%20with%20the%20following:%0A%0A[Please%20describe%20your%20issue%20here]"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center p-3 sm:p-4 md:p-6 bg-gray-800/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-700/50 transform transition-all duration-300 hover:translate-y-[-1px] sm:hover:translate-y-[-2px] md:hover:translate-y-[-4px] hover:bg-gray-800/80 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/20 group text-left relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl" />
                        <div className="bg-teal-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 md:mr-6 transition-all duration-300 group-hover:scale-110 border border-teal-500/30 relative z-10 flex-shrink-0">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-400 transition-colors duration-300 group-hover:text-teal-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>

                        <div className="relative z-10 flex-1 min-w-0 ">
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 group-hover:text-teal-400">
                            Email via Gmail
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 break-all">
                            tripxpay@gmail.com
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-400 relative z-10 ml-2 flex-shrink-0"
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
                      </a>

                      {/* Phone */}
                      <a
                        href="tel:+919315224277"
                        className="w-full flex items-center p-3 sm:p-4 md:p-6 bg-gray-800/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-700/50 transform transition-all duration-300 hover:translate-y-[-1px] sm:hover:translate-y-[-2px] md:hover:translate-y-[-4px] hover:bg-gray-800/80 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/20 group text-left relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl" />
                        <div className="bg-teal-500/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 md:mr-6 transition-all duration-300 group-hover:scale-110 border border-teal-500/30 relative z-10 flex-shrink-0">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-400 transition-colors duration-300 group-hover:text-teal-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="relative z-10 flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 group-hover:text-teal-400">
                            Call Support
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300">
                            +91 93152 24277
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-400 relative z-10 ml-2 flex-shrink-0"
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
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
