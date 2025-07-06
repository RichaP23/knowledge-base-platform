"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  is_public: boolean;
  created_at: string;
  content?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setDocuments(data || []);
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  return (
    <main className="container">
      <h1>My Documents</h1>

      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <Link href="/documents/new">
          <button>+ New Document</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="doc-list">
          {documents
            .filter(
              (doc) =>
                doc.title.toLowerCase().includes(search.toLowerCase()) ||
                (doc.content || "").toLowerCase().includes(search.toLowerCase())
            )
            .map((doc) => (
              <li key={doc.id}>
                <Link href={`/documents/${doc.id}`} className="doc-title">
                  {doc.title}
                </Link>
                <div className="doc-meta">
                  {doc.is_public ? "Public" : "Private"} –{" "}
                  {new Date(doc.created_at).toLocaleString()}
                </div>
              </li>
            ))}
        </ul>
      )}
    </main>
  );
}
