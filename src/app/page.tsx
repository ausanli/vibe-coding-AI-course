import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";

import { createClient } from "@/lib/supabase/server";
import DashboardContent from "@/components/dashboard-content";

export default async function Page() {
  // server-side Supabase auth check
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    // redirect unauthenticated users to the auth page
    redirect("/auth");
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-8">
        <DashboardContent />
      </div>
    </DashboardLayout>
  );
}
