import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects/types";

type ProjectCardProps = {
    project: Project;
    onDelete?: (id: string) => void;
};

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card className="h-full flex flex-col bg-white dark:bg-ui-navy-800 border-ui-navy-200 dark:border-ui-navy-700">
            <CardHeader>
                <CardTitle className="truncate text-ui-navy-900 dark:text-white">{project.name}</CardTitle>
                <CardDescription className="text-ui-navy-500 dark:text-ui-beige-300">Created on {formatDate(project.createdAt)}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-sm text-ui-navy-700 dark:text-ui-beige-200 line-clamp-3">{project.description || "No description provided."}</p>

                {project.databaseConnection.enabled && (
                    <div className="mt-4">
                        <p className="text-xs font-medium text-ui-navy-500 dark:text-ui-beige-300">Database: {project.databaseConnection.type}</p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between border-t border-ui-navy-200 dark:border-ui-navy-700 pt-4">
                <Button variant="outline" size="sm" asChild className="dark:text-white dark:border-ui-navy-500 dark:hover:bg-ui-navy-700">
                    <Link href={`/projects/${project.id}`}>Open</Link>
                </Button>

                {onDelete && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(project.id)}
                        className="bg-ui-terracotta-500 hover:bg-ui-terracotta-600 dark:bg-ui-terracotta-700 dark:hover:bg-ui-terracotta-600"
                    >
                        Delete
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
