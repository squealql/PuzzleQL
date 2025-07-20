"use client";

import React, { useState, useRef } from "react";
import { Database, Table, Key, FileText, Upload, AlertCircle, ArrowRight, Link as LinkIcon } from "lucide-react";

// --- Enhanced Type Definitions ---
interface Column {
    name: string;
    dataType: string;
    constraints: string[];
    defaultValue: string | null;
    comment: string | null;
    foreignKey: { table: string; column: string } | null;
}

interface Constraint {
    type: string;
    definition: string;
    column?: string;
    references?: { table: string; column: string };
}

interface TableType {
    tableName: string;
    columns: Column[];
    constraints: Constraint[];
}

interface Relationship {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
    type: string;
}

interface DatabaseSchema {
    tables: TableType[];
    relationships: Relationship[];
    sqlQueries: string[];
}

interface TablePosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Positions {
    [tableName: string]: TablePosition;
}

interface ConstraintColorMap {
    [key: string]: string;
}

// --- Sample SQL ---
const sampleSQL: string = `
  CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );

  CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date DATE NOT NULL
  );

  CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL
  );

  CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    book_id INT REFERENCES books(book_id),
    quantity INT NOT NULL
  );
`;

// --- Enhanced Parser Logic with Proper Typings ---
const parseMultipleTables = (sql: string): DatabaseSchema => {
    try {
        const tables: TableType[] = [];
        const relationships: Relationship[] = [];
        const sqlQueries: string[] = [];

        // Use regex to match all CREATE TABLE ... (...); blocks
        const createTableRegex: RegExp = /CREATE\s+TABLE[\s\S]*?\([^;]*\)[\s\S]*?;/gi;
        const createStatements: RegExpMatchArray | null = sql.match(createTableRegex);

        if (createStatements) {
            createStatements.forEach((statement: string) => {
                console.log(statement);
                const table: TableType | null = parseCreateTable(statement);
                if (table) {
                    tables.push(table);
                    sqlQueries.push(statement);
                }
            });
        }

        // Extract relationships from foreign key constraints
        tables.forEach((table: TableType) => {
            table.columns.forEach((column: Column) => {
                if (column.foreignKey) {
                    relationships.push({
                        fromTable: table.tableName,
                        fromColumn: column.name,
                        toTable: column.foreignKey.table,
                        toColumn: column.foreignKey.column,
                        type: "foreign_key",
                    });
                }
            });

            // Check table-level foreign key constraints
            table.constraints.forEach((constraint: Constraint) => {
                if (constraint.type === "FOREIGN KEY" && constraint.references) {
                    relationships.push({
                        fromTable: table.tableName,
                        fromColumn: constraint.column || "",
                        toTable: constraint.references.table,
                        toColumn: constraint.references.column,
                        type: "foreign_key",
                    });
                }
            });
        });

        return { tables, relationships, sqlQueries };
    } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : "Unknown parsing error";
        throw new Error(`Parse error: ${errorMessage}`);
    }
};

const parseCreateTable = (sql: string): TableType | null => {
    try {
        const cleanSql: string = sql.trim().replace(/\s+/g, " ");

        // Extract table name (PostgreSQL: double quotes or unquoted)
        const tableMatch: RegExpMatchArray | null = cleanSql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?"?(\w+)"?\s*\(/i);
        if (!tableMatch) {
            throw new Error("Invalid CREATE TABLE statement");
        }

        const tableName: string = tableMatch[1];

        // Extract the column definitions between parentheses
        const columnsMatch: RegExpMatchArray | null = cleanSql.match(/\((.*)\)(?:\s*;?)$/i);
        if (!columnsMatch) {
            throw new Error("Could not find column definitions");
        }

        const columnsText: string = columnsMatch[1];
        const columns: Column[] = [];
        const constraints: Constraint[] = [];

        let depth: number = 0;
        let current: string = "";
        let inQuotes: boolean = false;
        let quoteChar: string = "";

        for (let i: number = 0; i < columnsText.length; i++) {
            const char: string = columnsText[i];
            const prevChar: string = i > 0 ? columnsText[i - 1] : "";

            if ((char === '"' || char === "'" || char === "`") && prevChar !== "\\") {
                if (!inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuotes = false;
                    quoteChar = "";
                }
            }

            if (!inQuotes) {
                if (char === "(") depth++;
                else if (char === ")") depth--;
            }

            if (char === "," && depth === 0 && !inQuotes) {
                const item: string = current.trim();
                if (item) {
                    parseColumnOrConstraint(item, columns, constraints);
                }
                current = "";
            } else {
                current += char;
            }
        }

        if (current.trim()) {
            parseColumnOrConstraint(current.trim(), columns, constraints);
        }

        return { tableName, columns, constraints };
    } catch (err: unknown) {
        const errorMessage: string = err instanceof Error ? err.message : "Unknown parsing error";
        throw new Error(`Parse error for table: ${errorMessage}`);
    }
};

