import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/projects/project-list";

export default function ProjectsPage() {
    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Projects</h1>
                <Button asChild>
                    <Link href="/projects/new">New Project</Link>
                </Button>
            </div>

            <ProjectList />
        </div>
    );
}
