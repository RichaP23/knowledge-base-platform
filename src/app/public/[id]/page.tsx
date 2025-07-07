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

interface AttachmentData {
  id: string;
  url: string;
}

export default function PublicDocumentPage() {
  const params = useParams() as { id: string };
  const { id } = params;

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      // Fetch the document
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
        setLoading(false);
        return;
      }

      setDoc(data as DocumentData);

      // Fetch attachments
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from("attachments")
        .select("id, url")
        .eq("document_id", id);

      if (attachmentsError) {
        console.error("Error fetching attachments:", attachmentsError);
        setAttachments([]);
      } else {
        setAttachments(attachmentsData || []);
      }

      setLoading(false);
    };

    fetchDoc();
  }, [id]);

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  if (!doc) {
    return (
      <main className="p-8 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-4">Document Not Found</h1>
        <p className="text-gray-600">
          This document is either private or does not exist.
        </p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        {/* Title */}
        <h1 className="text-3xl font-bold text-black text-center">{doc.title}</h1>
        
        {/* Author */}
        <p className="text-sm text-gray-500 text-center mb-4">
          Published by{" "}
          <span className="font-semibold">
            {doc.profiles?.[0]?.username || "Anonymous"}
          </span>
        </p>

        {/* Content */}
        <div
          className="text-base leading-relaxed text-black space-y-4"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Attachments</h3>
            <div className="flex gap-2 flex-wrap">
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={att.url}
                    alt="Attachment"
                    className="w-40 h-auto border rounded hover:opacity-80 transition"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Created date */}
        <p className="mt-6 text-sm text-gray-500 text-right">
          Created on {new Date(doc.created_at).toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
