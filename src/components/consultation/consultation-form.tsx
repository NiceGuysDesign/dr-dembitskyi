"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface ConsultationFormProps {
  onClose: () => void;
}

export default function ConsultationForm({ onClose }: ConsultationFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
    onClose();
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
    <div className="h-full w-full flex flex-col bg-[#F4F4F5]">
      {/* Header */}
      <div className="flex-shrink-0 px-[10px] md:px-5 pt-10 pb-6 border-b border-[#1B1661] border-opacity-40">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <h2 className="font-manrope font-bold text-[40px] md:text-[60px] lg:text-[80px] leading-[100%] tracking-[-0.05em] text-[#353556]">
            {t("consultation.title") || "Консультація"}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full border-2 border-[#353556] hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="#353556"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Form Content - Fixed height */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-[10px] md:px-5 py-8 md:py-12">
          <form
            onSubmit={handleSubmit}
            className="max-w-[600px] mx-auto flex flex-col gap-6"
          >
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50"
              >
                {t("consultation.name") || "Ім'я"}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#353556] border-opacity-20 rounded-lg font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-[#353556] bg-white focus:outline-none focus:border-[#353556] transition-colors"
                placeholder={
                  t("consultation.namePlaceholder") || "Введіть ваше ім'я"
                }
              />
            </div>

            {/* Phone Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50"
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
                className="w-full px-4 py-3 border-2 border-[#353556] border-opacity-20 rounded-lg font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-[#353556] bg-white focus:outline-none focus:border-[#353556] transition-colors"
                placeholder={
                  t("consultation.phonePlaceholder") || "+38 (0XX) XXX XX XX"
                }
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50"
              >
                {t("consultation.email") || "Email"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#353556] border-opacity-20 rounded-lg font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-[#353556] bg-white focus:outline-none focus:border-[#353556] transition-colors"
                placeholder={
                  t("consultation.emailPlaceholder") || "your.email@example.com"
                }
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50"
              >
                {t("consultation.message") || "Повідомлення"}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border-2 border-[#353556] border-opacity-20 rounded-lg font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-[#353556] bg-white focus:outline-none focus:border-[#353556] transition-colors resize-none"
                placeholder={
                  t("consultation.messagePlaceholder") ||
                  "Опишіть ваше питання..."
                }
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                type="submit"
                variant="default"
                style={{ background: "var(--gradient-button)" }}
                className="w-full sm:w-auto min-w-[242px] h-[54px] md:h-[66px] min-h-[54px]"
              >
                {t("consultation.submit") || "Відправити"}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={onClose}
                className="text-[#353556] hover:opacity-70 transition-opacity"
              >
                {t("consultation.cancel") || "Скасувати"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
