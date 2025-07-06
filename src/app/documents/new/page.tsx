"use client";
import LogoutButton from "@/components/logoutButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { supabase } from "@/utils/supabaseClient";
import UserProfileInfo from "@/components/UserProfileInfo";

export default function NewDocumentPage() {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const handleSave = async () => {
    if (!editor) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Not authenticated");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("documents").insert([
      {
        user_id: user.id,
        title,
        content: editor.getHTML(),
        is_public: isPublic,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating document");
    } else {
      router.push("/documents");
    }
    setLoading(false);
  };

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Back Icon */}
      <button
        onClick={() => router.back()}
        style={{
          position: "absolute",
          left: "1.5rem",
          top: "1.5rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ width: "24px", height: "24px", color: "#333" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>
          New Document
        </h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <UserProfileInfo />
          <LogoutButton />
        </div>
      </div>

      {/* Title input */}
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <span style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>
          Title
        </span>
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </label>

      {/* Editor */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "1rem",
          minHeight: "200px",
          background: "white",
          marginBottom: "1rem",
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Public checkbox */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
          cursor: "pointer",
          color: "#555",
        }}
      >
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <span>Make this document public</span>
      </label>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving..." : "Save Document"}
      </button>
    </main>
  );
}
