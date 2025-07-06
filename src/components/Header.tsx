"use client";
import { usePathname } from "next/navigation";
import LogoutButton from "./logoutButton";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
      <LogoutButton />
    </div>
  );
}
