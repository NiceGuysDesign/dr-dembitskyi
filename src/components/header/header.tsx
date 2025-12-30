"use client";

import React from "react";
import LenguageSwitcher from "./lenguage-switcher";
import Logo from "../../../public/icons/logo";
import PhoneIcon from "../../../public/icons/phone-icon";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-[10px] px-[20px] flex justify-between items-center">
      <Logo className="fill-[#353556]"/>
      <div className="flex items-center gap-4 justify-between w-[40%]">
        <a
          href="tel:+380635554433"
          className="text-base font-medium text-black flex items-center gap-2"
        >
          <PhoneIcon />
          +38 063 555 44 33
        </a>
        <div className="flex items-center gap-5">
          <LenguageSwitcher />
          <Button variant="menu">Меню</Button>
        </div>
      </div>
    </header>
  );
}
