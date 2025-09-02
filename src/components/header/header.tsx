"use client";

import React from "react";
import { Container } from "../ui/container";
import LenguageSwitcher from "./lenguage-switcher";
import Navigation from "./navigation";

export default function Header() {
  return (
    <header className="bg-gray-100 p-4 mt-3">
      <Container
        variant="content"
        className="flex flex-row items-center justify-between"
      >
        <Navigation />
        <LenguageSwitcher />
      </Container>
    </header>
  );
}
