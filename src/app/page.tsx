"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // Already logged in -> go to documents
        router.replace("/documents");
      } else {
        // Not logged in -> go to login
        router.replace("/login");
      }
    };
    redirect();
  }, [router]);

  return null; // nothing to render
}
