"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface ConsultationFormProps {
  onClose: () => void;
}

export default function ConsultationForm({ onClose }: ConsultationFormProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Replace with your actual API endpoint
      const apiEndpoint =
        process.env.NEXT_PUBLIC_FORM_API_ENDPOINT || "/api/consultation";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form data after submission
        setFormData({
          name: "",
          phone: "",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(
          errorData.message ||
            t("consultation.errorMessage") ||
            "Помилка відправки. Спробуйте ще раз."
        );
      }
    } catch {
      setSubmitError(
        t("consultation.errorMessage") || "Помилка відправки. Спробуйте ще раз."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#F4F4F5] relative">
      {/* Close Button - Top Right */}
      <button
        onClick={onClose}
        className="absolute top-[53px] right-[10px] md:right-[30px] w-[60px] h-[60px] flex items-center justify-center rounded-full border-[1.5px] border-black hover:opacity-70 transition-opacity z-10"
        aria-label="Close"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Form Content - Fixed height */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-[10px] md:px-5">
          {/* Title */}
          <h2 className="font-manrope font-bold text-[60px] md:text-[80px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[#353556] py-10">
            {t("consultation.title") || "Консультація"}
          </h2>

          {/* Divider Line */}
          <div className="w-full h-[1px] bg-[#1B1661] opacity-40 mb-12" />

          {/* Success Message or Form */}
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] relative">
              <div className="w-[348px] flex flex-col items-center gap-4">
                <h3 className="font-manrope font-bold text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556] text-center">
                  {t("consultation.successTitle") || "Дякуємо за заявку!"}
                </h3>
                <p className="font-manrope font-bold text-[18px] leading-[100%] tracking-[-0.05em] text-[#353556] text-center max-w-[308px]">
                  {t("consultation.successMessage") ||
                    "Ваше повідомлення успішно відправлено. Ми зв'яжемося з вами найближчим часом."}
                </p>
                <button
                  onClick={onClose}
                  className="w-[246px] h-[66px] min-h-[54px] rounded-[50px] font-inter font-medium text-[16px] leading-[100%] tracking-[-0.01em] text-white flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(114.39% 151.52% at 50% 151.52%, #000000 0%, #3A3A45 100%)",
                  }}
                >
                  {t("consultation.close") || "Закрити"}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-[522px] mx-auto flex flex-col gap-5"
            >
              {/* Description Text */}
              <p className="font-manrope font-bold text-[28px] md:text-[32px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-5">
                {t("consultation.description") ||
                  "Залиште ваше імʼя та номер телефону і ми звʼяжемося з вами найближчим часом"}
              </p>

              {/* Name Field */}
              <div className="flex flex-col gap-[13px]">
                <label
                  htmlFor="name"
                  className="font-manrope font-bold text-[18px] leading-[100%] tracking-[-0.05em] text-[#353556]"
                >
                  {t("consultation.name") || "Ім'я, прізвище"}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-[18px] bg-[rgba(138,140,193,0.2)] font-inter font-medium text-[14px] leading-[120%] tracking-[-0.02em] text-[#353556] placeholder:text-[#353556] placeholder:opacity-50 focus:outline-none focus:bg-[rgba(138,140,193,0.3)] transition-colors"
                  placeholder={
                    t("consultation.namePlaceholder") ||
                    "Введіть ваше ім'я і прізвище"
                  }
                />
              </div>

              {/* Phone Field */}
              <div className="flex flex-col gap-[13px]">
                <label
                  htmlFor="phone"
                  className="font-manrope font-bold text-[18px] leading-[100%] tracking-[-0.05em] text-[#353556]"
                >
                  {t("consultation.phone") || "Телефон"}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-[18px] bg-[rgba(138,140,193,0.2)] font-inter font-medium text-[14px] leading-[120%] tracking-[-0.02em] text-[#353556] placeholder:text-[#353556] placeholder:opacity-50 focus:outline-none focus:bg-[rgba(138,140,193,0.3)] transition-colors"
                  placeholder={
                    t("consultation.phonePlaceholder") || "+38 (0XX) XXX XX XX"
                  }
                />
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[246px] h-[66px] min-h-[54px] rounded-[50px] font-inter font-medium text-[16px] leading-[100%] tracking-[-0.01em] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "radial-gradient(114.39% 151.52% at 50% 151.52%, #000000 0%, #3A3A45 100%)",
                }}
              >
                {isSubmitting
                  ? t("consultation.submitting") || "Відправка..."
                  : t("consultation.submit") || "Відправити"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