const parseConstraint = (constraintDef: string): Constraint => {
    // Get constraint type directly
    const constraint: Constraint = {
        type: getConstraintType(constraintDef),
        definition: constraintDef,
    };

    // Parse FOREIGN KEY constraints (PostgreSQL: double quotes or unquoted)
    const fkMatch: RegExpMatchArray | null = constraintDef.match(/FOREIGN\s+KEY\s*\(\s*"?(\w+)"?\s*\)\s+REFERENCES\s+"?(\w+)"?\s*\(\s*"?(\w+)"?\s*\)/i);
    if (fkMatch) {
        constraint.column = fkMatch[1];
        constraint.references = {
            table: fkMatch[2],
            column: fkMatch[3],
        };
    }

    return constraint;
};

const parseColumn = (columnDef: string): Column | null => {
    // Remove double quotes from identifiers
    const parts: string[] = columnDef.trim().replace(/"/g, "").split(/\s+/);
    if (parts.length < 2) return null;

    const name: string = parts[0];
    const dataType: string = parts[1];

    // Recognize SERIAL/BIGSERIAL as auto-increment
    const isSerial: boolean = /^(SERIAL|BIGSERIAL)$/i.test(dataType);

    const column: Column = {
        name,
        dataType,
        constraints: [],
        defaultValue: null,
        comment: null,
        foreignKey: null,
    };

    if (isSerial) {
        column.constraints.push("AUTO_INCREMENT");
    }

    const remaining: string = parts.slice(2).join(" ");
    const remainingUpper: string = remaining.toUpperCase();

    // Check for constraints
    if (remainingUpper.includes("PRIMARY KEY")) column.constraints.push("PRIMARY KEY");
    if (remainingUpper.includes("NOT NULL")) column.constraints.push("NOT NULL");
    if (remainingUpper.includes("UNIQUE")) column.constraints.push("UNIQUE");

    // Parse inline FOREIGN KEY references (PostgreSQL: double quotes or unquoted)
    const fkMatch: RegExpMatchArray | null = remaining.match(/REFERENCES\s+"?(\w+)"?\s*\(\s*"?(\w+)"?\s*\)/i);
    if (fkMatch) {
        column.foreignKey = {
            table: fkMatch[1],
            column: fkMatch[2],
        };
        column.constraints.push("FOREIGN KEY");
    }

    // Extract default value (PostgreSQL: DEFAULT ...)
    const defaultMatch: RegExpMatchArray | null = columnDef.match(/DEFAULT\s+([^,\s]+(?:\([^)]*\))?)/i);
    if (defaultMatch) {
        column.defaultValue = defaultMatch[1];
    }

    return column;
};

const getConstraintType = (constraint: string): string => {
    const upper: string = constraint.toUpperCase();
    if (upper.includes("PRIMARY KEY")) return "PRIMARY KEY";
    if (upper.includes("FOREIGN KEY")) return "FOREIGN KEY";
    if (upper.includes("UNIQUE")) return "UNIQUE";
    if (upper.includes("CHECK")) return "CHECK";
    if (upper.includes("INDEX") || upper.match(/^KEY\s/)) return "INDEX";
    return "CONSTRAINT";
};

const parseColumnOrConstraint = (item: string, columns: Column[], constraints: Constraint[]): void => {
    const constraintTypes: string[] = ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK", "INDEX", "KEY"];
    const isConstraint: boolean = constraintTypes.some((type) => item.toUpperCase().includes(type) && !item.toUpperCase().match(/^\w+\s+\w+/));

    if (isConstraint) {
        const constraint: Constraint = parseConstraint(item);
        constraints.push(constraint);
    } else {
        const column: Column | null = parseColumn(item);
        if (column) {
            columns.push(column);
        }
    }
};

