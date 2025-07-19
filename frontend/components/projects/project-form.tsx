"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { projectStorage } from "@/lib/projects/storage";
import { ProjectFormInput } from "@/lib/projects/types";
import { validateProjectForm, ValidationError } from "@/lib/projects/validation";
import { DBConnectionDialog } from "./db-connection-dialog";

type ProjectFormProps = {
    initialData?: ProjectFormInput;
    projectId?: string;
};

export function ProjectForm({ initialData, projectId }: ProjectFormProps) {
    const router = useRouter();
    const isEditing = !!projectId;

    const [formData, setFormData] = useState<ProjectFormInput>(
        initialData || {
            name: "",
            description: "",
            databaseConnection: {
                enabled: false,
                type: "postgresql",
                connectionString: "",
            },
        }
    );

    const [errors, setErrors] = useState<ValidationError>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConnectionDialog, setShowConnectionDialog] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("databaseConnection.")) {
            const field = name.split(".")[1] as keyof typeof formData.databaseConnection;
            setFormData({
                ...formData,
                databaseConnection: {
                    ...formData.databaseConnection,
                    [field]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            databaseConnection: {
                ...formData.databaseConnection,
                enabled: checked,
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            // Validate form
            const validationErrors = await validateProjectForm(formData, projectId);

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setIsSubmitting(false);
                return;
            }

            // If database connection is enabled, show confirmation dialog
            if (formData.databaseConnection.enabled) {
                setShowConnectionDialog(true);
                setIsSubmitting(false);
                return;
            }

            // Otherwise, proceed with form submission
            await submitForm();
        } catch (error) {
            console.error("Error submitting form:", error);
            setIsSubmitting(false);
        }
    };

    const submitForm = async () => {
        setIsSubmitting(true);

        try {
            if (isEditing) {
                await projectStorage.updateProject(projectId, formData);
            } else {
                await projectStorage.createProject(formData);
            }

            // Navigate to projects list page
            router.push("/projects");
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDialogConfirm = () => {
        setShowConnectionDialog(false);
        submitForm();
    };

    const handleDialogCancel = () => {
        setShowConnectionDialog(false);
        setIsSubmitting(false);
    };

    return (
        <>
            <Card className="w-full">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">{isEditing ? "Edit Project" : "Create a New Project"}</CardTitle>
                        <CardDescription>
                            {isEditing ? "Update your project details" : "Enter the details for your new SQL query builder project"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Project Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Project Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="My SQL Project"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            <p className="text-xs text-muted-foreground">Must be 3-50 characters, alphanumeric with spaces and hyphens.</p>
                        </div>

                        {/* Project Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your project"
                                className="min-h-24"
                            />
                        </div>

                        {/* Database Connection */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="db-enabled" checked={formData.databaseConnection.enabled} onCheckedChange={handleCheckboxChange} />
                                <Label htmlFor="db-enabled">Enable Database Connection</Label>
                            </div>

                            {formData.databaseConnection.enabled && (
                                <div className="space-y-4 pl-6 border-l-2 border-muted p-4">
                                    {/* Connection Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="databaseConnection.type">
                                            Connection Type <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="databaseConnection.type"
                                            name="databaseConnection.type"
                                            value={formData.databaseConnection.type}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                                        >
                                            <option value="postgresql">PostgreSQL</option>
                                            <option value="mysql">MySQL</option>
                                            <option value="sqlite">SQLite</option>
                                            <option value="mssql">Microsoft SQL Server</option>
                                        </select>
                                        {errors["databaseConnection.type"] && <p className="text-sm text-red-500">{errors["databaseConnection.type"]}</p>}
                                    </div>

                                    {/* Connection String */}
                                    <div className="space-y-2">
                                        <Label htmlFor="databaseConnection.connectionString">
                                            Connection String <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="databaseConnection.connectionString"
                                            name="databaseConnection.connectionString"
                                            value={formData.databaseConnection.connectionString}
                                            onChange={handleChange}
                                            placeholder="postgresql://username:password@localhost:5432/database"
                                            className={errors["databaseConnection.connectionString"] ? "border-red-500" : ""}
                                        />
                                        {errors["databaseConnection.connectionString"] && (
                                            <p className="text-sm text-red-500">{errors["databaseConnection.connectionString"]}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Database Connection Confirmation Dialog */}
            <DBConnectionDialog
                open={showConnectionDialog}
                onConfirm={handleDialogConfirm}
                onCancel={handleDialogCancel}
                connectionDetails={{
                    type: formData.databaseConnection.type,
                    connectionString: formData.databaseConnection.connectionString,
                }}
            />
        </>
    );
}
