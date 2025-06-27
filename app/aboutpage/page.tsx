import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";

const AboutPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Faster stagger
        delayChildren: 0.1, // Reduced delay
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }, // Faster duration
    },
  };

  // Custom variant for Core Values section - faster animations
  const coreValuesVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Much faster stagger
        delayChildren: 0.05, // Reduced delay
        when: "beforeChildren",
      },
    },
  };

  // Enhanced item variants for core values with more transitions
  const coreValueItemVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 120,
        damping: 15,
      },
    },
  };

  // Custom variant for Leadership section - appears after Core Values
  const leadershipVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const leaderItemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background glows - same as home page */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />

      {/* Optional grid dots background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <PageHeader
          title="About TripxPay"
          description="We're revolutionizing how travel agencies handle payments, making it easier, safer, and more efficient. Our platform streamlines the entire payment process, reduces transaction costs, eliminates currency conversion headaches, and provides unparalleled security and fraud protection. With TripxPay, travel agencies can focus on creating exceptional experiences while we handle the financial complexities."
        />

        <div className="flex-grow py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="text-2xl font-bold mb-4 text-yellow-500">
                  Our Mission
                </h2>
                <p className="text-gray-300 mb-4">
                  At TripxPay, our mission is to transform the travel payment
                  landscape by providing innovative, secure, and flexible
                  payment solutions that empower travel agencies to grow their
                  business without financial constraints.
                </p>
                <p className="text-gray-300">
                  We believe that travel agencies should focus on creating
                  amazing experiences for their clients, not worrying about
                  payment processing, cash flow, or financial risk.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-yellow-500">
                  Our Story
                </h2>
                <p className="text-gray-300 mb-4">
                  Founded in 2025 by a team of travel industry veterans and
                  fintech experts, TripxPay was born out of the recognition that
                  traditional payment methods were failing travel agencies.
                </p>
                <p className="text-gray-300">
                  We've since grown to serve hundreds of forward-thinking travel
                  agencies across the globe, processing millions in travel
                  payments and helping our clients focus on what they do best:
                  creating unforgettable travel experiences.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={coreValuesVariants}
            >
              <motion.h2
                className="text-2xl font-bold mb-6 text-center"
                variants={itemVariants}
              >
                Our Core Values
              </motion.h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
              >
                {[
                  {
                    title: "Innovation",
                    description:
                      "We constantly push the boundaries of what's possible in travel payments, developing new solutions to old problems.",
                  },
                  {
                    title: "Security",
                    description:
                      "We prioritize the security of our clients' data and financial transactions above all else, implementing bank-level security measures.",
                  },
                  {
                    title: "Customer Success",
                    description:
                      "We measure our success by the success of our clients. Their growth is our growth.",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800/50"
                    variants={coreValueItemVariants}
                    custom={index}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      borderColor: "rgba(20, 184, 166, 0.3)",
                      transition: { duration: 0.3 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.h3
                      className="text-xl font-bold mb-3 text-teal-500"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    >
                      {value.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    >
                      {value.description}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={leadershipVariants}
              className="mt-24"
            >
              <motion.h2
                className="text-2xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Leadership Team
              </motion.h2>
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {[
                  {
                    name: "Mukul Kaushik",
                    title: "Founder",
                    bio: "Former travel agency owner with 3+ years in the industry.",
                  },
                  {
                    name: "Shivansh Pandey",
                    title: "Co-Founder",
                    bio: "Fintech expert with experience at leading payment processors.",
                  },
                ].map((person, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    variants={leaderItemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.5 } }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.3 + 0.2,
                      type: "spring" as const,
                      stiffness: 100,
                    }}
                  >
                    <motion.div
                      className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "#134e4a",
                        transition: { duration: 0.3 },
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.3 + 0.5 }}
                    >
                      <span className="text-4xl text-teal-500">
                        {person.name.charAt(0)}
                      </span>
                    </motion.div>
                    <motion.h3
                      className="text-lg font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.3 + 0.7 }}
                    >
                      {person.name}
                    </motion.h3>
                    <motion.p
                      className="text-teal-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.3 + 0.8 }}
                    >
                      {person.title}
                    </motion.p>
                    <motion.p
                      className="text-gray-400 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.3 + 0.9 }}
                    >
                      {person.bio}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