const getTablePositions = (tables: TableType[]): Positions => {
    const positions: Positions = {};
    const cols: number = Math.ceil(Math.sqrt(tables.length));
    const tableWidth: number = 280;
    const tableHeight: number = 200;
    const spacingX: number = 160; // Increased for clearer arrows
    const spacingY: number = 60;

    tables.forEach((table: TableType, index: number) => {
        const row: number = Math.floor(index / cols);
        const col: number = index % cols;

        positions[table.tableName] = {
            x: col * (tableWidth + spacingX) + 50,
            y: row * (tableHeight + spacingY) + 50,
            width: tableWidth,
            height: Math.max(tableHeight, 80 + table.columns.length * 25),
        };
    });

    return positions;
};

const drawRelationships = (relationships: Relationship[], positions: Positions): React.ReactElement[] => {
    return relationships.map((rel: Relationship, index: number) => {
        const fromPos: TablePosition | undefined = positions[rel.fromTable];
        const toPos: TablePosition | undefined = positions[rel.toTable];

        if (!fromPos || !toPos) return <g key={index} />;

        const fromX: number = fromPos.x + fromPos.width;
        const fromY: number = fromPos.y + fromPos.height / 2;
        const toX: number = toPos.x;
        const toY: number = toPos.y + toPos.height / 2;
        const midX: number = (fromX + toX) / 2;

        return (
            <g key={index}>
                <path
                    d={`M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`}
                    stroke="hsl(var(--block-blue-600))"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                />
                <text x={midX} y={(fromY + toY) / 2 - 10} textAnchor="middle" style={{ fontSize: "10px", fill: "hsl(var(--block-blue-600))" }}>
                    {rel.fromColumn} → {rel.toColumn}
                </text>
            </g>
        );
    });
};

const getConstraintColor = (constraint: string | null): string => {
    const colors: ConstraintColorMap = {
        "PRIMARY KEY": "hsl(var(--ui-navy-400))",
        "NOT NULL": "hsl(var(--ui-terracotta-400))",
        UNIQUE: "hsl(var(--block-pink-400))",
        AUTO_INCREMENT: "hsl(var(--ui-navy-300))",
        "FOREIGN KEY": "hsl(var(--block-blue-400))",
    };

    return constraint && colors[constraint] ? colors[constraint] : "hsl(var(--ui-navy-200))";
};

