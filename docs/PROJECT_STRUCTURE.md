# SQL Query Builder - Project Structure Documentation

## Overview

This document outlines the architecture and design decisions for the SQL Query Builder application, with a focus on the project creation workflow. The application is built using Next.js and will eventually integrate with Supabase for data persistence. Currently, it uses LocalStorage for data management to allow for independent development without requiring authentication.

## Project Structure

### Data Models

The core data models are defined in `frontend/lib/projects/types.ts`:

- `Project`: Represents a SQL query builder project with properties including ID, name, description, database connection details, and tables.
- `DatabaseType`: Enum for supported database types (PostgreSQL, MySQL, SQLite, MS SQL).
- `ProjectTable`: Represents a table within a project, with columns and constraints.
- `ProjectFormInput`: Form input type for creating/editing projects.

### Storage Interface

The storage layer is designed with a clean interface pattern that allows for easy switching between different storage backends:

- `ProjectStorage` interface (`frontend/lib/projects/storage.ts`): Defines the contract for any storage implementation.
- `LocalProjectStorage` implementation: Current implementation using browser's localStorage.

This design ensures that when we integrate with Supabase, we can create a new implementation of the `ProjectStorage` interface without changing the application's business logic or UI components.

### Components

#### Project Management

- `ProjectForm`: Form component for creating/editing projects with validation.
- `ProjectCard`: Card component displaying project information.
- `ProjectList`: Component for displaying a list of projects.
- `DBConnectionDialog`: Confirmation dialog for database connections.

#### Pages

- `/projects`: Main projects listing page.
- `/projects/new`: Project creation page.
- `/projects/[id]`: Project detail page (dashboard).

## Design Decisions

### 1. Storage Interface Pattern

The application uses a clean interface pattern for storage to ensure:

- Separation of concerns between data access and business logic.
- Easy switching between storage backends (localStorage now, Supabase later).
- Testability through potential mock implementations.

Example of the interface pattern:

```typescript
export interface ProjectStorage {
    getProject(id: string): Promise<Project | null>;
    listProjects(): Promise<Project[]>;
    createProject(projectData: ProjectFormInput): Promise<Project>;
    // Additional methods...
}
```

### 2. Form Validation

Form validation is implemented in `frontend/lib/projects/validation.ts` and provides:

- Client-side validation for required fields and format validation.
- Project name uniqueness check.
- Database connection validation when enabled.

### 3. Database Connection Confirmation

We implemented a confirmation step for database connections to:

- Prevent accidental connection to production databases.
- Provide clear information about the connection being established.
- Allow users to review connection details before proceeding.

## Supabase Integration Strategy

Currently, the application uses LocalStorage for data persistence. When integrating with Supabase, follow these steps:

1. Create Supabase tables matching the data models in `types.ts`.
2. Implement a `SupabaseProjectStorage` class that implements the `ProjectStorage` interface.
3. Update the authentication flow to use Supabase Auth.
4. Swap the storage implementation without changing the application's components.

### Example Supabase Schema (Future Implementation)

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  db_connection_enabled BOOLEAN DEFAULT FALSE,
  db_connection_type TEXT,
  db_connection_string TEXT,
  owner_id UUID REFERENCES auth.users(id)
);

-- Project tables
CREATE TABLE project_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table columns
CREATE TABLE table_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES project_tables(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  constraints JSONB
);
```

## Testing Strategy

1. Unit tests for validation functions.
2. Component tests for form submission and validation.
3. Integration tests for the project creation workflow.
4. End-to-end tests for the complete user journey.

## Future Enhancements

1. Implement the SQL query builder interface with block-based programming.
2. Add database schema import functionality.
3. Implement query execution against connected databases.
4. Add collaboration features for team projects.
5. Implement versioning for projects and queries.

## Conclusion

This architecture provides a solid foundation for the SQL Query Builder application, allowing for independent development of the project creation workflow while maintaining compatibility with future Supabase integration. The clean interface patterns and separation of concerns ensure that the application can evolve with minimal refactoring.