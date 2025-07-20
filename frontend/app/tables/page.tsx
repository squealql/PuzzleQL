"use client";

import React from "react";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { PROJECT_NAME } from "@/lib/config";
import { data } from "motion/react-client";

// --- TYPE DEFINITIONS FOR BACKEND RESPONSE ---

/**
 * Represents a single column in a table as returned by the backend.
 * [columnName, columnType, isNullable]
 */
export type BackendColumn = [string, string, string];

/**
 * Represents a table as returned by the backend.
 * - columns: array of BackendColumn
 * - values: array of rows (each row is an array of values)
 */
export interface BackendTable {
  columns: BackendColumn[];
  values: any[][];
}

/**
 * The full backend response: a mapping from table name to BackendTable.
 */
export type BackendDatabaseResponse = Record<string, BackendTable>;

/**
 * Represents a row in a table, mapping column names to values.
 */
export interface TableRow {
  [columnName: string]: any;
}

/**
 * Represents a table in the frontend database model.
 * - name: table name
 * - columns: array of column names
 * - data: array of TableRow objects
 */
export interface DatabaseTable {
  name: string;
  columns: string[];
  data: TableRow[];
}

/**
 * The frontend database model: a mapping from table name to DatabaseTable.
 */
export interface Database {
  tables: Record<string, DatabaseTable>;
}
// Mock database with raw data (no schema info)
const mockDatabase: Database = {
    tables: {
        users: {
            name: "users",
            columns: ["id", "username", "email", "created_at", "is_active", "last_login"],
            data: [
                { id: 1, username: "john_doe", email: "john@example.com", created_at: "2024-01-15 10:30:00", is_active: true, last_login: "2024-07-15 14:22:33" },
                { id: 2, username: "jane_smith", email: "jane@example.com", created_at: "2024-01-16 14:20:00", is_active: true, last_login: "2024-07-14 09:15:21" },
                { id: 3, username: "bob_wilson", email: "bob@example.com", created_at: "2024-01-17 09:15:00", is_active: false, last_login: null },
            ],
        },
        orders: {
            name: "orders",
            columns: ["order_id", "user_id", "product_name", "quantity", "price", "order_date", "status"],
            data: [
                { order_id: 1001, user_id: 1, product_name: "MacBook Pro", quantity: 1, price: 1999.99, order_date: "2024-02-10", status: "delivered" },
                { order_id: 1002, user_id: 1, product_name: "USB-C Hub", quantity: 2, price: 49.99, order_date: "2024-02-10", status: "delivered" },
                { order_id: 1003, user_id: 2, product_name: "Wireless Mouse", quantity: 1, price: 29.99, order_date: "2024-02-12", status: "shipped" },
            ],
        },
    },
};

// --- STYLING ---

// Custom CSS for themed colors
const customCSS = `
:root {
  /* UI Colors (Muted/Subdued) */
  --ui-navy-950: hsl(202, 97%, 15%);
  --ui-navy-900: hsl(228, 76%, 29%);
  --ui-navy-700: hsl(200, 98%, 24%);
  --ui-navy-500: hsl(201, 61%, 37%);
  --ui-navy-400: hsl(201, 40%, 57%);
  --ui-navy-300: hsl(186, 75%, 59%);
  --ui-navy-200: hsl(190, 50%, 78%);
  --ui-navy-100: hsl(186, 75%, 85%);
  --ui-beige-200: hsl(39, 42%, 92%);
  --ui-beige-100: hsl(40, 60%, 95%);
}
.bg-ui-beige-100 { background-color: var(--ui-beige-100); }
.border-ui-navy-200 { border-color: var(--ui-navy-200); }
.text-ui-navy-900 { color: var(--ui-navy-900); }
.text-ui-navy-700 { color: var(--ui-navy-700); }
.text-ui-navy-600 { color: var(--ui-navy-600); }
.text-ui-navy-500 { color: var(--ui-navy-500); }
.bg-ui-navy-700 { background-color: var(--ui-navy-700); }
.dark\\:bg-ui-navy-950 { background-color: var(--ui-navy-950); }
.dark\\:bg-ui-navy-900 { background-color: var(--ui-navy-900); }
.dark\\:bg-ui-navy-800 { background-color: var(--ui-navy-800); }
.dark\\:text-white { color: white; }
.dark\\:text-ui-beige-300 { color: var(--ui-beige-300); }
.hover\\:bg-ui-navy-600:hover { background-color: var(--ui-navy-600); }
.text-ui-navy-200 { color: var(--ui-navy-200); }
`;

// Inject the CSS into the document head
if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = customCSS;
    document.head.appendChild(style);
}


// --- UI COMPONENTS ---

/**
 * A full-screen overlay with a centered spinner to indicate a loading state.
 * It prevents user interaction with the page content underneath.
 */
const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-ui-navy-300"></div>
        <span className="sr-only">Loading...</span>
    </div>
);

/**
 * A full-screen display for showing critical error messages.
 */
const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="fixed inset-0 bg-red-100 flex items-center justify-center z-50 text-center p-4">
        <div>
            <h2 className="text-2xl font-bold text-red-700 mb-4">An Error Occurred</h2>
            <p className="text-red-600">{message}</p>
        </div>
    </div>
);


// components/Sidebar.tsx
interface SidebarProps {
    tables: Record<string, DatabaseTable>;
    selectedTable: string | null;
    onTableSelect: (tableName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tables, selectedTable, onTableSelect }) => {
    return (
        <aside className="w-72 bg-ui-beige-100 border-r border-ui-navy-200 p-6">
            <h2 className="text-xl font-semibold text-ui-navy-900 mb-6">
                Database Tables
            </h2>
            <nav className="space-y-2">
                {Object.entries(tables).map(([tableName, table]) => (
                    <button
                        key={tableName}
                        onClick={() => onTableSelect(tableName)}
                        className={`w-full text-left p-4 rounded-lg transition-colors duration-150 border-2 ${
                            selectedTable === tableName ? "border-ui-navy-400 text-ui-navy-950 bg-ui-navy-200" : "border-transparent text-ui-navy-700 hover:bg-ui-beige-200"
                        }`}
                    >
                        <div className="font-medium text-base">{tableName}</div>
                        <div className={`text-sm mt-1 ${selectedTable === tableName ? "text-ui-navy-800" : "text-ui-navy-500"}`}>
                            {table.data.length} rows
                        </div>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

// components/TableDisplay.tsx
interface TableDisplayProps {
    table: DatabaseTable | null;
}

const TableDisplay: React.FC<TableDisplayProps> = ({ table }) => {
    if (!table) {
        return (
            <main className="flex-1 flex items-center justify-center bg-ui-beige-100">
                <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-medium mb-2 text-ui-navy-700">Select a Table</h3>
                    <p className="text-ui-navy-500">Choose a table from the sidebar to view its data</p>
                </div>
            </main>
        );
    }

    const formatCellValue = (value: any): string => {
        if (value === null || value === undefined) return "NULL";
        if (typeof value === "boolean") return value.toString().toUpperCase();
        return String(value);
    };

    return (
        <main className="flex-1 bg-ui-beige-100">
            <div className="border-b p-6 bg-ui-beige-100 border-ui-navy-200">
                <h1 className="text-2xl font-bold mb-2 text-ui-navy-900">{table.name}</h1>
                <p className="text-ui-navy-600">
                    Displaying {table.data.length} rows • {table.columns.length} columns
                </p>
            </div>
            <div className="p-6">
                <div className="border rounded-lg overflow-hidden shadow-sm bg-white border-ui-navy-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-ui-beige-100">
                                    {table.columns.map((columnName) => (
                                        <th key={columnName} className="px-4 py-3 text-left text-sm font-semibold border-b text-ui-navy-700 border-ui-navy-200">
                                            {columnName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.data.map((row, rowIndex) => (
                                    <tr key={rowIndex} className={`hover:bg-ui-navy-100 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-ui-beige-100'}`}>
                                        {table.columns.map((columnName) => {
                                            const cellValue = row[columnName];
                                            const isNull = cellValue === null || cellValue === undefined;
                                            return (
                                                <td key={columnName} className={`px-4 py-3 text-sm border-b border-ui-navy-200 ${isNull ? 'text-ui-navy-400 italic' : 'text-ui-navy-800'}`}>
                                                    <div className="max-w-xs truncate" title={formatCellValue(cellValue)}>
                                                        {formatCellValue(cellValue)}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

// --- MAIN APP COMPONENT ---

export default function SQLDataViewer() {
    // State Management
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [database,setDatabase] = useState<Database>(mockDatabase);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * This effect runs once after the component mounts. It simulates fetching
     * initial data from a server.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the backend response (JSON format as described in Json.txt)
                const response = await fetch("http://127.0.0.1:8000/getalltables");
                const json: BackendDatabaseResponse = await response.json();

                // Construct the frontend Database object
                const newDatabase: Database = { tables: {} };
                for (const tableName in json) {
                    const backendTable = json[tableName];
                    // Extract column names from the backend columns array
                    const columnNames = backendTable.columns.map((col) => col[0]);
                    // Convert each row (array) to a TableRow (object with column names as keys)
                    const data: TableRow[] = backendTable.values.map((rowArr) => {
                        const rowObj: TableRow = {};
                        columnNames.forEach((colName, idx) => {
                            rowObj[colName] = rowArr[idx];
                        });
                        return rowObj;
                    });
                    newDatabase.tables[tableName] = {
                        name: tableName,
                        columns: columnNames,
                        data,
                    };
                }
                setDatabase(newDatabase);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                console.error(errorMessage);
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Event Handlers
    const handleTableSelect = (tableName: string): void => {
        setSelectedTable(tableName);
    };

    // Derived State - Get current table data
    const currentTable = selectedTable ? database.tables[selectedTable] : null;

    // --- Conditional Rendering for Loading and Error States ---
    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    // --- Main Component Render ---
    return (
        <div className="min-h-screen bg-ui-beige-200 dark:bg-ui-navy-950">
            {/* Header */}
            <SiteHeader>
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white dark:bg-ui-navy-900">
                    <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm">
                        <div className="flex items-center gap-4">
                            <a href="/" className="font-bold text-lg text-ui-navy-900 dark:text-white">
                                {PROJECT_NAME}
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-150 font-medium bg-ui-navy-700 hover:bg-ui-navy-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4h6v6H4V4zm0 8h6v8H4v-8zm8-8h8v4h-8V4zm0 6h4v10h-4V10z" />
                                </svg>
                                Back to Blocks
                            </button>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </nav>
            </SiteHeader>

            {/* Page Title */}
            <div className="border-b shadow-sm bg-ui-navy-700 dark:bg-ui-navy-800 text-white">
                <div className="container mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold">SQL Raw Data Viewer</h1>
                    <p className="text-sm mt-1 text-ui-navy-200">View complete table data as stored in your database</p>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row">
                <Sidebar tables={database.tables} selectedTable={selectedTable} onTableSelect={handleTableSelect} />
                <TableDisplay table={currentTable} />
            </div>
        </div>
    );
}