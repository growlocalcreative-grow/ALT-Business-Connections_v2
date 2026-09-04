import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { motion } from "motion/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { cn } from "../lib/utils";
import { Button } from "./UI";
import { Upload, Image as ImageIcon, X } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Owner name is required"),
  email: z.string().email("Invalid email address"),
  businessName: z.string().min(2, "Business name is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone is required: (xxx) xxx-xxxx"),
  isTextEnabled: z.boolean(),
  website: z.string().url("Invalid URL").min(1, "Website URL is required"),
  includeInDirectory: z.boolean(),
  logo: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = ({ 
  onSuccess, 
  hideDirectoryCheckbox = false 
}: { 
  onSuccess?: () => void;
  hideDirectoryCheckbox?: boolean;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      includeInDirectory: true,
      phone: "",
      isTextEnabled: false,
      website: "",
      logo: "",
    }
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert("Image size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setValue("logo", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setValue("logo", "");
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Save to membership applications
      try {
        await addDoc(collection(db, "memberships"), {
          ...data,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "memberships");
      }

      // If user wants to be in directory (or it's forced by hiding the checkbox), also add to businesses
      if (data.includeInDirectory || hideDirectoryCheckbox) {
        try {
          await addDoc(collection(db, "businesses"), {
            name: data.businessName,
            category: data.category,
            owner: data.name,
            description: data.description,
            email: data.email,
            phone: data.phone,
            isTextEnabled: data.isTextEnabled,
            website: data.website,
            logo: data.logo || "",
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, "businesses");
        }
      }

      setIsSubmitted(true);
      reset();
      setLogoPreview(null);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-[#d4af37]/30 shadow-xl">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <div className="text-[#d4af37] text-2xl">✓</div>
        </motion.div>
        <h3 className="text-2xl font-bold text-[#1a3a3a] mb-4">Application Received!</h3>
        <p className="text-slate-600 mb-8">Thank you for joining our cooperative. Annette will be in touch soon.</p>
        <Button onClick={() => setIsSubmitted(false)}>Submit another application</Button>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider block">Business Logo</label>
        <div className="flex items-center gap-6 p-4 bg-white rounded-xl border border-dashed border-slate-200">
          <div className="relative w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
            {logoPreview ? (
              <>
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                <button 
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm text-red-500 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-200" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs text-slate-500 font-medium">Add your brand's face to the directory (max 1MB)</p>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-[#1a3a3a] rounded-lg text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                {logoPreview ? "Change Logo" : "Upload Logo"}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Business Name</label>
          <input
            {...register("businessName")}
            className={cn(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#d4af37] outline-none transition-all",
              errors.businessName ? "border-red-500" : "border-slate-200"
            )}
            placeholder="e.g. ALT Home Services"
          />
          {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Category</label>
          <input
            {...register("category")}
            className={cn(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#d4af37] outline-none transition-all",
              errors.category ? "border-red-500" : "border-slate-200"
            )}
            placeholder="e.g. Landscaping, Design, etc."
          />
          {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Owner Name</label>
          <input
            {...register("name")}
            className={cn(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#d4af37] outline-none transition-all",
              errors.name ? "border-red-500" : "border-slate-200"
            )}
            placeholder="Your Name"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Public Email</label>
          <input
            {...register("email")}
            className={cn(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#d4af37] outline-none transition-all",
              errors.email ? "border-red-500" : "border-slate-200"
            )}
            placeholder="hello@example.com"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className={cn(
            "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#d4af37] outline-none transition-all resize-none",
            errors.description ? "border-red-500" : "border-slate-200"
          )}
          placeholder="Tell your neighbors about your services..."
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Phone</label>
          <input
            {...register("phone")}
            onChange={handlePhoneChange}
            className={cn(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#d4af37] outline-none transition-all",
              errors.phone ? "border-red-500" : "border-slate-200"
            )}
            placeholder="(530) 000-0000"
            maxLength={14}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isTextEnabled"
              {...register("isTextEnabled")}
              className="w-4 h-4 rounded border-[#d4af37] text-[#d4af37] focus:ring-[#d4af37]"
            />
            <label htmlFor="isTextEnabled" className="text-xs text-slate-500 cursor-pointer">
              This number can receive text messages
            </label>
          </div>
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Website URL</label>
          <input
            {...register("website")}
            className={cn(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#d4af37] outline-none transition-all",
              errors.website ? "border-red-500" : "border-slate-200"
            )}
            placeholder="https://yourbusiness.com"
          />
          {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
        </div>
      </div>

      {!hideDirectoryCheckbox && (
        <div className="flex items-center gap-3 py-4 border-y border-[#d4af37]/10">
          <input
            type="checkbox"
            id="includeInDirectory"
            {...register("includeInDirectory")}
            className="w-5 h-5 rounded border-[#d4af37] text-[#d4af37] focus:ring-[#d4af37]"
          />
          <label htmlFor="includeInDirectory" className="text-sm text-[#1a3a3a] font-medium cursor-pointer">
            Include my business in the public ALT Business Directory
          </label>
        </div>
      )}

      <Button className="w-full py-4 text-lg" variant="primary">
        {isSubmitting ? "Submitting..." : hideDirectoryCheckbox ? "Add My Business" : "Join Our Cooperative"}
      </Button>
    </motion.form>
  );
};
