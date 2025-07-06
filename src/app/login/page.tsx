"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/utils/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // track session load
  const [sessionExists, setSessionExists] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSessionExists(true);
        router.push("/documents");
      } else {
        setLoading(false); // show login form
      }
    };
    checkSession();
  }, [router]);

  // On login event
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSessionExists(true);
        router.push("/documents");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading || sessionExists) return null;

  return (
    <main className="container" style={{ maxWidth: "400px", margin: "3rem auto" }}>
      <div style={{
        background: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
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
