import PageHeader from "@/components/PageHeader";
import Tabs from "./Tabs";

const tabs = [
  { id: "api", label: "API Reference" },
  { id: "guides", label: "Integration Guides" },
  { id: "sdks", label: "SDKs & Libraries" },
  { id: "webhooks", label: "Webhooks" },
];

const apiEndpoints = [
  { name: "Authentication", endpoint: "/v1/auth", method: "POST", description: "Authenticate and get an access token" },
  { name: "Create Payment", endpoint: "/v1/payments", method: "POST", description: "Create a new payment" },
  { name: "Get Payment", endpoint: "/v1/payments/{id}", method: "GET", description: "Retrieve a payment by ID" },
  { name: "List Payments", endpoint: "/v1/payments", method: "GET", description: "List all payments with optional filters" },
  { name: "Update Payment", endpoint: "/v1/payments/{id}", method: "PATCH", description: "Update an existing payment" },
  { name: "Cancel Payment", endpoint: "/v1/payments/{id}/cancel", method: "POST", description: "Cancel a payment" },
  { name: "Refund Payment", endpoint: "/v1/payments/{id}/refund", method: "POST", description: "Refund a payment" },
];

const integrationGuides = [
  "Getting Started with TripxPay API",
  "Integrating Payment Forms",
  "Setting Up Webhooks",
  "Handling Payment Statuses",
  "Implementing Multi-Currency Support",
  "Managing Refunds and Cancellations",
  "Security Best Practices",
];

const sdks = [
  { name: "JavaScript", description: "Official JavaScript SDK for browser and Node.js", link: "#" },
  { name: "PHP", description: "Official PHP SDK for server-side integration", link: "#" },
  { name: "Python", description: "Official Python SDK for server-side integration", link: "#" },
  { name: "Ruby", description: "Official Ruby SDK for server-side integration", link: "#" },
  { name: "Java", description: "Official Java SDK for server-side integration", link: "#" },
  { name: ".NET", description: "Official .NET SDK for server-side integration", link: "#" },
];

const webhooks = [
  { event: "payment.created", description: "Triggered when a new payment is created" },
  { event: "payment.updated", description: "Triggered when a payment is updated" },
  { event: "payment.completed", description: "Triggered when a payment is completed successfully" },
  { event: "payment.failed", description: "Triggered when a payment fails" },
  { event: "payment.refunded", description: "Triggered when a payment is refunded" },
  { event: "payment.canceled", description: "Triggered when a payment is canceled" },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />
      <div className="relative z-10">
        <PageHeader
          title="Documentation"
          description="Comprehensive guides and reference documentation for integrating with TripxPay."
        />
        <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs
              tabs={tabs}
              apiEndpoints={apiEndpoints}
              integrationGuides={integrationGuides}
              sdks={sdks}
              webhooks={webhooks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
