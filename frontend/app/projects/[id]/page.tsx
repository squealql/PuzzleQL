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
            <div className="flex justify-center items-center h-96">
                <p>Loading project...</p>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <p className="text-muted-foreground">{project.description}</p>
                </div>
                <Link href="/projects">
                    <Button variant="outline">Back to Projects</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Information about this project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium">Created</p>
                            <p className="text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-medium">Last Updated</p>
                            <p className="text-sm text-muted-foreground">{new Date(project.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-medium">Database Connection</p>
                            {project.databaseConnection.enabled ? (
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline">{project.databaseConnection.type}</Badge>
                                    <p className="text-sm text-muted-foreground truncate max-w-xs">{project.databaseConnection.connectionString}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No database connection</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Query Builder Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>SQL Query Builder</CardTitle>
                        <CardDescription>Build SQL queries using block-based programming</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted rounded-md p-8 flex flex-col items-center justify-center h-40">
                            <p className="text-center text-muted-foreground">Query Builder Coming Soon</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button disabled className="w-full">
                            Launch Query Builder
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
