"use client";

import type React from "react";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

interface MagicLinkFormProps {
  onLinkSent: (email: string) => void;
}

export default function MagicLinkForm({ onLinkSent }: MagicLinkFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please fill in all fields");
      return;
    }
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: "https://example.com/welcome",
        },
      });

      setLoading(false);

      if (signError) {
        console.error("Error sending magic link:", signError);
        setError("Failed to send magic link. Please try again.");
        toast({
          title: "Error",
          description: signError.message || "Failed to send magic link",
          variant: "error",
        });
        return;
      }

      // Success
      toast({
        title: "Magic link sent",
        description: `Check ${email} for a sign-in link.`,
        variant: "success",
      });
      onLinkSent(email);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      setError("Failed to send magic link. Please try again.");
      toast({
        title: "Error",
        description: err?.message || String(err),
        variant: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div
        className="p-8 rounded-lg"
        style={{
          backgroundColor: "#090909",
          border: "1px solid #2E2E2E",
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
            Welcome
          </h1>
          <p style={{ color: "#BCBCBC" }}>
            Sign in or create an account with your email
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ color: "#FFFFFF" }}
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "#090909",
                border: "1px solid #2E2E2E",
                color: "#FFFFFF",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2E2E2E";
              }}
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: "#FFFFFF" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                size={18}
                style={{ color: "#BCBCBC" }}
              />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#090909",
                  border: "1px solid #2E2E2E",
                  color: "#FFFFFF",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2E2E2E";
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="text-sm rounded p-3"
              style={{ backgroundColor: "#1F1F1F", color: "#FF6B6B" }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "#1F1F1F",
              color: "#FFFFFF",
              border: "1px solid #2E2E2E",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#2E2E2E";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1F1F1F";
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Magic Link
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{ color: "#BCBCBC" }}>
          We'll send you a link to sign in or create an account
        </p>
      </div>
    </div>
  );
}
