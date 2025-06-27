"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/Auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserInfo } from "@/action/tokeninfo";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isConsumer, setIsConsumer] = useState(false);
  const [showMerchantLogin, setShowMerchantLogin] = useState(false);
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const logout = auth?.logout;
  const router = useRouter();
  const pathname = usePathname();

  // Responsive state
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const data = async () => {
    try {
      const data = await getUserInfo();
      if (data && data.role) {
        if (data.role === "consumer") {
          setIsConsumer(true);
          setShowMerchantLogin(false);
        } else if (data.role === "merchant") {
          setIsConsumer(false);
          setShowMerchantLogin(false);
        } else {
          // If role is not consumer or merchant, show merchant login option
          setShowMerchantLogin(true);
        }
      } else {
        // No token or no role found, show merchant login option
        setShowMerchantLogin(true);
      }
    } catch (error) {
      console.log("error while extracting the data", (error as Error).message);
      // On error, show merchant login option
      setShowMerchantLogin(true);
    }
  };

  useEffect(() => {
    data();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      const response = await fetch(`/api/logout`, { method: "POST" });
      const { message } = await response.json();
      if (message) {
        toast.message(message);
      }
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", (error as Error).message);
      router.push("/");
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { text: "HOME", path: "/" },
    { text: "ABOUT", path: "/about" },
    { text: "BLOGS", path: "/BlogsPage" },
    { text: "HELP & SUPPORT", path: "/help-support" },
    { text: "PLAN MY TRIP", path: "/planmytrip" },
    {
      text: "DASHBOARD",
      path: isConsumer ? "/verified" : "/merchantdashboard",
      auth: true,
    },
    // Conditionally add merchant login item
    ...(showMerchantLogin && !currentUser
      ? [
          {
            text: "MERCHANT",
            path: "/merchant-login",
            auth: false,
          },
        ]
      : []),
  ];

  const dropdownItemAnimation = (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
    },
  });

  const isActiveRoute = (path: string) => pathname === path;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-transparent text-white w-full relative z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full py-3 sm:py-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image alt="tripx pay" src="/logo.svg" width={40} height={40} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-grow">
            <div className="flex items-center justify-center space-x-4 xl:space-x-6 2xl:space-x-8 flex-grow">
              {navItems.map((item) => {
                if (item.auth && !currentUser) return null;
                if (item.text === "MERCHANT" && currentUser) return null;
                const isActive = isActiveRoute(item.path);
                return (
                  <div key={item.text} className="relative">
                    <Link
                      href={item.path}
                      className={`font-inter font-semibold text-sm xl:text-base 2xl:text-lg transition-all duration-300 relative group whitespace-nowrap ${
                        isActive
                          ? "text-teal-400"
                          : "text-gray-300 hover:text-teal-400"
                      }`}
                    >
                      {item.text}
                      <motion.div
                        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center space-x-2 xl:space-x-3 ml-auto">
              {!currentUser ? (
                <>
                  <div>
                    <Link
                      href="/signup"
                      className="font-inter font-semibold text-sm xl:text-base text-gray-200 border border-gray-700 rounded-full px-3 xl:px-5 py-1.5 xl:py-2 transition-all duration-300 relative group overflow-hidden hover:text-white hover:border-teal-400 whitespace-nowrap"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">SIGNUP</span>
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/login"
                      className="inline-block font-inter font-semibold text-sm xl:text-base text-white bg-teal-500 rounded-full px-3 xl:px-5 py-1.5 xl:py-2 transition-all duration-300 relative overflow-hidden group hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25 whitespace-nowrap hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 transition-transform duration-300">
                        LOGIN
                      </span>
                    </Link>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="font-inter font-semibold text-sm xl:text-base text-teal-400 rounded-full px-3 xl:px-5 py-1.5 xl:py-2 transition-all duration-300 relative overflow-hidden group border border-teal-400/50 hover:bg-teal-400/10 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/25 whitespace-nowrap"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">LOGOUT</span>
                </button>
              )}
            </div>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center flex-grow">
            <div className="flex items-center justify-center space-x-3 md:space-x-4 flex-grow">
              {navItems.slice(0, 4).map((item) => {
                if (item.auth && !currentUser) return null;
                if (item.text === "MERCHANT" && currentUser) return null;
                const isActive = isActiveRoute(item.path);
                return (
                  <div key={item.text} className="relative">
                    <Link
                      href={item.path}
                      className={`font-inter font-semibold text-xs md:text-sm transition-all duration-300 relative group whitespace-nowrap ${
                        isActive
                          ? "text-teal-400"
                          : "text-gray-300 hover:text-teal-400"
                      }`}
                    >
                      {item.text === "HELP & SUPPORT" ? "HELP" : item.text}
                      <motion.div
                        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </div>
                );
              })}
              {/* More menu for remaining items on tablet */}
              <button
                className="font-inter font-semibold text-xs md:text-sm text-gray-300 hover:text-teal-400 transition-all duration-300 relative group whitespace-nowrap"
                onClick={toggleMenu}
              >
                MORE
                <motion.div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500 w-0 group-hover:w-full transition-all duration-300" />
              </button>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              {!currentUser ? (
                <>
                  <div>
                    <Link
                      href="/signup"
                      className="font-inter font-semibold text-xs md:text-sm text-gray-200 border border-gray-700 rounded-full px-3 md:px-4 py-1.5 transition-all duration-300 relative group overflow-hidden hover:text-white hover:border-teal-400 whitespace-nowrap"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">SIGNUP</span>
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/login"
                      className="font-inter font-semibold text-xs md:text-sm text-white bg-teal-500 rounded-full px-3 md:px-4 py-1.5 transition-all duration-300 relative overflow-hidden group hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25 whitespace-nowrap"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">LOGIN</span>
                    </Link>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="font-inter font-semibold text-xs md:text-sm text-teal-400 rounded-full px-3 md:px-4 py-1.5 transition-all duration-300 relative overflow-hidden group border border-teal-400/50 hover:bg-teal-400/10 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/25 whitespace-nowrap"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">LOGOUT</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden lg:hidden flex items-center text-white hover:text-teal-400 transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-5 h-4 sm:w-6 sm:h-5 flex flex-col justify-between">
              <motion.span
                initial={false}
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-0.5 bg-current block"
                aria-hidden="true"
              />
              <motion.span
                initial={false}
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-0.5 bg-current block"
                aria-hidden="true"
              />
              <motion.span
                initial={false}
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-0.5 bg-current block"
                aria-hidden="true"
              />
            </div>
          </button>

          {/* Tablet More menu button */}
          <button
            className="hidden md:block lg:hidden text-white hover:text-teal-400 transition-colors duration-300 ml-2"
            onClick={toggleMenu}
            aria-label="Toggle more menu"
            aria-expanded={isOpen}
            aria-controls="tablet-menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <motion.span
                initial={false}
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-0.5 bg-current block"
                aria-hidden="true"
              />
              <motion.span
                initial={false}
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-0.5 bg-current block"
                aria-hidden="true"
              />
              <motion.span
                initial={false}
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-0.5 bg-current block"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (isMobile || isTablet) && (
            <motion.div
              id={isMobile ? "mobile-menu" : "tablet-menu"}
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: { duration: 0.6, ease: "easeInOut" },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: { duration: 0.6, ease: "easeInOut" },
              }}
              className="md:absolute lg:hidden backdrop-blur-md bg-black/30 border-t border-gray-700/50 shadow-xl md:right-0 md:top-full md:w-80 md:rounded-bl-2xl md:border-l md:border-b"
              role="menu"
              aria-label={isMobile ? "Mobile menu" : "Tablet menu"}
            >
              <div className="flex flex-col px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-1">
                {(isTablet ? navItems.slice(4) : navItems).map((item, i) => {
                  if (item.auth && !currentUser) return null;
                  if (item.text === "MERCHANT" && currentUser) return null;
                  const isActive = isActiveRoute(item.path);
                  return (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, y: -10 }}
                      animate={dropdownItemAnimation(i)}
                      role="none"
                      className="relative"
                    >
                      <Link
                        href={item.path}
                        onClick={toggleMenu}
                        className={`font-inter font-medium text-base sm:text-lg md:text-base py-3 sm:py-4 md:py-3 px-3 sm:px-4 block transition-all duration-300 relative group rounded-xl touch-manipulation ${
                          isActive
                            ? "text-teal-400 bg-teal-500/10 border-l-4 border-teal-400 shadow-lg shadow-teal-500/20"
                            : "text-gray-300 hover:text-teal-400 hover:bg-teal-500/5 active:bg-teal-500/15 active:text-teal-300 active:scale-95"
                        }`}
                        role="menuitem"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="relative z-10 font-semibold">
                            {item.text}
                          </span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50"
                            />
                          )}
                        </div>
                        {/* Hover/Active background effect */}
                        <div
                          className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-teal-500/10 to-teal-400/5 opacity-100"
                              : "bg-gradient-to-r from-teal-500/5 to-teal-400/10 opacity-0 group-hover:opacity-100 group-active:opacity-100"
                          }`}
                        />
                        {/* Touch ripple effect */}
                        <div className="absolute inset-0 rounded-xl bg-teal-400/20 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="border-t border-gray-700/50 my-3 sm:my-4" />

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={dropdownItemAnimation(navItems.length)}
                  className="space-y-2"
                  role="none"
                >
                  {currentUser ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="w-full text-left font-inter font-semibold text-base sm:text-lg md:text-base py-3 sm:py-4 md:py-3 px-3 sm:px-4 block text-red-400 transition-all duration-300 relative group rounded-xl touch-manipulation hover:bg-red-500/10 active:bg-red-500/20 active:text-red-300 active:scale-95"
                      role="menuitem"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="relative z-10">LOGOUT</span>
                        <motion.div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-red-400/50 flex items-center justify-center"
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full" />
                        </motion.div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-400/10 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 rounded-xl" />
                      <div className="absolute inset-0 rounded-xl bg-red-400/20 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
                    </button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/signup"
                        onClick={toggleMenu}
                        className="font-inter font-semibold text-base sm:text-lg md:text-base py-3 sm:py-4 md:py-3 px-3 sm:px-4 block text-teal-400 transition-all duration-300 relative group rounded-xl touch-manipulation border-2 border-teal-400/30 hover:border-teal-400/60 hover:bg-teal-500/10 active:bg-teal-500/20 active:text-teal-300 active:scale-95"
                        role="menuitem"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="relative z-10">SIGNUP</span>
                          <motion.div
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-teal-400/50 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-teal-400 rounded-full" />
                          </motion.div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-teal-400/10 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 rounded-xl" />
                        <div className="absolute inset-0 rounded-xl bg-teal-400/20 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
                      </Link>
                      <Link
                        href="/login"
                        onClick={toggleMenu}
                        className="font-inter font-semibold text-base sm:text-lg md:text-base py-3 sm:py-4 md:py-3 px-3 sm:px-4 block text-white bg-teal-500/90 transition-all duration-300 relative group rounded-xl touch-manipulation hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/30 active:bg-teal-600 active:scale-95"
                        role="menuitem"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="relative z-10">LOGIN</span>
                          <motion.div
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center"
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                          </motion.div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-300 opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-all duration-300 rounded-xl" />
                        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
