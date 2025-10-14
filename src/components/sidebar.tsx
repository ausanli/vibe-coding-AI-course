import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, BarChart3, Users, Handshake, DollarSign, Settings, HelpCircle, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: BarChart3, label: "Analytics", href: "#" },
  { icon: Users, label: "Customers", href: "#" },
]

const bottomNavigationItems = [
  { icon: Handshake, label: "Partners", href: "#", badge: "new" },
  { icon: DollarSign, label: "Payouts", href: "#" },
]

const utilityItems = [
  { icon: Settings, label: "Settings", href: "#" },
  { icon: HelpCircle, label: "Help centre", href: "#" },
]

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
      {/* Account Section */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-md">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="rounded-md bg-primary text-primary-foreground">JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">John Doe</span>
            <span className="text-xs text-muted-foreground">john@example.com</span>
          </div>
        </div>
      </div>

      {/* Link Integrations */}
      <div className="border-b border-border p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
          <Link2 className="h-4 w-4" />
          <span>Link integrations</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 border-b border-border p-4">
        {navigationItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              item.label === "Home"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <nav className="space-y-1 border-b border-border p-4">
        {bottomNavigationItems.map((item) => (
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
        ))}
      </nav>

      {/* Utility Items */}
      <nav className="space-y-1 p-4">
        {utilityItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
