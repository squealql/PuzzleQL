"use client";

import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
    return (
        <div className="max-w-3xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-8">Create New Project</h1>
            <ProjectForm />
        </div>
    );
}
