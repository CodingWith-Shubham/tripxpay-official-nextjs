"use client";
import { motion, Variants } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  }),
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />

      {/* Grid dots background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar />
        <PageHeader
          title="About TripxPay"
          description="We're revolutionizing how travel agencies handle payments, making it easier, safer, and more efficient. Our platform streamlines the entire payment process, reduces transaction costs, eliminates currency conversion headaches, and provides unparalleled security and fraud protection. With TripxPay, travel agencies can focus on creating exceptional experiences while we handle the financial complexities."
        />

        <div className="flex-grow py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">

            {/* Mission & Story */}
            <motion.div
              variants={containerStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
            >
              {[
                {
                  heading: "Our Mission",
                  content: [
                    "At TripxPay, our mission is to transform the travel payment landscape by providing innovative, secure, and flexible payment solutions that empower travel agencies to grow their business without financial constraints.",
                    "We believe that travel agencies should focus on creating amazing experiences for their clients, not worrying about payment processing, cash flow, or financial risk.",
                  ],
                },
                {
                  heading: "Our Story",
                  content: [
                    "Founded in 2025 by a team of travel industry veterans and fintech experts, TripxPay was born out of the recognition that traditional payment methods were failing travel agencies.",
                    "We've since grown to serve hundreds of forward-thinking travel agencies across the globe, processing millions in travel payments and helping our clients focus on what they do best: creating unforgettable travel experiences.",
                  ],
                },
              ].map((section, i) => (
                <motion.div key={i} custom={i} variants={fadeInUp}>
                  <h2 className="text-2xl font-bold mb-4 text-yellow-500">
                    {section.heading}
                  </h2>
                  {section.content.map((text, idx) => (
                    <p key={idx} className="text-gray-300 mb-4">
                      {text}
                    </p>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* Core Values */}
            <motion.div
              className="mb-16 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold mb-6">Our Core Values</h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerStagger}
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
                    custom={index}
                    variants={fadeInUp}
                  >
                    <h3 className="text-xl font-bold mb-3 text-teal-500">
                      {value.title}
                    </h3>
                    <p className="text-gray-300">{value.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Leadership */}
            <motion.div
              className="mt-24 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold mb-6">Our Leadership Team</h2>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto"
                variants={containerStagger}
              >
                {[
                  {
                    name: "Mukul",
                    title: "Founder",
                    bio: "Former travel agency owner with 3+ years in the industry.",
                  },
                  {
                    name: "Shubham",
                    title: "Co-Founder",
                    bio: "Fintech expert with experience at leading payment processors.",
                  },
                ].map((person, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    custom={index}
                    variants={fadeInUp}
                  >
                    <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl text-teal-500">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{person.name}</h3>
                    <p className="text-teal-500 mb-2">{person.title}</p>
                    <p className="text-gray-400 text-sm">{person.bio}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
       <Footer />
    </div>
  
  );
};

export default AboutPage;
