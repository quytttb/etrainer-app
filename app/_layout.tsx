import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InitialNotification from "@/components/InitialNotification";
import useBackHandler from "../hooks/useBackHandler";

const client = new QueryClient();

function AppContent() {
  // Global back handler - disabled to avoid conflicts with screen-specific handlers
  // Each screen will handle its own back button behavior
  // useBackHandler();

  return (
    <>
      <InitialNotification />
      <Slot />
    </>
  );
}

export default function Layout() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
