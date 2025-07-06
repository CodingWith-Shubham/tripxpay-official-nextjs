"use client"

import { useState } from "react"
import PageHeader from "../../../components/PageHeader"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)
    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    })
    // Show success message
    alert("Your message has been sent. We'll get back to you soon!")
  }

  const socialIcons = {
    email: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }

  const socialLinks = [
    {
      name: "email",
      href: "mailto:tripxpay@gmail.com",
      icon: socialIcons.email,
      label: "Email"
    },
    {
      name: "twitter",
      href: "https://x.com/TripXpay?t=fnkBEQrSWv4ywEt_pHO2Lw&s=09",
      icon: socialIcons.twitter,
      label: "Twitter/X"
    },
    {
      name: "linkedin",
      href: "https://www.linkedin.com/company/107017187/admin/dashboard/",
      icon: socialIcons.linkedin,
      label: "LinkedIn"
    },
    {
      name: "youtube",
      href: "https://youtube.com/@tripxpay?si=DS0VMbAk4jndTHTO",
      icon: socialIcons.youtube,
      label: "YouTube"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background glow effects - same as home page */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <PageHeader title="Contact Us" description="Have questions or need assistance? We're here to help." />

        <div className="flex-grow py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-gray-300 mb-8">
                  Fill out the form and our team will get back to you within 24 hours. We're looking forward to hearing
                  from you!
                </p>

                <div className="space-y-6">
                  <div className="flex items-start group">
                    <div className="bg-gray-800 rounded-full p-3 mr-4 transition-all duration-300 group-hover:bg-gray-700 group-hover:scale-110">
                      <svg
                        className="w-6 h-6 text-teal-500 transition-all duration-300 group-hover:text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 transition-colors duration-300 group-hover:text-white">Email Us</h3>
                      <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">tripxpay@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="bg-gray-800 rounded-full p-3 mr-4 transition-all duration-300 group-hover:bg-gray-700 group-hover:scale-110">
                      <svg
                        className="w-6 h-6 text-teal-500 transition-all duration-300 group-hover:text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 transition-colors duration-300 group-hover:text-white">Call Us</h3>
                      <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">+1 (800) 555-1234</p>
                      <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="bg-gray-800 rounded-full p-3 mr-4 transition-all duration-300 group-hover:bg-gray-700 group-hover:scale-110">
                      <svg
                        className="w-6 h-6 text-teal-500 transition-all duration-300 group-hover:text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 transition-colors duration-300 group-hover:text-white">Visit Us</h3>
                      <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">123 Payment Street</p>
                      <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">New York, NY 10001</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target={social.name !== "email" ? "_blank" : undefined}
                        rel={social.name !== "email" ? "noopener noreferrer" : undefined}
                        className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-teal-500/25 group"
                      >
                        <span className="sr-only">{social.label}</span>
                        <div className="text-white transition-colors duration-300 group-hover:text-teal-400">
                          {social.icon}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <form onSubmit={handleSubmit} className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 border border-gray-800/50 transform transition-all duration-300 hover:bg-gray-900/90 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                  <div className="space-y-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-300 group-hover:text-white">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-gray-600"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-300 group-hover:text-white">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-gray-600"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-300 group-hover:text-white">
                        Company Name
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-gray-600"
                        placeholder="Enter your company name (optional)"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-300 group-hover:text-white">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-gray-600"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="sales">Sales Question</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="group">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-300 group-hover:text-white">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-gray-600"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 hover:scale-105 transform"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage