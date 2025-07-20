"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projectStorage } from "@/lib/projects/storage";
import { Project } from "@/lib/projects/types";

export default function ProjectDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    // Get the ID from the useParams hook - this is the recommended approach for client components
    const projectId = params.id as string;

    // Log for debugging
    console.log("Params from useParams hook:", params);
    console.log("Project ID:", projectId);

    useEffect(() => {
        async function loadProject() {
            try {
                const loadedProject = await projectStorage.getProject(projectId);
                if (!loadedProject) {
                    router.push("/projects");
                    return;
                }
                setProject(loadedProject);
            } catch (error) {
                console.error("Failed to load project:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    }, [projectId, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96 text-ui-navy-700 dark:text-ui-beige-300">
                <p>Loading project...</p>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <div className="space-y-8 text-ui-navy-900 dark:text-ui-beige-100">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <p className="text-ui-navy-600 dark:text-ui-beige-300">{project.description}</p>
                </div>
                <Link href="/projects">
                    <Button variant="outline" className="dark:text-white dark:border-ui-navy-500 dark:hover:bg-ui-navy-700">
                        Back to Projects
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Details Card */}
                <Card className="bg-white dark:bg-ui-navy-800 border-ui-navy-200 dark:border-ui-navy-700">
                    <CardHeader>
                        <CardTitle className="text-ui-navy-900 dark:text-white">Project Details</CardTitle>
                        <CardDescription className="text-ui-navy-500 dark:text-ui-beige-300">Information about this project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium">Created</p>
                            <p className="text-sm text-ui-navy-600 dark:text-ui-beige-300">{new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-medium">Last Updated</p>
                            <p className="text-sm text-ui-navy-600 dark:text-ui-beige-300">{new Date(project.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-medium">Database Connection</p>
                            {project.databaseConnection.enabled ? (
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="dark:text-white dark:border-ui-navy-500">
                                        {project.databaseConnection.type}
                                    </Badge>
                                    <p className="text-sm text-ui-navy-600 dark:text-ui-beige-300 truncate max-w-xs">
                                        {project.databaseConnection.connectionString}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-ui-navy-600 dark:text-ui-beige-300">No database connection</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Query Builder Card */}
                <Card className="bg-white dark:bg-ui-navy-800 border-ui-navy-200 dark:border-ui-navy-700">
                    <CardHeader>
                        <CardTitle className="text-ui-navy-900 dark:text-white">SQL Table Builder</CardTitle>
                        <CardDescription className="text-ui-navy-500 dark:text-ui-beige-300">Build out the SQL Tables in your project</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-ui-beige-200 dark:bg-ui-navy-900 rounded-md p-8 flex flex-col items-center justify-center h-40 space-y-3">
                            <p className="text-center font-medium text-ui-navy-700 dark:text-ui-beige-200">No tables defined yet</p>
                            <p className="text-center text-sm text-ui-navy-600 dark:text-ui-beige-300">
                                Define your database schema by creating tables and relationships for your SQL queries
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-ui-navy-700 text-white" onClick={() => router.push("/setup")}>
                            Setup Table Schema
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