// --- Main Component with Enhanced Typings ---
const SQLTableVisualizer: React.FC = () => {
    const [sqlInput, setSqlInput] = useState<string>("");
    const [parsedSchema, setParsedSchema] = useState<DatabaseSchema | null>(null);
    const [error, setError] = useState<string>("");
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    const svgRef = useRef<SVGSVGElement | null>(null);

    const handleParse = (): void => {
        setError("");
        setParsedSchema(null);
        setSelectedTable(null);

        if (!sqlInput.trim()) {
            setError("Please enter CREATE TABLE statement(s)");
            return;
        }

        try {
            const result: DatabaseSchema = parseMultipleTables(sqlInput);
            if (result.tables.length === 0) {
                setError("No valid CREATE TABLE statements found");
                return;
            }
            setParsedSchema(result);
        } catch (err: unknown) {
            const errorMessage: string = err instanceof Error ? err.message : "Unknown error occurred";
            setError(errorMessage);
        }
    };

    const handleLoadSample = (): void => {
        setSqlInput(sampleSQL);
    };

    const handleTableSelect = (tableName: string): void => {
        setSelectedTable(selectedTable === tableName ? null : tableName);
    };

    const handleSetupProject = async (): Promise<void> => {
        let workingCommit = true;
        console.log(parsedSchema?.sqlQueries);
        if (parsedSchema?.sqlQueries) {
            for (const tableCommand of parsedSchema.sqlQueries) {
                try {
                    const response = await fetch("http://127.0.0.1:8000/create_send", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            sql: tableCommand,
                            userid: "1",
                        }),
                    });

                    if (!response) {
                        workingCommit = false;
                    }
                } catch (e) {
                    console.error("Failed to send table command:", e);
                    workingCommit = false;
                }
            }
        }

        if (workingCommit) {
            try {
                const commitResponse = await fetch("http://127.0.0.1:8000/commit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sql: "",
                    }),
                });

                if (!commitResponse) {
                    console.error("Commit error");
                } else {
                    console.log("Database setup completed successfully!");
                }
            } catch (e: unknown) {
                console.error("Failed to commit:", e instanceof Error ? e.message : "Unknown error");
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setSqlInput(e.target.value);
    };

    return (
        <div className="min-h-screen" style={{ background: "hsl(var(--ui-beige-100))" }}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div
                    className="flex items-center justify-between mb-8"
                    style={{ background: "hsl(var(--ui-navy-900))", color: "white", borderRadius: "0.5rem", padding: "1rem" }}
                >
                    <div className="flex items-center gap-3">
                        <Database className="w-8 h-8" style={{ color: "hsl(var(--ui-navy-300))" }} />
                        <h1 className="text-3xl font-bold">PostgreSQL Schema Visualizer</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {parsedSchema && (
                            <button
                                onClick={handleSetupProject}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{ background: "hsl(var(--ui-navy-700))", color: "white" }}
                            >
                                <Upload className="w-4 h-4" />
                                Setup Project
                            </button>
                        )}
                    </div>
                </div>
                <div className="grid xl:grid-cols-3 gap-8">
                    {/* Input Section */}
                    <div className="xl:col-span-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: "hsl(var(--ui-navy-900))" }}>
                                <FileText className="w-5 h-5" style={{ color: "hsl(var(--ui-navy-700))" }} />
                                SQL Input
                            </h2>
                            <button
                                onClick={handleLoadSample}
                                className="text-sm px-3 py-1 rounded"
                                style={{ background: "hsl(var(--ui-navy-200))", color: "hsl(var(--ui-navy-900))" }}
                            >
                                Load Sample
                            </button>
                        </div>
                        <textarea
                            value={sqlInput}
                            onChange={handleInputChange}
                            placeholder="Paste your CREATE TABLE statements here..."
                            className="w-full h-64 p-4 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            style={{ background: "white", border: "1px solid hsl(var(--ui-navy-200))", color: "hsl(var(--ui-navy-900))" }}
                        />
                        <button
                            onClick={handleParse}
                            disabled={!sqlInput.trim()}
                            className="w-full py-3 rounded-lg font-medium"
                            style={{
                                background: "hsl(var(--ui-navy-700))",
                                color: "white",
                                opacity: !sqlInput.trim() ? 0.5 : 1,
                                cursor: !sqlInput.trim() ? "not-allowed" : "pointer",
                            }}
                        >
                            Parse SQL
                        </button>
                        {error && (
                            <div
                                className="flex items-center gap-2 p-4 rounded-lg"
                                style={{
                                    background: "hsl(var(--ui-terracotta-300))",
                                    border: "1px solid hsl(var(--ui-terracotta-500))",
                                    color: "hsl(var(--ui-terracotta-700))",
                                }}
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        {/* Relationships Summary */}
                        {parsedSchema && parsedSchema.relationships.length > 0 && (
                            <div className="rounded-lg p-4" style={{ background: "hsl(var(--ui-beige-200))", border: "1px solid hsl(var(--ui-navy-200))" }}>
                                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "hsl(var(--ui-navy-700))" }}>
                                    <LinkIcon className="w-4 h-4" />
                                    Relationships ({parsedSchema.relationships.length})
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {parsedSchema.relationships.map((rel: Relationship, index: number) => (
                                        <div key={index} className="flex items-center gap-2" style={{ color: "hsl(var(--block-blue-600))" }}>
                                            <span className="font-medium">
                                                {rel.fromTable}.{rel.fromColumn}
                                            </span>
                                            <ArrowRight className="w-3 h-3" />
                                            <span className="font-medium">
                                                {rel.toTable}.{rel.toColumn}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Schema Diagram */}
                    <div className="xl:col-span-2 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: "hsl(var(--ui-navy-700))" }}>
                            <Database className="w-5 h-5" />
                            Database Schema
                            {parsedSchema && (
                                <span className="text-sm" style={{ color: "hsl(var(--ui-navy-400))" }}>
                                    ({parsedSchema.tables.length} tables)
                                </span>
                            )}
                        </h2>
                        {parsedSchema ? (
                            <div
                                className="rounded-lg overflow-hidden shadow-sm"
                                style={{ background: "hsl(var(--ui-beige-200))", border: "1px solid hsl(var(--ui-navy-200))" }}
                            >
                                {/* Schema Diagram */}
                                <div className="p-4 overflow-auto" style={{ height: "600px" }}>
                                    {(() => {
                                        const positions: Positions = getTablePositions(parsedSchema.tables);
                                        const maxX: number = Math.max(...Object.values(positions).map((p: TablePosition) => p.x + p.width)) + 50;
                                        const maxY: number = Math.max(...Object.values(positions).map((p: TablePosition) => p.y + p.height)) + 50;

                                        return (
                                            <svg
                                                ref={svgRef}
                                                width={Math.max(maxX, 800)}
                                                height={Math.max(maxY, 500)}
                                                style={{
                                                    border: "1px solid hsl(var(--ui-navy-200))",
                                                    borderRadius: "0.5rem",
                                                    background: "hsl(var(--ui-beige-100))",
                                                }}
                                            >
                                                <defs>
                                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                                        <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--block-blue-600))" />
                                                    </marker>
                                                </defs>
                                                {/* Draw relationships first */}
                                                {drawRelationships(parsedSchema.relationships, positions)}
                                                {/* Draw tables */}
                                                {parsedSchema.tables.map((table: TableType, tableIndex: number) => {
                                                    const pos: TablePosition = positions[table.tableName];
                                                    return (
                                                        <g key={tableIndex}>
                                                            {/* Table container */}
                                                            <rect
                                                                x={pos.x}
                                                                y={pos.y}
                                                                width={pos.width}
                                                                height={pos.height}
                                                                fill="hsl(var(--ui-beige-200))"
                                                                stroke="hsl(var(--ui-navy-200))"
                                                                strokeWidth={selectedTable === table.tableName ? "3" : "1"}
                                                                rx="8"
                                                                className="cursor-pointer"
                                                                onClick={() => handleTableSelect(table.tableName)}
                                                            />
                                                            {/* Table header */}
                                                            <rect x={pos.x} y={pos.y} width={pos.width} height="40" fill="hsl(var(--ui-navy-700))" rx="8" />
                                                            <rect x={pos.x} y={pos.y + 32} width={pos.width} height="8" fill="hsl(var(--ui-navy-700))" />
                                                            {/* Table name */}
                                                            <text
                                                                x={pos.x + pos.width / 2}
                                                                y={pos.y + 25}
                                                                textAnchor="middle"
                                                                className="font-semibold text-xs"
                                                                style={{ fill: "white" }}
                                                            >
                                                                {table.tableName}
                                                            </text>
                                                            {/* Columns */}
                                                            {table.columns.slice(0, 8).map((column: Column, colIndex: number) => (
                                                                <g key={colIndex}>
                                                                    <text
                                                                        x={pos.x + 12}
                                                                        y={pos.y + 60 + colIndex * 22}
                                                                        className="text-[10px]"
                                                                        style={{ fill: "hsl(var(--ui-navy-900))" }}
                                                                    >
                                                                        <tspan className="font-medium">{column.name}</tspan>
                                                                        <tspan style={{ fill: "hsl(var(--ui-navy-400))" }}> : {column.dataType}</tspan>
                                                                    </text>
                                                                    {/* Primary key icon */}
                                                                    {column.constraints.includes("PRIMARY KEY") && (
                                                                        <circle
                                                                            cx={pos.x + pos.width - 20}
                                                                            cy={pos.y + 56 + colIndex * 22}
                                                                            r="6"
                                                                            fill="hsl(var(--ui-navy-400))"
                                                                        />
                                                                    )}
                                                                    {/* Foreign key icon */}
                                                                    {(column.constraints.includes("FOREIGN KEY") || column.foreignKey) && (
                                                                        <circle
                                                                            cx={pos.x + pos.width - 35}
                                                                            cy={pos.y + 56 + colIndex * 22}
                                                                            r="6"
                                                                            fill="hsl(var(--block-blue-600))"
                                                                        />
                                                                    )}
                                                                </g>
                                                            ))}
                                                            {/* Show more columns indicator */}
                                                            {table.columns.length > 8 && (
                                                                <text
                                                                    x={pos.x + 12}
                                                                    y={pos.y + 60 + 8 * 22}
                                                                    className="text-[10px]"
                                                                    style={{ fill: "hsl(var(--ui-navy-400))" }}
                                                                >
                                                                    +{table.columns.length - 8} more...
                                                                </text>
                                                            )}
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                        );
                                    })()}
                                </div>
                                {/* Table Details Panel */}
                                {selectedTable && (
                                    <div className="border-t p-6" style={{ borderColor: "hsl(var(--ui-navy-200))", background: "hsl(var(--ui-beige-100))" }}>
                                        {(() => {
                                            const table: TableType | undefined = parsedSchema.tables.find((t: TableType) => t.tableName === selectedTable);
                                            if (!table) return null;

                                            return (
                                                <div>
                                                    <h3
                                                        className="text-lg font-semibold mb-4 flex items-center gap-2"
                                                        style={{ color: "hsl(var(--ui-navy-700))" }}
                                                    >
                                                        <Table className="w-5 h-5" />
                                                        {table.tableName} Details
                                                    </h3>
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        {/* Columns */}
                                                        <div>
                                                            <h4 className="font-semibold mb-3" style={{ color: "hsl(var(--ui-navy-700))" }}>
                                                                Columns ({table.columns.length})
                                                            </h4>
                                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                                {table.columns.map((column: Column, index: number) => (
                                                                    <div
                                                                        key={index}
                                                                        className="border rounded p-3"
                                                                        style={{ borderColor: "hsl(var(--ui-navy-200))", background: "white" }}
                                                                    >
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium" style={{ color: "hsl(var(--ui-navy-900))" }}>
                                                                                    {column.name}
                                                                                </span>
                                                                                <span
                                                                                    className="text-xs px-2 py-1 rounded"
                                                                                    style={{
                                                                                        background: "hsl(var(--ui-navy-200))",
                                                                                        color: "hsl(var(--ui-navy-900))",
                                                                                    }}
                                                                                >
                                                                                    {column.dataType}
                                                                                </span>
                                                                            </div>
                                                                            {column.constraints.includes("PRIMARY KEY") && (
                                                                                <Key className="w-4 h-4" style={{ color: "hsl(var(--ui-navy-400))" }} />
                                                                            )}
                                                                        </div>
                                                                        {column.constraints.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1 mb-1">
                                                                                {column.constraints.map((constraint: string, i: number) => (
                                                                                    <span
                                                                                        key={i}
                                                                                        className="text-xs px-2 py-1 rounded-full"
                                                                                        style={{ background: getConstraintColor(constraint) }}
                                                                                    >
                                                                                        {constraint}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {column.foreignKey && (
                                                                            <div className="text-xs" style={{ color: "hsl(var(--block-blue-600))" }}>
                                                                                References: {column.foreignKey.table}.{column.foreignKey.column}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {/* Relationships */}
                                                        <div>
                                                            {(() => {
                                                                const relatedTables: Relationship[] = parsedSchema.relationships.filter(
                                                                    (rel: Relationship) => rel.fromTable === selectedTable || rel.toTable === selectedTable
                                                                );

                                                                return (
                                                                    <div>
                                                                        <h4 className="font-semibold mb-3" style={{ color: "hsl(var(--ui-navy-700))" }}>
                                                                            Related Tables ({relatedTables.length})
                                                                        </h4>
                                                                        {relatedTables.length > 0 ? (
                                                                            <div className="space-y-2">
                                                                                {relatedTables.map((rel: Relationship, index: number) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        className="flex items-center gap-2 text-sm p-2 rounded"
                                                                                        style={{ background: "hsl(var(--block-blue-400))", color: "white" }}
                                                                                    >
                                                                                        {rel.fromTable === selectedTable ? (
                                                                                            <>
                                                                                                <span className="font-medium">{rel.fromColumn}</span>
                                                                                                <ArrowRight className="w-3 h-3" />
                                                                                                <span
                                                                                                    className="font-medium cursor-pointer hover:underline"
                                                                                                    onClick={() => handleTableSelect(rel.toTable)}
                                                                                                >
                                                                                                    {rel.toTable}.{rel.toColumn}
                                                                                                </span>
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <span
                                                                                                    className="font-medium cursor-pointer hover:underline"
                                                                                                    onClick={() => handleTableSelect(rel.fromTable)}
                                                                                                >
                                                                                                    {rel.fromTable}.{rel.fromColumn}
                                                                                                </span>
                                                                                                <ArrowRight className="w-3 h-3" />
                                                                                                <span className="font-medium">{rel.toColumn}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-gray-500 text-sm">No relationships found for this table.</p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed rounded-lg p-12 text-center"
                                style={{ background: "hsl(var(--ui-beige-200))", borderColor: "hsl(var(--ui-navy-200))" }}
                            >
                                <Database className="w-12 h-12 mx-auto mb-4" style={{ color: "hsl(var(--ui-navy-200))" }} />
                                <p className="text-gray-500">Enter CREATE TABLE statements and click &quot;Parse SQL&quot; to visualize the database schema</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SQLTableVisualizer;
