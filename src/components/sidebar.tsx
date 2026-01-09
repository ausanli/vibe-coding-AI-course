"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  BarChart3,
  Users,
  Handshake,
  DollarSign,
  Settings,
  HelpCircle,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/supabase/frontend";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: BarChart3, label: "Analytics", href: "#" },
  { icon: Users, label: "Customers", href: "#" },
];

const bottomNavigationItems = [
  { icon: Handshake, label: "Partners", href: "#", badge: "new" },
  { icon: DollarSign, label: "Payouts", href: "#" },
];

const utilityItems = [
  { icon: Settings, label: "Settings", href: "#" },
  { icon: HelpCircle, label: "Help centre", href: "#" },
];

export function Sidebar() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUser();
        if (!mounted) return;
        if (res.error) {
          console.error("Failed to fetch user for sidebar:", res.error);
          return;
        }
        const user = res.data;
        if (!user) return;
        setName(
          (user.full_name as string) ||
            (user.email ? String(user.email).split("@")[0] : "")
        );
        setEmail((user.email as string) || "");
        setAvatarUrl((user.avatar_url as string) || undefined);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const initials = useMemo(() => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [name]);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
      {/* Account Section */}
      <div className="border-b border-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-md">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} />
                  ) : (
                    <AvatarFallback className="rounded-md bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col text-left w-full">
                  <span className="text-sm font-medium text-foreground">
                    {name || "John Doe"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {email || "john@example.com"}
                  </span>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-44">
            <DropdownMenuItem onClick={() => setIsConfirmOpen(true)}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsConfirmOpen(false);
          }}
        >
          <div className="bg-card rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-2">Sign out</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                    setIsConfirmOpen(false);
                    router.push("/auth");
                  } catch (err: any) {
                    console.error("Sign out failed:", err);
                    toast({
                      title: "Sign out failed",
                      description: err?.message || String(err),
                      variant: "error",
                    });
                  }
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Link Integrations */}
      <div className="border-b border-border p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
          <Link2 className="h-4 w-4" />
          <span>Link integrations</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 border-b border-border p-4">
        {useMemo(
          () =>
            navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  item.label === "Home"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            )),
          []
        )}
      </nav>

      {/* Bottom Navigation */}
      <nav className="space-y-1 border-b border-border p-4">
        {useMemo(
          () =>
            bottomNavigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: "#1c2b1c", color: "#04c40a" }}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            )),
          []
        )}
      </nav>

      {/* Utility Items */}
      <nav className="space-y-1 p-4">
        {useMemo(
          () =>
            utilityItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            )),
          []
        )}
      </nav>
    </aside>
  );
}
