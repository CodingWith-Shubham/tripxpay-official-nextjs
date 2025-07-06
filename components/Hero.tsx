import { useAuth } from "@/contexts/Auth";
import franceimage from "./Images/france.png";
import laimage from "./Images/losangelos.png";
import morrocoimage from "./Images/morroco.png";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const isLoggedIn = !!currentUser;

  return (
    <div className="relative w-full py-16 md:py-24 px-6 md:px-12 overflow-hidden z-10 mt-10">
      <div className="max-w-4xl mx-auto text-center md:mb-20 z-10">
        <h1 className="font-space-grotesk font-medium md:font-semibold text-2xl md:text-4xl lg:text-5xl mb-4">
          <span className="text-yellow-500">One Platform,</span> Everything You
          Need
          <br />
          For Travel <span className="text-white">Payments...</span>
        </h1>
        <p className="font-inter font-normal md:font-medium text-sm md:text-base lg:text-lg text-gray-400 mb-8">
          Flexible, secure, and built for the future of travel payments
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href={isLoggedIn ? "/verified" : "/signup"}
            className="font-inter font-medium md:font-semibold text-sm md:text-base bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-6 rounded-full"
          >
            GET STARTED
          </Link>
          <Link
            href="/about"
            className="font-inter font-medium md:font-semibold text-sm md:text-base border border-gray-700 hover:border-gray-500 text-white py-2 px-6 rounded-full"
          >
            KNOW ABOUT US
          </Link>
        </div>
      </div>

      {/* Travel stickers */}
      <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl z-0 pointer-events-none">
        <div className="relative h-64">
          <div className="absolute left-20 bottom-10">
            <Image
              src={franceimage}
              alt="LA"
              className="w-36 h-32 object-contain"
            />
          </div>
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2">
            <Image
              src={morrocoimage}
              alt="Colosseum"
              className="w-36 h-32 object-contain"
            />
          </div>
          <div className="absolute right-20 bottom-10">
            <Image
              src={laimage}
              alt="Morocco"
              className="w-36 h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;