"use client";

import { useState } from "react";
import MagicLinkForm from "./magic-link-form";

export default function Home() {
  const [linkSent, setLinkSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleLinkSent = (email: string) => {
    setUserEmail(email);
    setLinkSent(true);
  };

  const handleReset = () => {
    setLinkSent(false);
    setUserEmail("");
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#090909" }}
    >
      {linkSent ? (
        <div className="w-full max-w-md">
          <div
            className="p-8 rounded-lg"
            style={{
              backgroundColor: "#090909",
              border: "1px solid #2E2E2E",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Check your email
            </h2>
            <p className="mb-6" style={{ color: "#BCBCBC" }}>
              We've sent a magic link to{" "}
              <span style={{ color: "#FFFFFF" }}>{userEmail}</span>. Click the
              link to sign in or create your account.
            </p>
            <p className="text-sm mb-6" style={{ color: "#BCBCBC" }}>
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={handleReset}
              className="w-full py-2 px-4 rounded transition-colors"
              style={{
                backgroundColor: "#1F1F1F",
                color: "#FFFFFF",
                border: "1px solid #2E2E2E",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2E2E2E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1F1F1F";
              }}
            >
              Try another email
            </button>
          </div>
        </div>
      ) : (
        <MagicLinkForm onLinkSent={handleLinkSent} />
      )}
    </main>
  );
}
