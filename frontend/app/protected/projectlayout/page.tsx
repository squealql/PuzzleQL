import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import BlockCanvas from "./BlockCanvas";

export default async function ProtectedPage() {
  const blockslist = [];
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="w-[95vw] h-[95vh]">
      <BlockCanvas/>
    </div>
  );
}
