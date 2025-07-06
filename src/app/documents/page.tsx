"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import UserProfileInfo from "@/components/UserProfileInfo";

interface Document {
  id: string;
  title: string;
  is_public: boolean;
  created_at: string;
  content?: string;
  username?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
  const fetchDocuments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supabase
      .from("documents_with_profiles")
      .select("*")
      .or(`is_public.eq.true,user_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setDocuments(data || []);
    setLoading(false);
  };

  fetchDocuments();
}, []);


  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "2rem",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
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
          My Documents
        </h1>
        <UserProfileInfo />
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "1.5rem",
        }}
      />

      {/* New Document Button */}
      <div style={{ marginBottom: "1.5rem", textAlign: "right" }}>
        <Link href="/documents/new">
          <button
            style={{
              padding: "0.6rem 1.2rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + New Document
          </button>
        </Link>
      </div>

      {/* Document List */}
      {loading ? (
        <p>Loading...</p>
      ) : documents.length === 0 ? (
        <p style={{ color: "#666" }}>No documents found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {documents
            .filter(
              (doc) =>
                doc.title.toLowerCase().includes(search.toLowerCase()) ||
                (doc.content || "").toLowerCase().includes(search.toLowerCase())
            )
            .map((doc) => (
              <li
                key={doc.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  background: "#f9f9f9",
                }}
              >
                <Link
                  href={`/documents/${doc.id}`}
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#007bff",
                    textDecoration: "none",
                  }}
                >
                  {doc.title}
                </Link>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#555",
                    marginTop: "0.5rem",
                  }}
                >
                  {doc.is_public ? "🌐 Public" : "🔒 Private"} •{" "}
                  {new Date(doc.created_at).toLocaleString()} •{" "}
                  Author: {doc.username || "Anonymous"}
                </div>
              </li>
            ))}
        </ul>
      )}
    </main>
  );
}
