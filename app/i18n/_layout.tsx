import React from "react";
import { Slot } from "expo-router";
import "./index"; // Import đúng file i18n ở app/i18n/index.tsx
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    // Language is loaded by importing i18n
  }, []);

  return <Slot />;
}
