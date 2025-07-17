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
  CheckCircle,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/Auth";
import { toast } from "sonner";

type LoadingSpinnerProps = {
  size?: "small" | "medium" | "large" | "xlarge";
  text?: string;
};

// Enhanced Loading Spinner Component
const LoadingSpinner = ({
  size = "medium",
  text = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
    xlarge: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Outer spinning ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-gray-600 border-t-[#00FFB4] rounded-full animate-spin`}
        />
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-[#00FFB4] rounded-full animate-pulse" />
        </div>
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

type ProgressStepProps = {
  icon: React.ElementType;
  title: string;
  completed: boolean;
  active: boolean;
  description: string;
};

// Progress Step Component
const ProgressStep = ({
  icon: Icon,
  title,
  completed,
  active,
  description,
}: ProgressStepProps) => (
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

type SubmitButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  loading: boolean;
  progress: number;
};

// Enhanced Submit Button Component
const SubmitButton = ({
  onClick,
  disabled,
  loading,
  progress,
}: SubmitButtonProps) => (
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
const ProfilePictureUpload = ({
  onImageUpload,
  currentImage,
}: {
  onImageUpload: (image: string | undefined) => void;
  currentImage: string | undefined;
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image =
          typeof reader.result === "string" ? reader.result : undefined;
        setPreview(base64Image);
        onImageUpload(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Profile Picture
      </label>
      <div
        className="relative w-32 h-32 mx-auto cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
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
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

type UserInputFormSectionProps = {
  phone?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePicture: string | undefined;
  companyName: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onProfilePictureChange: (value: string | undefined) => void;
  onCompanyNameChange: (value: string) => void;
};

// Update UserInputFormSection component
const UserInputFormSection = ({
  phone,
  name,
  email,
  phoneNumber,
  address,
  profilePicture,
  companyName,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  onProfilePictureChange,
  onCompanyNameChange,
}: UserInputFormSectionProps) => {
  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    phone: phoneNumber || phone || "",
    address: address || "",
    companyName: companyName || "",
  });

  const [validation, setValidation] = useState({
    name: { isValid: false, showSuccess: false, hasError: false },
    email: { isValid: false, showSuccess: false, hasError: false },
    phone: { isValid: false, showSuccess: false, hasError: false },
    address: { isValid: false, showSuccess: false, hasError: false },
    companyName: { isValid: false, showSuccess: false, hasError: false },
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validateEmail = useCallback((email: string) => {
    if (!email) return false;
    return emailRegex.test(email);
  }, []);

  const validateName = useCallback((name: string) => {
    if (!name) return false;
    return name.trim().length >= 2;
  }, []);

  const validatePhone = useCallback((phone: string | number) => {
    if (!phone) return false;
    return phoneRegex.test(String(phone));
  }, []);

  const validateAddress = useCallback((address: string) => {
    if (!address) return false;
    return address.trim().length >= 10;
  }, []);

  const validateCompanyName = useCallback((companyName: string) => {
    if (!companyName) return false;
    return companyName.trim().length >= 2;
  }, []);

  type FieldName = "name" | "email" | "phone" | "address" | "companyName";

  const handleInputChange = useCallback(
    (field: FieldName, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      setValidation((prev) => ({
        ...prev,
        [field]: { ...prev[field], showSuccess: false, hasError: false },
      }));

      // Add null checks for all handlers
      switch (field) {
        case "name":
          onNameChange?.(value);
          break;
        case "email":
          onEmailChange?.(value);
          break;
        case "phone":
          onPhoneChange?.(value);
          break;
        case "address":
          onAddressChange?.(value);
          break;
        case "companyName":
          onCompanyNameChange?.(value);
          break;
        default:
          console.warn(`No handler for field: ${field}`);
      }
    },
    [
      onNameChange,
      onEmailChange,
      onPhoneChange,
      onAddressChange,
      onCompanyNameChange,
    ]
  );

  useEffect(() => {
    setFormData({
      name: name || "",
      email: email || "",
      phone: phoneNumber || phone || "",
      address: address || "",
      companyName: companyName || "",
    });

    setValidation((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        isValid: validateName(name || ""),
        showSuccess: validateName(name || ""),
        hasError: name ? !validateName(name) : false,
      },
      email: {
        ...prev.email,
        isValid: validateEmail(email || ""),
        showSuccess: validateEmail(email || ""),
        hasError: email ? !validateEmail(email) : false,
      },
      phone: {
        ...prev.phone,
        isValid: validatePhone(phoneNumber || ""),
        showSuccess: validatePhone(phoneNumber || ""),
        hasError: phoneNumber ? !validatePhone(phoneNumber) : false,
      },
      address: {
        ...prev.address,
        isValid: validateAddress(address || ""),
        showSuccess: validateAddress(address || ""),
        hasError: address ? !validateAddress(address) : false,
      },
      companyName: {
        ...prev.companyName,
        isValid: validateCompanyName(companyName || ""),
        showSuccess: validateCompanyName(companyName || ""),
        hasError: companyName ? !validateCompanyName(companyName) : false,
      },
    }));
  }, [
    name,
    email,
    phoneNumber,
    phone,
    address,
    companyName,
    validateName,
    validateEmail,
    validatePhone,
    validateAddress,
    validateCompanyName,
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
              currentImage={profilePicture}
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

            {/* Company Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  placeholder="Enter your company name"
                  className={`
                    w-full pl-12 pr-12 py-4
                    bg-gray-800/50 border-2 rounded-xl
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-0
                    transition-colors duration-200
                    ${
                      validation.companyName.showSuccess
                        ? "border-[#00FFB4]/50 bg-[#00FFB4]/5"
                        : validation.companyName.hasError
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-gray-600 focus:border-[#00FFB4]/50"
                    }
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {validation.companyName.showSuccess && (
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
                    {validation.companyName.hasError && (
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
                {validation.companyName.hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-400 ml-1"
                  >
                    Please enter a valid company name
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

type DocumentType = "msme" | "gst";
type DocumentStatus = "pending" | "uploaded" | "verified";

type Document = {
  type: DocumentType;
  file: File | null;
  status: DocumentStatus;
  preview: any;
};

type DocumentUploadCardProps = {
  type: DocumentType;
  status: DocumentStatus;
  onFileUpload?: (type: DocumentType, file: File | null, preview: any) => void;
};

// Document Upload Card Component
const DocumentUploadCard = ({
  type,
  status,
  onFileUpload = () => {},
}: DocumentUploadCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<
    | string
    | { name: string; type: string; size: number; lastModified: number }
    | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem(`doc_${type}`);
    if (savedImage) {
      setPreview(savedImage);
      // Only call onFileUpload if status is still pending
      if (status === "pending" && onFileUpload) {
        onFileUpload(type, null, savedImage);
      }
    }
  }, [type]); // Removed onFileUpload from dependencies to prevent infinite loops

  const validateFile = useCallback((file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!file) {
      setError("No file selected");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid file (PNG, JPG, JPEG, PDF)");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size should be less than 5MB");
      return false;
    }

    if (file.size < 1024) {
      // Minimum 1KB
      setError("File is too small. Please upload a valid document");
      return false;
    }

    setError("");
    return true;
  }, []);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!validateFile(file)) {
        return;
      }

      setIsUploading(true);
      setError("");

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const fileData = e.target?.result;
          if (!fileData) {
            throw new Error("Failed to read file data");
          }

          if (typeof fileData === "string") {
            localStorage.setItem(`doc_${type}`, fileData);
            setPreview(fileData);
          }

          // Call parent handler
          if (onFileUpload) {
            onFileUpload(type, file, fileData);
          }
        } catch (error) {
          console.error("Error processing file:", error);
          setError("Error processing file. Please try again.");
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        console.error("FileReader error");
        setError("Error reading file. Please try again.");
        setIsUploading(false);
      };

      if (file.type.includes("image")) {
        reader.readAsDataURL(file);
      } else {
        // For PDF files, we'll just store the file object
        const fileObj = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };
        localStorage.setItem(`doc_${type}`, JSON.stringify(fileObj));
        setPreview(fileObj);
        onFileUpload(type, file, fileObj);
        setIsUploading(false);
      }
    },
    [validateFile, onFileUpload, type]
  );

  const handleFileSelect = useCallback(
    (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      // Reset the input value to allow selecting the same file again
      if (e.target) {
        e.target.value = "";
      }
    },
    [handleFileUpload]
  );

  const clearUpload = useCallback(() => {
    localStorage.removeItem(`doc_${type}`);
    setPreview(null);
    setError("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Notify parent that file was removed
    if (onFileUpload) {
      onFileUpload(type, null, null);
    }
  }, [type, onFileUpload]);

  const triggerFileSelect = useCallback(() => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  }, [isUploading]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  const documentName = type === "msme" ? "MSME Certificate" : "GST Certificate";
  const hasUpload = status === "uploaded" || status === "verified" || preview;

  return (
    <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-lg h-full">
      <div className="p-6">
        <div className="text-white flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-400" />
            {documentName}
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === "verified"
                ? "bg-[#00ffb4] text-gray-900"
                : status === "uploaded"
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
            {status === "uploaded" && <AlertCircle className="w-3 h-3 mr-1" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Upload your {documentName.toLowerCase()} for verification
        </p>
      </div>

      <div className="px-6 pb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
            error
              ? "border-red-500/50 bg-red-500/5"
              : hasUpload
              ? "border-[#00ffb4]/50 bg-[#00ffb4]/5"
              : "border-gray-700 hover:border-[#00ffb4]/50"
          }`}
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Upload Success State */}
          {hasUpload && preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                {typeof preview === "string" &&
                preview.startsWith("data:image/") ? (
                  <img
                    src={preview}
                    alt={`${type} preview`}
                    className="max-h-32 max-w-full mx-auto rounded-lg shadow-lg"
                    onError={() => {
                      setError("Failed to load image preview");
                      setPreview(null);
                    }}
                  />
                ) : (
                  <div className="max-h-32 max-w-full mx-auto rounded-lg shadow-lg bg-gray-800 p-4 flex flex-col items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-300 truncate w-full text-center">
                      {typeof preview === "object" &&
                      preview !== null &&
                      "name" in preview
                        ? preview.name
                        : "Document"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof preview === "object" &&
                      preview !== null &&
                      "size" in preview
                        ? Math.round(preview.size / 1024) + " KB"
                        : ""}
                    </p>
                  </div>
                )}
                <button
                  onClick={clearUpload}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  title="Remove document"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#00ffb4] font-medium">
                  Document uploaded successfully
                </p>
                <button
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all duration-300 ${
                    isUploading
                      ? "border-gray-600 text-gray-400 cursor-not-allowed"
                      : "border-[#00ffb4]/30 text-[#00ffb4] hover:bg-[#00ffb4]/10 hover:border-[#00ffb4]/50"
                  }`}
                >
                  {isUploading ? "Processing..." : "Replace Document"}
                </button>
              </div>
            </div>
          ) : (
            /* Upload Prompt State */
            <div className="space-y-4">
              <div
                className={`transition-all duration-300 ${
                  isUploading ? "animate-pulse" : ""
                }`}
              >
                <Upload
                  className={`w-12 h-12 mx-auto mb-3 ${
                    isUploading ? "text-[#00ffb4]" : "text-gray-400"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <p className="text-gray-300 font-medium">
                  {isUploading ? "Processing..." : `Upload ${documentName}`}
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG, JPEG, PDF up to 5MB
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isUploading
                      ? "bg-[#02E8A6]/60 text-gray-900 opacity-70 cursor-not-allowed"
                      : "bg-[#00ffb4] hover:bg-[#00ffb4]/90 text-gray-900 hover:scale-105"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin mr-2"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#02E8A6"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8"
                          stroke="#02E8A6"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className="opacity-75"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Choose File"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

// Add this new component for the verification completion animation
const VerificationCompleteAnimation = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Animation duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm"
    >
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="w-24 h-24 mx-auto bg-[#00FFB4] rounded-full flex items-center justify-center"
        >
          <Check className="w-12 h-12 text-gray-900" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white"
        >
          Verification Complete!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400"
        >
          Your documents are being processed securely
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-12 h-12 border-4 border-[#00FFB4] border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function MerchantVerificationDashboard() {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Local state for user info (replace context usage)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | undefined>("");
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<Document[]>([
    { type: "msme", file: null, status: "pending", preview: null },
    { type: "gst", file: null, status: "pending", preview: null },
  ]);
  const [verify, setVerify] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showVerificationComplete, setShowVerificationComplete] =
    useState(false);

  // Calculate overall progress including personal info
  const calculateOverallProgress = useCallback(() => {
    const totalSteps = 5; // name, email, phone, address, documents (2) - removed face auth
    let completedSteps = 0;

    // Personal info progress (max 4 steps)
    if (name && name.trim().length >= 2) completedSteps++;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) completedSteps++;
    if (phoneNumber && /^[0-9]{10}$/.test(phoneNumber)) completedSteps++;
    if (address && address.trim().length >= 10) completedSteps++;

    // Documents progress (max 1 step - both documents count as one step)
    const allDocsUploaded = documents.every((doc) => doc.status === "uploaded");
    if (allDocsUploaded) completedSteps++;

    return (completedSteps / totalSteps) * 100;
  }, [name, email, phoneNumber, address, documents]);

  // Add this new function to check merchant verification status
  const checkMerchantVerificationStatus = useCallback(() => {
    if (!currentUser?.uid) return;
    const merchantVerificationStatus = localStorage.getItem(
      `merchant_verification_${currentUser?.uid}`
    );
    if (merchantVerificationStatus) {
      const statusData = JSON.parse(merchantVerificationStatus);
      if (
        statusData.status === "submitted" ||
        statusData.status === "verified"
      ) {
        toast.success("Verification already submitted", {
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });
        router.replace("/merchantdashboard");
      }
    }
  }, [currentUser, router]);

  const handleFileUpload = useCallback(
    async (type: DocumentType, file: File | null, preview: any) => {
      console.log(`File upload handler called for ${type}:`, {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        previewLength: preview?.length,
      });

      if (!preview) {
        console.error("No preview data provided");
        toast.error("Failed to process image. Please try again.", {
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });
        return;
      }

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.type === type
            ? { ...doc, file, status: "uploaded", preview }
            : doc
        )
      );

      const merchantVerification = localStorage.getItem(
        `merchant_verification_${currentUser?.uid}`
      );
      if (!merchantVerification) {
        toast.success(
          `${type.toUpperCase()} certificate uploaded successfully!`,
          {
            position: "top-right",
            style: {
              backgroundColor: "#172533",
              border: "#FBAE04",
              color: "#fff",
            },
          }
        );
      }
      console.log(`Document ${type} updated successfully`);
    },
    [currentUser?.uid]
  );

  const validateDocuments = useCallback((documents: any) => {
    console.log("Validating documents...");
    const errors = [];

    const documentStatus = documents.map((doc: any) => ({
      type: doc.type,
      status: doc.status,
      hasFile: !!doc.file,
      hasPreview: !!doc.preview,
    }));

    console.log("Documents status:", documentStatus);

    const allDocsUploaded = documents.every(
      (doc: any) => doc.status === "uploaded"
    );
    if (!allDocsUploaded) {
      errors.push("Please upload both MSME and GST certificates");
    }

    console.log("Validation errors:", errors);
    return errors;
  }, []);

  // Add this new function to simulate progress
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Log all form data and state values
    console.group("Merchant Verification Submit Data");
    console.log("Personal Information:", {
      name,
      email,
      phoneNumber,
      address,
      companyName,
      profilePicture: profilePicture ? "Image data present" : "No image",
    });

    console.log("User Authentication:", {
      uid: currentUser?.uid,
      emailVerified: currentUser?.emailVerified,
      photoURL: currentUser?.photoURL,
    });

    console.log(
      "Document Status:",
      documents.map((doc) => ({
        type: doc.type,
        status: doc.status,
        hasFile: !!doc.file,
        hasPreview: !!doc.preview,
        previewLength: doc.preview?.length || 0,
      }))
    );

    console.log("Verification Progress:", {
      overallProgress: calculateOverallProgress(),
      isComplete: calculateOverallProgress() === 100,
    });

    setVerify(true); // Show loading state
    setShowVerificationComplete(true); // Show completion animation
    setUploadProgress(0); // Reset progress to 0%

    // Start progress simulation
    const progressInterval = simulateProgress();

    try {
      console.log(
        name,
        email,
        currentUser?.photoURL,
        currentUser?.uid,
        documents[0]?.preview,
        documents[1]?.preview,
        currentUser?.emailVerified,
        address,
        profilePicture,
        phoneNumber,
        companyName
      );
      const upload = fetch(`/api/uploadmerchantdocument`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: name,
          email,
          photoUrl: currentUser?.photoURL || profilePicture,
          uid: currentUser?.uid,
          msmeCertificate: documents[0]?.preview,
          gstCertificate: documents[1]?.preview,
          isEmailVerified: currentUser?.emailVerified,
          address,
          profilePicture,
          phoneNumber,
          companyName,
        }),
      });

      toast.promise(upload, {
        loading: "uploading...",
        success: "uploaded!",
        error: "failed to upload",
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
      });

      const response = await (await upload).json();
      console.log("Upload Response:", response);

      // Clear the progress interval only on success
      clearInterval(progressInterval);

      if (response.success) {
        router.replace("/merchantdashboard");
        // Set progress to 100% when backend responds successfully
        setUploadProgress(100);

        // Save verification status to localStorage
        const verificationData = {
          status: "submitted",
          submittedAt: new Date().toISOString(),
          merchantId: currentUser?.uid,
          documents: {
            msme: documents[0]?.preview ? true : false,
            gst: documents[1]?.preview ? true : false,
          },
          personalInfo: {
            name,
            email,
            phoneNumber,
            companyName,
            address,
          },
        };

        localStorage.setItem(
          `merchant_verification_${currentUser?.uid}`,
          JSON.stringify(verificationData)
        );

        console.log(
          "Verification status saved to localStorage:",
          verificationData
        );
        console.log(
          "Verification submitted successfully, navigating to merchant dashboard"
        );

        // The navigation will happen after the animation completes
        // through the onComplete callback
      } else {
        // If response is not successful, even if it's not an error, treat as a failure for UI
        throw new Error(
          response.message ||
            "Failed to upload documents for an unknown reason."
        );
      }
    } catch (error) {
      // Clear the progress interval on error
      clearInterval(progressInterval);
      setUploadProgress(0); // Reset progress
      setShowVerificationComplete(false); // Hide completion animation
      setVerify(false); // Hide loading state

      console.error("Error in handleSubmit:", {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      toast.error("Failed to submit verification. Please try again.");
    } finally {
      console.groupEnd();
    }
  };

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
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [successMessage]);

  // Add useEffect to check verification status on component mount
  useEffect(() => {
    checkMerchantVerificationStatus();
  }, [checkMerchantVerificationStatus]);

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <LoadingSpinner
            size="large"
            text="Please login to access verification."
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

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

      <section className="relative z-10 py-4 px-4 sm:px-6 lg:px-8">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-green-to-yellow bg-gradient-to-r from-[#00FFB4] to-[#FFD700] bg-clip-text text-transparent">
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

          {/* Enhanced Sticky Progress Bar - Now for all screen sizes */}
          <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#00FFB4]" />
                  <div>
                    <div className="text-sm font-medium text-gray-300">
                      Verification Progress
                    </div>
                    <div className="text-xs text-gray-500">
                      Complete all steps to verify your account
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#00FFB4]">
                    {Math.round(calculateOverallProgress())}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {calculateOverallProgress() === 100
                      ? "Ready to Submit"
                      : "In Progress"}
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00FFB4] to-[#00D4AA] rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateOverallProgress()}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Progress bar shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>

                {/* Progress steps indicator */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  {[0, 20, 40, 60, 80, 100].map((step) => (
                    <div
                      key={step}
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        calculateOverallProgress() >= step
                          ? "bg-[#00FFB4] shadow-sm shadow-[#00FFB4]/50"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Progress details for larger screens */}
              <div className="hidden md:flex items-center justify-between mt-3 text-xs text-gray-400">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        name && name.trim().length >= 2
                          ? "bg-[#00FFB4]"
                          : "bg-gray-600"
                      }`}
                    />
                    <span>Personal Info</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        documents.every((doc) => doc.status === "uploaded")
                          ? "bg-[#00FFB4]"
                          : "bg-gray-600"
                      }`}
                    />
                    <span>Documents</span>
                  </div>
                </div>
                <div className="text-[#00FFB4] font-medium">
                  {calculateOverallProgress() === 100
                    ? "All steps completed!"
                    : `${
                        5 - Math.floor(calculateOverallProgress() / 20)
                      } steps remaining`}
                </div>
              </div>
            </div>
          </div>

          {/* User Input Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <UserInputFormSection
              phone={phoneNumber}
              name={name}
              email={email}
              phoneNumber={phoneNumber}
              address={address}
              profilePicture={profilePicture}
              companyName={companyName}
              onNameChange={(value) => setName(value)}
              onEmailChange={(value) => setEmail(value)}
              onPhoneChange={(value) => setPhoneNumber(value)}
              onAddressChange={(value) => setAddress(value)}
              onProfilePictureChange={(value: string | undefined) =>
                setProfilePicture(value)
              }
              onCompanyNameChange={(value) => setCompanyName(value)}
            />
          </motion.div>

          {/* Verification Cards */}
          <div className="verification-card-container grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
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
                <DocumentUploadCard
                  type={doc.type}
                  status={doc.status}
                  onFileUpload={handleFileUpload}
                />
              </motion.div>
            ))}
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
                disabled={calculateOverallProgress() < 100}
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

              <div className="grid md:grid-cols-2 gap-6">
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
