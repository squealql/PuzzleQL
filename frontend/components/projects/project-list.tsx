"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "./project-card";
import { projectStorage } from "@/lib/projects/storage";
import { Project } from "@/lib/projects/types";

export function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Load projects on mount
    useEffect(() => {
        async function loadProjects() {
            try {
                const projectList = await projectStorage.listProjects();
                setProjects(projectList);
            } catch (error) {
                console.error("Error loading projects:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, []);

    // Handle project deletion
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await projectStorage.deleteProject(id);
                setProjects(projects.filter((p) => p.id !== id));
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading projects...</div>;
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-ui-beige-200 dark:bg-ui-navy-900 border-ui-navy-200 dark:border-ui-navy-700">
                <h3 className="text-lg font-medium text-ui-navy-800 dark:text-ui-beige-100 mb-2">No projects yet</h3>
                <p className="text-ui-navy-600 dark:text-ui-beige-300 mb-6">Create your first SQL query builder project to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
        </div>
    );
}
