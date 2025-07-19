import { ProjectFormInput } from "./types";
import { projectStorage } from "./storage";

export type ValidationError = {
    [K in keyof ProjectFormInput | `databaseConnection.${keyof ProjectFormInput["databaseConnection"]}`]?: string;
};

export async function validateProjectForm(data: ProjectFormInput, projectId?: string): Promise<ValidationError> {
    const errors: ValidationError = {};

    // Validate name
    if (!data.name) {
        errors.name = "Project name is required";
    } else if (data.name.length < 3) {
        errors.name = "Project name must be at least 3 characters";
    } else if (data.name.length > 50) {
        errors.name = "Project name must be at most 50 characters";
    } else if (!/^[a-zA-Z0-9\s\-]+$/.test(data.name)) {
        errors.name = "Project name can only contain letters, numbers, spaces, and hyphens";
    } else {
        // Check if name already exists
        const nameExists = await projectStorage.projectNameExists(data.name, projectId);
        if (nameExists) {
            errors.name = "A project with this name already exists";
        }
    }

    // Validate database connection fields if enabled
    if (data.databaseConnection.enabled) {
        if (!data.databaseConnection.type) {
            errors["databaseConnection.type"] = "Connection type is required";
        }

        if (!data.databaseConnection.connectionString) {
            errors["databaseConnection.connectionString"] = "Connection string is required";
        }
    }

    return errors;
}
