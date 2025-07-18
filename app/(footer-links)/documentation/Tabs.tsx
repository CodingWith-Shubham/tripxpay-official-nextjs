"use client";
import { useState } from "react";

type ApiEndpoint = {
  name: string;
  endpoint: string;
  method: string;
  description: string;
};

type Sdk = {
  name: string;
  description: string;
  link: string;
};

type Webhook = {
  event: string;
  description: string;
};

type TabsProps = {
  tabs: { id: string; label: string }[];
  apiEndpoints: ApiEndpoint[];
  integrationGuides: string[];
  sdks: Sdk[];
  webhooks: Webhook[];
};

export default function Tabs({ tabs, apiEndpoints, integrationGuides, sdks, webhooks }: TabsProps) {
  const [activeTab, setActiveTab] = useState("api");

  return (
    <>
      {/* Tabs - Responsive */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 min-w-max pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === "api" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">API Reference</h2>
              <p className="text-gray-300 mb-3">
                Our RESTful API allows you to integrate TripxPay's payment processing capabilities.
              </p>
              <div className="bg-gray-900 p-3 rounded-md inline-block">
                <code className="text-gray-200">
                  Base URL: <span className="text-white">https://api.tripxpay.com</span>
                </code>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div className="hidden sm:grid grid-cols-12 bg-gray-800 py-3 px-4">
                <div className="col-span-4 sm:col-span-3 font-medium">Endpoint</div>
                <div className="col-span-2 font-medium">Method</div>
                <div className="col-span-6 sm:col-span-7 font-medium">Description</div>
              </div>
              <div className="divide-y divide-gray-800">
                {apiEndpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-0 py-4 px-4 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="col-span-3">
                      <div className="font-medium text-white">{endpoint.name}</div>
                      <div className="text-xs text-gray-400">{endpoint.endpoint}</div>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-mono ${
                          endpoint.method === "GET"
                            ? "bg-blue-900/30 text-blue-300"
                            : endpoint.method === "POST"
                            ? "bg-green-900/30 text-green-300"
                            : endpoint.method === "PATCH"
                            ? "bg-yellow-900/30 text-yellow-300"
                            : endpoint.method === "DELETE"
                            ? "bg-red-900/30 text-red-300"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                    </div>
                    <div className="col-span-7 text-gray-300 sm:pl-2">{endpoint.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "guides" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Integration Guides</h2>
              <p className="text-gray-300">
                Step-by-step guides to help you integrate TripxPay into your applications.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationGuides.map((guide, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-white">{guide}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sdks" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">SDKs & Libraries</h2>
              <p className="text-gray-300">
                Official SDKs and libraries to help you integrate TripxPay.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sdks.map((sdk, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <h3 className="font-bold text-white mb-2">{sdk.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{sdk.description}</p>
                  <div className="flex space-x-3">
                    <a
                      href={sdk.link}
                      className="text-sm text-gray-400 hover:text-white flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      Docs
                    </a>
                    <a
                      href={sdk.link}
                      className="text-sm text-gray-400 hover:text-white flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "webhooks" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Webhooks</h2>
              <p className="text-gray-300 mb-3">Receive real-time updates about payment events.</p>
              <div className="bg-gray-900 p-3 rounded-md inline-block">
                <code className="text-gray-200">
                  Webhook URL: <span className="text-white">https://your-server.com/tripxpay-webhook</span>
                </code>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 mb-6">
              <div className="hidden sm:grid grid-cols-12 bg-gray-800 py-3 px-4">
                <div className="col-span-4 font-medium">Event</div>
                <div className="col-span-8 font-medium">Description</div>
              </div>
              <div className="divide-y divide-gray-800">
                {webhooks.map((webhook, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-0 py-4 px-4 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="col-span-4 font-medium text-white">{webhook.event}</div>
                    <div className="col-span-8 text-gray-300 sm:pl-2">{webhook.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">Webhook Security</h3>
              <p className="text-gray-300 mb-4">We sign all webhook requests with a verifiable signature.</p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{`// Example webhook verification in Node.js\nconst crypto = require('crypto');\n\nfunction verifyWebhookSignature(payload, signature, secret) {\n  const hmac = crypto.createHmac('sha256', secret);\n  const digest = hmac.update(payload).digest('hex');\n  return crypto.timingSafeEqual(\n    Buffer.from(digest),\n    Buffer.from(signature)\n  );\n}`}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 