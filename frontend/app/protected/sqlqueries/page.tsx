import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";

export default async function SQLQueries() {
  const supabase = await createClient();
  
  const { data : datar, error :e } = await supabase.auth.getUser();
  if (e || !datar?.user) {
    throw new Error(e.message);
  }
  console.log("AUTH PASSED")
  console.log(datar)

  const { data: freaks, error } = await supabase.from("freaky").select("*");

  if (error) {
    throw new Error(error.message);
  }
  console.log(freaks);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-row gap-2 items-start">
      <form className="flex flex-col">
          <label >
            Name:
            <input className="bg-blue-300" type="text" name="QUERY" />
          </label>
          <input className="bg-slate-200 rounded-sm" type="submit" value="Submit" />
        </form>
        <div>
          <p>Outputbox:</p>
        <div id="outputbox" className="rounded-sm bg-slate-300 w-full max-w-4xl p-4">
        {freaks &&
          freaks
            .map((freak) => {
              return <div key={freak.id}>{freak.id} {freak.neb} </div>;
            })}
        </div>

        </div>
      </div>
    </div>
  );
}
