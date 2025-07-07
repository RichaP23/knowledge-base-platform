"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

interface DocumentData {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles?: { username: string }[];
}

export default function PublicDocumentPage() {
  const params = useParams() as { id: string };
  const { id } = params;

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select(
          `
          id,
          title,
          content,
          created_at,
          profiles:profiles!documents_user_id_fkey (
            username
          )
          `
        )
        .eq("id", id)
        .eq("is_public", true)
        .single();

      if (error) {
        console.error(error);
        setDoc(null);
      } else {
        setDoc(data as DocumentData);
      }
      setLoading(false);
    };

    fetchDoc();
  }, [id]);

  // 🔹 Download handler
  const handleDownload = () => {
    if (!doc) return;

    // Wrap content in HTML template
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${doc.title}</title>
        </head>
        <body>
          content=${doc.content}
          time=${doc.created_at}
          id=${doc.id}
          profiles=${doc.profiles}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!doc)
    return (
      <main className="p-8 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-4">Document Not Found</h1>
        <p className="text-gray-600">
          This document is either private or does not exist.
        </p>
      </main>
    );

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-black text-center">{doc.title}</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Published by{" "}
          <span className="font-semibold">
            {doc.profiles?.[0]?.username || "Anonymous"}
          </span>
        </p>
        <div
          className="text-base leading-relaxed text-black space-y-4"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
        <p className="mt-6 text-sm text-gray-500 text-right">
          Created on {new Date(doc.created_at).toLocaleDateString()}
        </p>

        {/* 🔹 Download Button */}
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download as HTML
        </button>
        
        
      </div>
    </main>
  );
}
