"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  XCircle,
  Check,
  AlertCircle,
  Upload,
  Camera,
  FileText,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageUploadAdharPan from "@/components/ImageUploadAdharPan";
import FaceAuthCard from "@/components/FaceAuthCard";
import CameraModal from "@/components/CameraModal";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import TypewriterEffect from "@/components/TypewriterEffect";
import Compressor from "compressorjs";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/Auth";

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "address"
  | "profession"
  | "fatherName";

type DocumentType = {
  type: "pan" | "aadhaar";
  file: File | null;
  status: "pending" | "uploaded" | "verified";
  preview: string | null;
};

type FaceAuth = {
  status: "idle" | "success" | "capturing" | "processing" | "failed";
  attempts: number;
  image: string;
};


// Progress Step Component
const ProgressStep: React.FC<{
  icon: React.ElementType;
  title: string;
  completed: boolean;
  active: boolean;
  description: string;
}> = ({ icon: Icon, title, completed, active, description }) => (
  <motion.div
    className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 ${
      completed
        ? "bg-[#00FFB4]/10 border-[#00FFB4]/30"
        : active
        ? "bg-blue-500/10 border-blue-500/30"
        : "bg-gray-800/50 border-gray-700"
    }`}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div
      className={`p-3 rounded-full ${
        completed
          ? "bg-[#00FFB4] text-gray-900"
          : active
          ? "bg-blue-500 text-white"
          : "bg-gray-700 text-gray-400"
      }`}
    >
      {completed ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
    </div>
    <div className="flex-1">
      <h4
        className={`font-medium ${
          completed
            ? "text-[#00FFB4]"
            : active
            ? "text-blue-400"
            : "text-gray-300"
        }`}
      >
        {title}
      </h4>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </motion.div>
);

// Enhanced Submit Button Component
const SubmitButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  progress: number;
}> = ({ onClick, disabled, loading, progress }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`group relative overflow-hidden px-12 py-4 text-xl font-semibold rounded-xl transition-all duration-300 ${
      loading
        ? "bg-gray-600 cursor-not-allowed"
        : disabled
        ? "bg-gray-700 cursor-not-allowed"
        : "bg-gradient-to-r from-[#00FFB4] to-[#00D4AA] hover:from-[#00D4AA] hover:to-[#00FFB4] text-gray-900 hover:scale-105 hover:shadow-lg hover:shadow-[#00FFB4]/25"
    }`}
    whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
    whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
  >
    {/* Background animation */}
    {!disabled && !loading && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    )}

    <div className="relative flex items-center justify-center gap-3">
      {loading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          <span className="text-gray-300">Processing...</span>
        </>
      ) : (
        <span className={disabled ? "text-gray-400" : "text-gray-900"}>
          Complete Verification
        </span>
      )}
    </div>
  </motion.button>
);

// Add new component for profile picture upload
const ProfilePictureUpload: React.FC<{
  onImageUpload: (img: string) => void;
  currentImage?: string;
}> = ({ onImageUpload, currentImage = "" }) => {
  const [preview, setPreview] = useState(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.3,
        maxWidth: 500,
        maxHeight: 500,
        convertTypes: ["image/png", "image/webp"],
        success(result) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(result);
        },
        error(err) {
          console.error("Compression error:", err);
          reject(err);
        },
      });
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // First try to compress the image
      let compressedImage: string;
      try {
        compressedImage = await compressImage(file);
      } catch (compressionError) {
        console.warn(
          "Compression failed, using original file:",
          compressionError
        );
        // Fallback to original file if compression fails
        compressedImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      }

      setPreview(compressedImage);
      onImageUpload(compressedImage);
    } catch (error) {
      console.error("Error processing profile picture:", error);
      toast.error("Failed to process image. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Profile Picture
      </label>
      <div
        className="relative w-32 h-32 mx-auto cursor-pointer group"
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-[#00FFB4] transition-colors">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />
        {!isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Upload className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      {isLoading && (
        <p className="text-center text-sm text-gray-400 mt-2">
          Optimizing image...
        </p>
      )}
    </div>
  );
};

// Update UserInputFormSection component
const UserInputFormSection: React.FC<{
  phone?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
  profession?: string;
  fatherName?: string;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onAddressChange: (val: string) => void;
  onProfilePictureChange: (val: string) => void;
  onProfessionChange: (val: string) => void;
  onFatherNameChange: (val: string) => void;
}> = ({
  phone,
  name,
  email,
  phoneNumber,
  address,
  profilePicture,
  profession,
  fatherName,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  onProfilePictureChange,
  onProfessionChange,
  onFatherNameChange,
}) => {
  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    phone: phoneNumber || phone || "",
    address: address || "",
    profession: profession || "",
    fatherName: fatherName || "",
  });
  const [validation, setValidation] = useState({
    name: { isValid: false, showSuccess: false, hasError: false },
    email: { isValid: false, showSuccess: false, hasError: false },
    phone: { isValid: false, showSuccess: false, hasError: false },
    address: { isValid: false, showSuccess: false, hasError: false },
    profession: { isValid: false, showSuccess: false, hasError: false },
    fatherName: { isValid: false, showSuccess: false, hasError: false },
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validateEmail = useCallback(
    (email: string) => emailRegex.test(email),
    []
  );
  const validateName = useCallback(
    (name: string) => name.trim().length >= 2,
    []
  );
  const validatePhone = useCallback(
    (phone: string) => phoneRegex.test(phone),
    []
  );
  const validateAddress = useCallback(
    (address: string) => address.trim().length >= 10,
    []
  );
  const validateProfession = useCallback(
    (profession: string) => profession.trim().length >= 2,
    []
  );
  const validateFatherName = useCallback(
    (fatherName: string) => fatherName.trim().length >= 2,
    []
  );

  const handleInputChange = useCallback(
    (field: FieldName, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setValidation((prev) => ({
        ...prev,
        [field]: { ...prev[field], showSuccess: false, hasError: false },
      }));

      if (field === "name") {
        onNameChange(value);
      } else if (field === "email") {
        onEmailChange(value);
      } else if (field === "phone") {
        onPhoneChange(value);
      } else if (field === "address") {
        onAddressChange(value);
      } else if (field === "profession") {
        onProfessionChange(value);
      } else if (field === "fatherName") {
        onFatherNameChange(value);
      }
    },
    [
      onNameChange,
      onEmailChange,
      onPhoneChange,
      onAddressChange,
      onProfessionChange,
      onFatherNameChange,
    ]
  );

  useEffect(() => {
    setFormData({
      name: name || "",
      email: email || "",
      phone: phoneNumber || phone || "",
      address: address || "",
      profession: profession || "",
      fatherName: fatherName || "",
    });

    setValidation((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        isValid: validateName(name ?? ""),
        showSuccess: validateName(name ?? ""),
        hasError: name ? !validateName(name ?? "") : false,
      },
      email: {
        ...prev.email,
        isValid: validateEmail(email ?? ""),
        showSuccess: validateEmail(email ?? ""),
        hasError: email ? !validateEmail(email ?? "") : false,
      },
      phone: {
        ...prev.phone,
        isValid: validatePhone(phoneNumber ?? phone ?? ""),
        showSuccess: validatePhone(phoneNumber ?? phone ?? ""),
        hasError: phoneNumber
          ? !validatePhone(phoneNumber ?? phone ?? "")
          : false,
      },
      address: {
        ...prev.address,
        isValid: validateAddress(address ?? ""),
        showSuccess: validateAddress(address ?? ""),
        hasError: address ? !validateAddress(address ?? "") : false,
      },
      profession: {
        ...prev.profession,
        isValid: validateProfession(profession ?? ""),
        showSuccess: validateProfession(profession ?? ""),
        hasError: profession ? !validateProfession(profession ?? "") : false,
      },
      fatherName: {
        ...prev.fatherName,
        isValid: validateFatherName(fatherName ?? ""),
        showSuccess: validateFatherName(fatherName ?? ""),
        hasError: fatherName ? !validateFatherName(fatherName ?? "") : false,
      },
    }));
  }, [
    name,
    email,
    phoneNumber,
    phone,
    address,
    profession,
    fatherName,
    validateName,
    validateEmail,
    validatePhone,
    validateAddress,
    validateProfession,
    validateFatherName,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="space-y-6">
            {/* Profile Picture Upload */}
            <ProfilePictureUpload
              onImageUpload={onProfilePictureChange}
              currentImage={profilePicture ?? ""}
            />

            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`
                    w-full pl-12 pr-12 py-4 
                    bg-gray-800/50 border-2 rounded-xl
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-0
                    transition-colors duration-200
                    ${
                      validation.name.showSuccess
                        ? "border-[#00FFB4]/50 bg-[#00FFB4]/5"
                        : validation.name.hasError
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-gray-600 focus:border-[#00FFB4]/50"
                    }
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {validation.name.showSuccess && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-[#00FFB4] rounded-full"
                      >
                        <Check className="w-4 h-4 text-gray-900" />
                      </motion.div>
                    )}
                    {validation.name.hasError && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full"
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence>
                {validation.name.hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-400 ml-1"
                  >
                    Please enter a valid name
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className={`
                    w-full pl-12 pr-12 py-4 
                    bg-gray-800/50 border-2 rounded-xl
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-0
                    transition-colors duration-200
                    ${
                      validation.email.showSuccess
                        ? "border-[#00FFB4]/50 bg-[#00FFB4]/5"
                        : validation.email.hasError
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-gray-600 focus:border-[#00FFB4]/50"
                    }
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {validation.email.showSuccess && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-[#00FFB4] rounded-full"
                      >
                        <Check className="w-4 h-4 text-gray-900" />
                      </motion.div>
                    )}
                    {validation.email.hasError && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full"
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence>
                {validation.email.hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-400 ml-1"
                  >
                    Please enter a valid email address
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Phone Input - Now editable */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={`
                    w-full pl-12 pr-12 py-4 
                    bg-gray-800/50 border-2 rounded-xl
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-0
                    transition-colors duration-200
                    ${
                      validation.phone.showSuccess
                        ? "border-[#00FFB4]/50 bg-[#00FFB4]/5"
                        : validation.phone.hasError
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-gray-600 focus:border-[#00FFB4]/50"
                    }
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {validation.phone.showSuccess && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-[#00FFB4] rounded-full"
                      >
                        <Check className="w-4 h-4 text-gray-900" />
                      </motion.div>
                    )}
                    {validation.phone.hasError && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full"
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                  className={`
                    w-full pl-12 pr-12 py-4 
                    bg-gray-800/50 border-2 rounded-xl
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-0
                    transition-colors duration-200
                    resize-none
                    ${
                      validation.address.showSuccess
                        ? "border-[#00FFB4]/50 bg-[#00FFB4]/5"
                        : validation.address.hasError
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-gray-600 focus:border-[#00FFB4]/50"
                    }
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {validation.address.showSuccess && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-[#00FFB4] rounded-full"
                      >
                        <Check className="w-4 h-4 text-gray-900" />
                      </motion.div>
                    )}
                    {validation.address.hasError && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full"
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Add Profession Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profession
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) =>
                    handleInputChange("profession", e.target.value)
                  }
                  placeholder="Enter your profession"
                  className={`
                    w-full pl-12 pr-12 py-4
                    bg-gray-800/50 border-2 rounded-xl
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-0
                    transition-colors duration-200
                    ${
                      validation.profession.showSuccess
                        ? "border-[#00FFB4]/50 bg-[#00FFB4]/5"
                        : validation.profession.hasError
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-gray-600 focus:border-[#00FFB4]/50"
                    }
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {validation.profession.showSuccess && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-[#00FFB4] rounded-full"
                      >
                        <Check className="w-4 h-4 text-gray-900" />
                      </motion.div>
                    )}
                    {validation.profession.hasError && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full"
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence>
                {validation.profession.hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-400 ml-1"
                  >
                    Please enter a valid profession
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Add Father's Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Father's Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) =>
                    handleInputChange("fatherName", e.target.value)
                  }
                  placeholder="Enter your father's name"
                  className={`
                    w-full pl-12 pr-12 py-4
                    bg-gray-800/50 border-2 rounded-xl
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-0
                    transition-colors duration-200
                    ${
                      validation.fatherName.showSuccess
                        ? "border-[#00FFB4]/50 bg-[#00FFB4]/5"
                        : validation.fatherName.hasError
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-gray-600 focus:border-[#00FFB4]/50"
                    }
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {validation.fatherName.showSuccess && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-[#00FFB4] rounded-full"
                      >
                        <Check className="w-4 h-4 text-gray-900" />
                      </motion.div>
                    )}
                    {validation.fatherName.hasError && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full"
                      >
                        <AlertCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence>
                {validation.fatherName.hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-400 ml-1"
                  >
                    Please enter a valid name
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function VerificationDashboard() {
  const router = useRouter();

  // Local state for user info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profession, setProfession] = useState("");
  const [fatherName, setFatherName] = useState("");

  // Dummy user for demo
  const authcontext = useAuth();
  const currentUser = authcontext?.currentUser;

  const [overalllSteps, setOverAllSteps] = useState(0);
  console.log("steps: ", overalllSteps);

  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<DocumentType[]>([
    { type: "pan", file: null, status: "pending", preview: null },
    { type: "aadhaar", file: null, status: "pending", preview: null },
  ]);
  const [verify, setVerify] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [faceAuth, setFaceAuth] = useState<FaceAuth>({
    status: "idle",
    attempts: 0,
    image: "",
  });
  const [showCamera, setShowCamera] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate overall progress including personal info
  const calculateOverallSteps = useCallback(() => {
    let stepCount = 0;

    if (name.trim().length >= 2) stepCount += 1;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) stepCount += 1;
    if (phoneNumber && /^[0-9]{10}$/.test(phoneNumber)) stepCount += 1;
    if (address && address.trim().length >= 10) stepCount += 1;
    if (profilePicture) stepCount += 1;
    if (profession && profession.trim().length >= 2) stepCount += 1;
    if (fatherName && fatherName.trim().length >= 2) stepCount += 1;

    // Document steps (2 steps)
    if (documents[0]?.preview) stepCount += 1;
    if (documents[1]?.preview) stepCount += 1;

    // Face authentication (1 step)
    if (faceAuth.status === "success") stepCount += 1;

    return stepCount;
  }, [
    name,
    email,
    phoneNumber,
    address,
    profilePicture,
    profession,
    fatherName,
    documents,
    faceAuth.status,
  ]);

  // Calculate steps whenever dependencies change
  useEffect(() => {
    const steps = calculateOverallSteps();
    setOverAllSteps(steps);
  }, [calculateOverallSteps]);

  // Get verification steps for progress display

  // Function to check verification status from localStorage
  const checkLocalVerificationStatus = useCallback(() => {
    if (!currentUser?.uid) return;

    const verificationStatus = localStorage.getItem(
      `verification_status_${currentUser.uid}`
    );

    if (verificationStatus) {
      const statusData = JSON.parse(verificationStatus);
      console.log("Found verification status in localStorage:", statusData);

      // Check if status is pending, rejected, or verified
      if (["pending", "rejected", "verified"].includes(statusData.status)) {
        console.log(
          `Verification status is ${statusData.status}, redirecting to /verified`
        );
        toast.success("Documents already uploaded", {
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #00FFB4",
          },
        });
        router.push("/verified");
      }
    } else {
      console.log(
        "No verification status found in localStorage, staying on dashboard"
      );
    }
  }, [currentUser, router]);

  const cleanupCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
      console.log("Camera stream stopped and cleaned up");
    }
  }, []);

  const startFaceAuth = useCallback(async () => {
    console.log("Starting face authentication...");
    setFaceAuth((prev) => ({ ...prev, status: "capturing" }));
    setShowCamera(true);
    setErrorMessage("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = resolve;
        });
        console.log("Camera stream started successfully");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setFaceAuth((prev) => ({ ...prev, status: "failed" }));
      setShowCamera(false);
      const errorMsg =
        "Camera access denied. Please allow camera permissions and try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        style: {
          background: "#1f2937",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
        },
      });
    }
  }, []);

  const captureFace = useCallback(async () => {
    console.log("Capturing face image...");
    if (!videoRef.current || !canvasRef.current) {
      toast.error("Camera not ready. Please try again.", {
        position: "top-right",
      });
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Canvas not supported. Please try a different browser.", {
        position: "top-right",
      });
      return;
    }

    try {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0);

      // Convert canvas to base64
      const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);
      console.log(
        "Face image captured successfully, size:",
        imageBase64.length
      );

      setFaceAuth((prev) => ({
        ...prev,
        status: "processing",
        image: imageBase64,
      }));

      // Simulate face verification process
      setTimeout(() => {
        console.log("Face verification completed successfully");
        setFaceAuth((prev) => ({
          ...prev,
          status: "success",
          attempts: prev.attempts + 1,
        }));
        setShowCamera(false);
        cleanupCamera();
        toast.success("Face verification completed successfully!", {
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#00FFB4",
            border: "1px solid #00FFB4",
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Error capturing face:", error);
      setFaceAuth((prev) => ({ ...prev, status: "failed" }));
      toast.error("Failed to capture image. Please try again.", {
        position: "top-right",
      });
    }
  }, [cleanupCamera]);

  const handleFileUpload = useCallback(
    async (type: string, file: File | null, previewUrl: string | null) => {
      console.log(`File upload handler called for ${type}:`, {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        previewLength: previewUrl?.length,
      });

      // Check if we have either a file or previewUrl
      if (!file && !previewUrl) {
        console.error("No file or preview data provided");
        toast.error("Failed to process image. Please try again.", {
          position: "top-right",
        });
        return;
      }

      try {
        let finalPreview = previewUrl;

        // If we have a file, compress it
        if (file) {
          // Create a promise-based compression function
          const compressImage = (inputFile: File) => {
            return new Promise<string>((resolve, reject) => {
              new Compressor(inputFile, {
                quality: 0.3,
                maxWidth: 500,
                convertTypes: ["image/png", "image/webp"], // Convert to JPEG for better compression
                success(result) {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = (error) => reject(error);
                  reader.readAsDataURL(result);
                },
                error(err) {
                  console.error("Compression error:", err);
                  reject(err);
                },
              });
            });
          };

          try {
            finalPreview = await compressImage(file);
          } catch (compressionError) {
            console.warn(
              "Compression failed, using original file:",
              compressionError
            );
            // Fallback: create preview from original file if compression fails
            finalPreview = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
              reader.readAsDataURL(file);
            });
          }
        }

        // Update the documents state
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.type === type
              ? {
                  ...doc,
                  file: file || doc.file, // Keep existing file if no new file provided
                  status: "uploaded",
                  preview: finalPreview,
                }
              : doc
          )
        );

        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } card uploaded successfully!`,
          {
            position: "top-right",
            style: {
              background: "#1f2937",
              color: "#00FFB4",
              border: "1px solid #00FFB4",
            },
          }
        );

        console.log(`Document ${type} updated successfully`);
      } catch (error) {
        console.error("File upload error:", error);
        toast.error("Failed to process image. Please try again.", {
          position: "top-right",
        });
      }
    },
    []
  );

  const validateDocuments = useCallback(
    (documents: DocumentType[], faceAuth: FaceAuth) => {
      console.log("Validating documents and face auth...");
      const errors = [];

      const documentStatus = documents.map((doc) => ({
        type: doc.type,
        status: doc.status,
        hasFile: !!doc.file,
        hasPreview: !!doc.preview,
      }));

      console.log("Documents status:", documentStatus);
      console.log("Face auth status:", faceAuth.status);

      const allDocsUploaded = documents.every(
        (doc) => doc.status === "uploaded"
      );
      if (!allDocsUploaded) {
        errors.push("Please upload both PAN and Aadhaar cards");
      }

      // Strict face verification check
      if (faceAuth.status !== "success") {
        errors.push("Face verification is required to complete the process");
      }

      console.log("Validation errors:", errors);
      return errors;
    },
    []
  );

  // Add this new function inside VerificationDashboard component
  const simulateProgress = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 90) {
        progress = 90; // Cap at 90% until backend responds
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 500);
    return interval;
  }, []);

  // Update the handleSubmit function
  const handleSubmit = async () => {
    console.log("=== HANDLE SUBMIT STARTED ===");
    console.log("Current context values:", {
      name,
      email,
      phoneNumber,
      profession,
      fatherName,
    });

    if (!currentUser?.uid) {
      console.error("No current user found");
      toast.error("Please login to continue verification", {
        position: "top-right",
      });
      return;
    }

    const validationErrors = validateDocuments(documents, faceAuth);
    if (validationErrors.length > 0) {
      console.error("Validation failed:", validationErrors);
      toast.error(validationErrors.join(". "), { position: "top-right" });
      setErrorMessage(validationErrors.join(". "));
      return;
    }

    console.log("Validation passed, starting verification submission...");
    setVerify(true);
    setErrorMessage("");
    setSuccessMessage("");
    setUploadProgress(0);

    // Start progress simulation
    const progressInterval = simulateProgress();

    try {
      // Ensure user is authenticated
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      console.log({
        displayName: name,
        email,
        photoURL: currentUser?.photoURL,
        uid: currentUser?.uid,
        pan: documents[0]?.preview,
        aadhaar: documents[1]?.preview,
        faceImage: faceAuth.image,
        emailVerified: currentUser?.emailVerified,
        address,
        profilePicture,
        phoneNumber,
        profession,
        fatherName,
      });

      // 1. Await the fetch and response
      const response = await fetch("/api/uploaddocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: name,
          email,
          photoURL: currentUser?.photoURL,
          uid: currentUser?.uid,
          pan: documents[0]?.preview,
          aadhaar: documents[1]?.preview,
          faceImage: faceAuth.image,
          emailVerified: currentUser?.emailVerified,
          address,
          profilePicture,
          phoneNumber,
          profession,
          fatherName,
        }),
      });

      // 2. Parse the JSON response
      const result = await response.json();

      // 3. Show toast and handle navigation
      if (response.ok && result.success) {
        toast.success("Documents submitted successfully! Redirecting...", {
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#00FFB4",
            border: "1px solid #00FFB4",
          },
        });
        setSuccessMessage("Documents submitted successfully!");
        setUploadProgress(100);
        setTimeout(() => {
          router.push("/verified");
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to upload documents.");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to submit verification.");
      toast.error(error.message || "Failed to submit verification.", {
        position: "top-right",
      });
    } finally {
      setVerify(false);
      clearInterval(progressInterval);
    }
  };

  const handleCloseCamera = useCallback(() => {
    console.log("Closing camera...");
    setShowCamera(false);
    setFaceAuth((prev) => ({ ...prev, status: "idle" }));
    cleanupCamera();
  }, [cleanupCamera]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]);

  // Clear error message after some time
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }, [errorMessage]);

  // Clear success message after some time
  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [successMessage]);

  // Check verification status from localStorage on component mount
  useEffect(() => {
    checkLocalVerificationStatus();
  }, [checkLocalVerificationStatus]);

  // Add this useEffect at the top level of the component
  useEffect(() => {
    if (currentUser?.uid) {
      const verificationData = localStorage.getItem(
        `verification_data_${currentUser.uid}`
      );
      if (verificationData) {
        const data = JSON.parse(verificationData);
        if (data.status === "pending" || data.status === "verified") {
          router.push("/verified");
        }
      }
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner
          size="large"
          text="Please login to access verification."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Sticky Progress Bar for Mobile */}
      <div className="lg:hidden sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-300">
              Verification Progress
            </div>
            <div className="text-[#00FFB4] font-bold">{overalllSteps}/10</div>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00FFB4] to-[#00D4AA]"
              initial={{ width: 0 }}
              animate={{ width: `${overalllSteps * 10}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-500/20 rounded-full filter blur-3xl animate-pulse delay-500" />

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#00FFB4]/30 rounded-full animate-bounce delay-300" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-yellow-400/40 rounded-full animate-bounce delay-700" />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-bounce delay-1000" />
      </div>

      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-[#00ffb4]/10 border border-[#00ffb4]/20 rounded-full px-6 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="w-5 h-5 text-[#00ffb4]" />
              <span className="text-[#00ffb4] font-medium">
                Secure Verification
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Complete Your{" "}
              <span className="text-gradient-green-to-yellow bg-gradient-to-r from-[#00FFB4] to-[#FFD700] bg-clip-text text-transparent">
                Verification
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Secure your account with our advanced verification system. Upload
              your documents and complete face authentication for enhanced
              security.
            </p>
          </motion.div>
          {/* Enhanced Verification Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white flex items-center gap-3 text-2xl font-bold">
                      <Shield className="w-6 h-6 text-[#00ffb4]" />
                      Verification Progress
                    </h3>
                    <p className="text-gray-400">
                      Complete all steps to verify your account
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#00ffb4]">
                      {overalllSteps}/10
                    </div>
                    <div className="text-sm text-gray-400">Complete</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00FFB4] to-[#00D4AA] rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${overalllSteps * 10}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* User Input Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <UserInputFormSection
              name={name}
              email={email}
              phoneNumber={phoneNumber}
              address={address}
              profilePicture={profilePicture}
              profession={profession}
              fatherName={fatherName}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPhoneChange={setPhoneNumber}
              onAddressChange={setAddress}
              onProfilePictureChange={setProfilePicture}
              onProfessionChange={setProfession}
              onFatherNameChange={setFatherName}
            />
          </motion.div>

          {/* Verification Cards */}
          <div className="verification-card-container grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {/* Document Upload Cards */}
            {documents.map((doc, index) => (
              <motion.div
                key={doc.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <ImageUploadAdharPan
                  type={doc.type}
                  status={doc.status}
                  onFileUpload={handleFileUpload}
                />
              </motion.div>
            ))}

            {/* Face Authentication Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <FaceAuthCard
                faceAuth={faceAuth}
                onStartFaceAuth={startFaceAuth}
              />
            </motion.div>
          </div>

          {/* Submit Button Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center space-y-6"
          >
            {/* Upload Progress during submission */}
            <AnimatePresence>
              {verify && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md mx-auto"
                >
                  <LoadingSpinner
                    size="large"
                    text="Uploading your documents..."
                  />
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Upload Progress</span>
                      <span className="text-[#00FFB4] font-medium">
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#00FFB4] to-[#00D4AA]"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Please wait while we securely process your documents...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            {!verify && (
              <SubmitButton
                onClick={handleSubmit}
                disabled={overalllSteps < 10 || faceAuth.status !== "success"}
                loading={verify}
                progress={uploadProgress}
              />
            )}
          </motion.div>

          {/* Enhanced Error/Success Messages */}
          <AnimatePresence>
            {(errorMessage || successMessage) && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="w-full flex justify-center mt-8"
              >
                <div
                  className={`p-6 rounded-2xl flex items-center gap-4 max-w-md backdrop-blur-sm border ${
                    successMessage
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : "bg-red-500/20 border-red-500/30 text-red-400"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      successMessage ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    {successMessage ? (
                      <Check className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {successMessage ? "Success!" : "Error occurred"}
                    </p>
                    <p className="text-sm opacity-90">
                      {successMessage || errorMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera Modal */}
          <AnimatePresence>
            {showCamera && (
              <CameraModal
                showCamera={showCamera}
                onClose={handleCloseCamera}
                videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
                faceAuth={faceAuth}
                onCapture={captureFace}
              />
            )}
          </AnimatePresence>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-center mb-8">
                <AlertCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Verification Tips
                </h3>
                <p className="text-gray-400">
                  Follow these guidelines for successful verification
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FileText className="w-8 h-8 text-[#00FFB4] mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">
                    Clear Documents
                  </h4>
                  <p className="text-sm text-gray-400">
                    Ensure your documents are well-lit, clear, and all text is
                    readable
                  </p>
                </motion.div>

                <motion.div
                  className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Camera className="w-8 h-8 text-[#00FFB4] mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">
                    Good Lighting
                  </h4>
                  <p className="text-sm text-gray-400">
                    Use good lighting for face verification and avoid shadows
                  </p>
                </motion.div>

                <motion.div
                  className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Shield className="w-8 h-8 text-[#00FFB4] mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">
                    Privacy First
                  </h4>
                  <p className="text-sm text-gray-400">
                    Your data is encrypted and processed securely following
                    privacy standards
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-[#00FFB4]" />
              <span className="text-sm text-gray-300">
                256-bit SSL encryption • Privacy protected • GDPR compliant
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
