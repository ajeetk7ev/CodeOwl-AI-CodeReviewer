import { Toaster } from "sonner";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "@/store/authStore";

export default function App() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" theme="dark" />
    </>
  );
}
