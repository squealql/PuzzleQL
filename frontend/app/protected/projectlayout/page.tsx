import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import BlockCanvas from "./blockcanvas";

export default async function ProtectedPage() {
    const blockslist = [];
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    return (
        <div className="w-[95vw] h-[95vh] bg-ui-beige-100 p-4 rounded-lg">
            <BlockCanvas />
        </div>
    );
}
