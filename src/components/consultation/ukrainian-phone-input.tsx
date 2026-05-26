"use client";

import { IMaskInput } from "react-imask";

const inputClassName =
  "w-full px-3 py-[18px] bg-[rgba(138,140,193,0.2)] font-inter font-medium text-[14px] leading-[120%] tracking-[-0.02em] text-[#353556] placeholder:text-[#353556] placeholder:opacity-50 focus:outline-none focus:bg-[rgba(138,140,193,0.3)] transition-colors";

interface UkrainianPhoneInputProps {
  id?: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
}

export default function UkrainianPhoneInput({
  id = "phone",
  name = "phone",
  value,
  onValueChange,
  placeholder,
  "aria-invalid": ariaInvalid,
}: UkrainianPhoneInputProps) {
  return (
    <IMaskInput
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      mask="+38 (000) 000 00 00"
      lazy
      overwrite
      value={value}
      onAccept={onValueChange}
      placeholder={placeholder}
      aria-invalid={ariaInvalid}
      className={inputClassName}
    />
  );
}
