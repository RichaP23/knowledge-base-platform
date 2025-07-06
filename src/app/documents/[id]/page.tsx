"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function EditDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
  });

  useEffect(() => {
    const fetchDocument = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in.");
        router.push("/documents");
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        alert("Error loading document.");
        router.push("/documents");
        return;
      }

      setTitle(data.title);
      setIsPublic(data.is_public);
      editor?.commands.setContent(data.content || "");
      setIsOwner(data.user_id === user.id);

      if (editor && data.user_id !== user.id) {
        editor.setEditable(false);
      }

      setLoading(false);
    };

    if (editor) {
      fetchDocument();
    }
  }, [editor, id, router]);

  const handleUpdate = async () => {
    if (!editor) return;
    setLoading(true);

    const { error } = await supabase
      .from("documents")
      .update({
        title,
        content: editor.getHTML(),
        is_public: isPublic,
        updated_at: new Date(),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error updating document");
    } else {
      alert("Document updated!");
      router.push("/documents");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error deleting document");
    } else {
      alert("Document deleted");
      router.push("/documents");
    }

    setLoading(false);
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading...</p>;
  }

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
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "1.5rem",
        }}
      >
        {isOwner ? "Edit Document" : "View Document"}
      </h1>

      {isOwner ? (
        <label style={{ display: "block", marginBottom: "1rem" }}>
          <span
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#555",
              fontWeight: "500",
            }}
          >
            Title
          </span>
          <input
            type="text"
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
      ) : (
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#444",
          }}
        >
          {title}
        </h2>
      )}

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "1rem",
          minHeight: "200px",
          background: "#fafafa",
          marginBottom: "1rem",
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {isOwner && (
        <>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
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

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handleUpdate}
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
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Delete Document
            </button>
          </div>
        </>
      )}

      <button
        onClick={() => router.push("/documents")}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#eee",
          color: "#333",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </main>
  );
}
