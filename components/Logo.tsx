import logo from '@/public/logo.svg';
import Image from 'next/image';
const Logo = ({ className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <Image src={logo} alt="Logo" width={40} height={40} /> 
    <span className="font-space-grotesk font-semibold md:font-bold text-[23px] md:text-2xl lg:text-3xl ml-2">
      TripxPay
    </span>
  </div>
);

export default Logo;
