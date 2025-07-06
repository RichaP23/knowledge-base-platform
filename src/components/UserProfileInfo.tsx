"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function UserProfileInfo() {
  const [username, setUsername] = useState<string | null>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!error && data?.username) {
        setUsername(data.username);
      } else {
        setUsername("Anonymous");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex items-center gap-4">
      <span
        style={{
            fontSize: "1rem",       // similar to text-sm
            fontWeight: "600",        // semi-bold
            color: "#374151",         // similar to gray-700
            paddingRight: "1rem",     // space on the right
        }}
        >
        Hi, {username}
        </span>

      <Link href="/profile">
        <button className="text-blue-600 underline">Edit Profile</button>
      </Link>
    </div>
  );
}
