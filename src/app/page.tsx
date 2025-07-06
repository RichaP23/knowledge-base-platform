"use client";

import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email ?? null);
      }
    };
    getSession();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Your Knowledge Base</h1>
      {userEmail && (
        <p className="text-gray-600">Logged in as {userEmail}</p>
      )}
      <Link
        href="/documents"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go to Documents
      </Link>
    </main>
  );
}
