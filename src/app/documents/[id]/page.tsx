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

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // Load document
  useEffect(() => {
    const fetchDocument = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        alert("Error loading document");
        router.push("/documents");
      } else {
        setTitle(data.title);
        setIsPublic(data.is_public);
        editor?.commands.setContent(data.content || "");
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

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Edit Document</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="border p-2 rounded min-h-[200px]">
        <EditorContent editor={editor} />
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <span>Public</span>
      </label>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </main>
  );
}
