// Define project-related types
export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    databaseConnection: {
        enabled: boolean;
        type?: DatabaseType;
        connectionString?: string;
    };
    tables?: ProjectTable[];
    ownerId?: string;
}

// Database types
export type DatabaseType = "postgresql" | "mysql" | "sqlite" | "mssql";

export interface ProjectTable {
    id: string;
    name: string;
    source: "imported" | "created";
    columns?: {
        name: string;
        type: string;
        constraints?: string[];
    }[];
}

// Form input types
export interface ProjectFormInput {
    name: string;
    description: string;
    databaseConnection: {
        enabled: boolean;
        type?: DatabaseType;
        connectionString?: string;
    };
}
