"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function ProfilePage() {
  const [username, setUsername] = useState("Anonymous");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setUsername("Anonymous");
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, username: "Anonymous" });

        if (insertError) {
          console.error("Error creating default profile:", insertError);
        } else {
          console.log("Default profile created.");
        }

        setUsername("Anonymous");
      } else if (error) {
        console.error("Error loading profile:", error);
        setUsername("Anonymous");
      } else {
        setUsername(data.username || "Anonymous");
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!userId) {
      alert("You must be logged in to update your profile.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", userId);

    if (error) {
      alert("Error updating profile");
      console.error(error);
    } else {
      alert("Profile updated!");
      window.location.href = "/documents";
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "1rem"
        }}
      >
        Your Profile
      </h1>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <span style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>
          Username
        </span>
        <input
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!userId}
        />
      </label>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginTop: "1rem"
        }}
      >
        <button
          style={{
            padding: "0.75rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: userId ? "pointer" : "not-allowed",
            opacity: userId ? 1 : 0.6,
            fontSize: "1rem"
          }}
          onClick={handleUpdate}
          disabled={!userId}
        >
          Update Profile
        </button>

        <button
          style={{
            padding: "0.75rem",
            backgroundColor: "#f0f0f0",
            color: "#333",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
          onClick={() => window.location.href = "/documents"}
        >
          Back to Documents
        </button>
      </div>

      {!userId && (
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#777" }}>
          You are not logged in. Log in to edit your profile.
        </p>
      )}
    </main>
  );
}
