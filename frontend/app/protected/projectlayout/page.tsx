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
    <div className="w-[95vw] h-[95vh] flex flex-row">
      <BlockCanvas/>
      <div className="bg-purple-500 w-[25%] h-full m-2 rounded-sm">
      </div>
    </div>
  );
}
