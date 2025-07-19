import { redirect } from "next/navigation";
import { BlocklyWorkspace } from "react-blockly";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import BlockCanvas from "./blockcanvas";

export default async function ProtectedPage() {
  const blockslist = [];
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="w-[95vw] h-[95vh] flex flex-row">
      <div className="bg-blue-500 w-[25%] h-full m-2 rounded-sm flex-col flex">
        <div className="text-lg text-center">Blocks List</div> 
        <div>
          {}
        </div>
      </div>
      <BlockCanvas></BlockCanvas>
      <div className="bg-purple-500 w-[25%] h-full m-2 rounded-sm">
      </div>
    </div>
  );
}
