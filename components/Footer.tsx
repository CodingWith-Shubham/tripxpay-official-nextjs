import ChatbotPage from "@/Routes/ChatbotPage";
import {
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 md:px-12 border-t border-gray-800">
      <ChatbotPage />
      <div className="max-w-6xl mx-auto">
        {/* Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image alt="tripx pay" src="/logo.svg" width={36} height={35} />
                <span className="ml-1.5 font-bold text-xl md:text-2xl font-space-grotesk text-white">TripxPay</span>
              </Link>
            </div>
          </div>


          {/* Mobile-Only Container for All Links */}
          <div className="md:hidden space-y-3">
            {/* Main Links */}
            <div>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help-center"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/documentation"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/merchant-login"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Merchant Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Desktop View Only - Grid Columns */}
          <div className="hidden md:block">
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Announcements
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/merchant-login"
                  className="text-sm text-gray-400 md:text-[16px] hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Merchant Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-start md:justify-end">
          <a
            href="mailto:tripxpay@gmail.com"
            className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 text-xl"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://www.instagram.com/tripxpay/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 text-xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/company/107017187/admin/dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 text-xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://x.com/TripXpay?t=fnkBEQrSWv4ywEt_pHO2Lw&s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 text-xl"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://youtube.com/@tripxpay?si=DS0VMbAk4jndTHTO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 text-xl"
          >
            <FaYoutube />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-sm text-gray-500 md:text-[16px]">
          ©{new Date().getFullYear()} TripXpay. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;