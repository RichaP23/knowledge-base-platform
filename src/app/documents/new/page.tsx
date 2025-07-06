"use client";
import LogoutButton from "@/components/logoutButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { supabase } from "@/utils/supabaseClient";

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
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>New Document</h1>
        <LogoutButton />
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "0.5rem", minHeight: "200px", background: "white", marginTop: "1rem" }}>
        <EditorContent editor={editor} />
      </div>

      <label className="checkbox-label" style={{ marginTop: "1rem" }}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <span>Public</span>
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Saving..." : "Save Document"}
      </button>
    </main>
  );
}
