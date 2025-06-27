import { FC } from "react";
import { CreditCard, Users, ShieldCheck } from "lucide-react";
import Image from "next/image";

type MerchantCardProps = {
  data: {
    companyName: string;
    displayName: string;
    [key: string]: any;
  };
  photoUrl?: string;
  status: "approved" | "pending" | string;
};

export const MerchantCard: FC<MerchantCardProps> = ({
  data,
  photoUrl,
  status,
}) => {
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full text-white p-4 sm:p-6 md:p-12">
      <div className="flex items-center space-x-4 max-w-4xl mx-auto">
        {photoUrl && (
          <Image
            src={photoUrl}
            alt="Logo"
            className="rounded-full"
            width={64}
            height={64}
            style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
            priority
          />
        )}
        <div className="flex justify-around ">
          <div>
            <h2 className="text-xl font-bold text-white">{data.companyName}</h2>
            <p className="text-white">{data.displayName}</p>
          </div>
        </div>
        <div className="ml-auto">{getStatusDisplay(status)}</div>
      </div>

      <div className="mt-8 md:mt-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-teal-400 mb-4">
            Unlock Your Merchant Dashboard
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Once your account is verified, you'll gain access to powerful tools
            to grow your business with
            <span className="inline-flex items-center align-middle ml-2">
              <Image
                src="/logo.svg"
                alt="TripxPay logo"
                width={32}
                height={32}
                className="h-8 w-auto mr-1"
                priority
              />
              <strong className="font-semibold">TripxPay.</strong>
            </span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-4 text-left">
            <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-700">
              <CreditCard className="w-8 h-8 text-teal-400 mb-4" />
              <h4 className="font-bold text-white mb-2">Invite Links</h4>
              <p className="text-sm text-gray-400">
                Generate unique links to securely connect with your customers.
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-700">
              <Users className="w-8 h-8 text-teal-400 mb-4" />
              <h4 className="font-bold text-white mb-2">Consumer Management</h4>
              <p className="text-sm text-gray-400">
                View and manage all your connected customers in one place.
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-700">
              <ShieldCheck className="w-8 h-8 text-teal-400 mb-4" />
              <h4 className="font-bold text-white mb-2">Verified Status</h4>
              <p className="text-sm text-gray-400">
                Build trust with a verified badge on your profile.
              </p>
            </div>
          </div>
          <p className="text-gray-400 mt-6 md:mt-8 text-sm">
            Your application is currently being reviewed. You will be notified
            by email once the process is complete.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantCard;
