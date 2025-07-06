"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/utils/supabaseClient";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) router.push("/documents");
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) router.push("/documents");
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="container">
      <div className="card">
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Welcome to Knowledge Base
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#6366f1",
                  brandAccent: "#4f46e5",
                },
              },
            },
          }}
          providers={["google"]}
        />
      </div>
    </main>
  );
}
