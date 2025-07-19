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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{project.name}</CardTitle>
        <CardDescription>
          Created on {formatDate(project.createdAt)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3">
          {project.description || "No description provided."}
        </p>
        
        {project.databaseConnection.enabled && (
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Database: {project.databaseConnection.type}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${project.id}`}>
            Open
          </Link>
        </Button>
        
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(project.id)}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}