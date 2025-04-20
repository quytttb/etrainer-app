import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InitialNotification from "@/components/InitialNotification";

const client = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <InitialNotification />

        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}
