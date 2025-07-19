import { Project, ProjectFormInput } from "./types";

// Interface for project storage - can be implemented with different backends
export interface ProjectStorage {
    getProject(id: string): Promise<Project | null>;
    listProjects(): Promise<Project[]>;
    createProject(projectData: ProjectFormInput): Promise<Project>;
    updateProject(id: string, updates: Partial<ProjectFormInput>): Promise<Project | null>;
    deleteProject(id: string): Promise<boolean>;
    projectNameExists(name: string, excludeId?: string): Promise<boolean>;
}

// LocalStorage implementation
export class LocalProjectStorage implements ProjectStorage {
    private readonly STORAGE_KEY = "mysqueal-projects";

    // Get projects from localStorage
    private async getProjects(): Promise<Project[]> {
        if (typeof window === "undefined") return [];

        const projectsData = localStorage.getItem(this.STORAGE_KEY);
        return projectsData ? JSON.parse(projectsData) : [];
    }

    // Save projects to localStorage
    private async saveProjects(projects: Project[]): Promise<void> {
        if (typeof window === "undefined") return;

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }

    // Check if a project with given name exists (for validation)
    async projectNameExists(name: string, excludeId?: string): Promise<boolean> {
        const projects = await this.getProjects();
        return projects.some((p) => p.name.toLowerCase() === name.toLowerCase() && (!excludeId || p.id !== excludeId));
    }

    // Get a specific project
    async getProject(id: string): Promise<Project | null> {
        const projects = await this.getProjects();
        return projects.find((p) => p.id === id) || null;
    }

    // List all projects
    async listProjects(): Promise<Project[]> {
        return this.getProjects();
    }

    // Create a new project
    async createProject(projectData: ProjectFormInput): Promise<Project> {
        const projects = await this.getProjects();

        // If db connection is disabled, clean up those fields
        if (!projectData.databaseConnection.enabled) {
            projectData.databaseConnection.type = undefined;
            projectData.databaseConnection.connectionString = undefined;
        }

        const newProject: Project = {
            ...projectData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tables: [],
        };

        projects.push(newProject);
        await this.saveProjects(projects);

        return newProject;
    }

    // Update an existing project
    async updateProject(id: string, updates: Partial<ProjectFormInput>): Promise<Project | null> {
        const projects = await this.getProjects();
        const index = projects.findIndex((p) => p.id === id);

        if (index === -1) return null;

        // If updating db connection and it's disabled, clean up those fields
        if (updates.databaseConnection && !updates.databaseConnection.enabled) {
            updates.databaseConnection.type = undefined;
            updates.databaseConnection.connectionString = undefined;
        }

        const updatedProject = {
            ...projects[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        projects[index] = updatedProject;
        await this.saveProjects(projects);

        return updatedProject;
    }

    // Delete a project
    async deleteProject(id: string): Promise<boolean> {
        const projects = await this.getProjects();
        const filteredProjects = projects.filter((p) => p.id !== id);

        if (filteredProjects.length === projects.length) {
            return false; // Project not found
        }

        await this.saveProjects(filteredProjects);
        return true;
    }
}

// Export a singleton instance
export const projectStorage = new LocalProjectStorage();
