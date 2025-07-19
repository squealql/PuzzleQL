'use client'

import React, { useState, useRef } from 'react';
import { Database, Table, Key, FileText, Sun, Moon, Download, AlertCircle, Link, ArrowRight } from 'lucide-react';
// 1. Update interfaces for stricter typing
interface Column {
    name: string;
    dataType: string;
    constraints: string[];
    defaultValue: any;
    comment: any;
    foreignKey: { table: string; column: string } | null;
}
interface TableType {
    tableName: string;
    columns: Column[];
    constraints: Constraint[];
}
interface Constraint {
    type: string;
    definition: string;
    column?: string;
    references?: { table: string; column: string };
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
}
interface Positions {
    [tableName: string]: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
interface column{
    name:string,
    dataType:string,
    constraints: string[],
    defaultValue: any,
    comment: any,
    foreignKey: any
}
interface database{
    tables: {
        tableName: any;
        columns: any[];
        constraints: any[];
    }[];
    relationships: {
        fromTable: any;
        fromColumn: any;
        toTable: any;
        toColumn: any;
        type: string;
    }[];
}
interface positions{
    x: number,
    y: number,
    width: number,
    height: number
}
const SQLTableVisualizer = () => {
  const [sqlInput, setSqlInput] = useState('');
  const [parsedSchema, setParsedSchema] = useState<DatabaseSchema | null>(null);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Enhanced SQL parser for multiple tables and relationships (PostgreSQL)
  const parseMultipleTables = (sql: string): DatabaseSchema => {
    try {
      const tables: TableType[] = [];
      const relationships: Relationship[] = [];
      // Use regex to match all CREATE TABLE ... (...); blocks
      const createTableRegex = /CREATE\s+TABLE[\s\S]*?\([^;]*\)[\s\S]*?;/gi;
      const createStatements = sql.match(createTableRegex) || [];
      createStatements.forEach(statement => {
        const table = parseCreateTable(statement);
        if (table) {
          tables.push(table);
        }
      });
      // Extract relationships from foreign key constraints
      tables.forEach(table => {
        table.columns.forEach((column: Column) => {
          if (column.foreignKey) {
            relationships.push({
              fromTable: table.tableName,
              fromColumn: column.name,
              toTable: column.foreignKey.table,
              toColumn: column.foreignKey.column,
              type: 'foreign_key'
            });
          }
        });
        // Check table-level foreign key constraints
        table.constraints.forEach((constraint: Constraint) => {
          if (constraint.type === 'FOREIGN KEY' && constraint.references) {
            relationships.push({
              fromTable: table.tableName,
              fromColumn: constraint.column || '',
              toTable: constraint.references.table,
              toColumn: constraint.references.column,
              type: 'foreign_key'
            });
          }
        });
      });
      return { tables, relationships };
    } catch (err: any) {
      throw new Error(`Parse error: ${err.message}`);
    }
  };

  // PostgreSQL-specific CREATE TABLE parser
  const parseCreateTable = (sql: string): TableType | null => {
    try {
      const cleanSql = sql.trim().replace(/\s+/g, ' ');
      // Extract table name (PostgreSQL: double quotes or unquoted)
      const tableMatch = cleanSql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?"?(\w+)"?\s*\(/i);
      if (!tableMatch) {
        throw new Error('Invalid CREATE TABLE statement');
      }
      const tableName = tableMatch[1];
      // Extract the column definitions between parentheses
      const columnsMatch = cleanSql.match(/\((.*)\)(?:\s*;?)$/i);
      if (!columnsMatch) {
        throw new Error('Could not find column definitions');
      }
      const columnsText = columnsMatch[1];
      const columns: Column[] = [];
      const constraints: Constraint[] = [];
      let depth = 0;
      let current = '';
      let inQuotes = false;
      let quoteChar = '';
      for (let i = 0; i < columnsText.length; i++) {
        const char = columnsText[i];
        const prevChar = i > 0 ? columnsText[i - 1] : '';
        if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inQuotes = false;
            quoteChar = '';
          }
        }
        if (!inQuotes) {
          if (char === '(') depth++;
          else if (char === ')') depth--;
        }
        if (char === ',' && depth === 0 && !inQuotes) {
          const item = current.trim();
          if (item) {
            parseColumnOrConstraint(item, columns, constraints);
          }
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) {
        parseColumnOrConstraint(current.trim(), columns, constraints);
      }
      return { tableName, columns, constraints };
    } catch (err: any) {
      throw new Error(`Parse error for table: ${err.message}`);
    }
  };

  // PostgreSQL constraint parser
  const parseConstraint = (constraintDef: string): Constraint => {
    const upper = constraintDef.toUpperCase();
    const constraint: Constraint = {
      type: getConstraintType(constraintDef),
      definition: constraintDef
    };
    // Parse FOREIGN KEY constraints (PostgreSQL: double quotes or unquoted)
    const fkMatch = constraintDef.match(/FOREIGN\s+KEY\s*\(\s*"?(\w+)"?\s*\)\s+REFERENCES\s+"?(\w+)"?\s*\(\s*"?(\w+)"?\s*\)/i);
    if (fkMatch) {
      constraint.column = fkMatch[1];
      constraint.references = {
        table: fkMatch[2],
        column: fkMatch[3]
      };
    }
    return constraint;
  };

  // PostgreSQL column parser
  const parseColumn = (columnDef: string): Column | null => {
    // Remove double quotes from identifiers
    const parts = columnDef.trim().replace(/"/g, '').split(/\s+/);
    if (parts.length < 2) return null;
    const name = parts[0];
    let dataType = parts[1];
    // Recognize SERIAL/BIGSERIAL as auto-increment
    const isSerial = /^(SERIAL|BIGSERIAL)$/i.test(dataType);
    const column: Column = {
      name,
      dataType,
      constraints: [],
      defaultValue: null,
      comment: null,
      foreignKey: null
    };
    if (isSerial) {
      column.constraints.push('AUTO_INCREMENT');
    }
    const remaining = parts.slice(2).join(' ');
    const remainingUpper = remaining.toUpperCase();
    // Check for constraints
    if (remainingUpper.includes('PRIMARY KEY')) column.constraints.push('PRIMARY KEY');
    if (remainingUpper.includes('NOT NULL')) column.constraints.push('NOT NULL');
    if (remainingUpper.includes('UNIQUE')) column.constraints.push('UNIQUE');
    // Parse inline FOREIGN KEY references (PostgreSQL: double quotes or unquoted)
    const fkMatch = remaining.match(/REFERENCES\s+"?(\w+)"?\s*\(\s*"?(\w+)"?\s*\)/i);
    if (fkMatch) {
      column.foreignKey = {
        table: fkMatch[1],
        column: fkMatch[2]
      };
      column.constraints.push('FOREIGN KEY');
    }
    // Extract default value (PostgreSQL: DEFAULT ...)
    const defaultMatch = columnDef.match(/DEFAULT\s+([^,\s]+(?:\([^)]*\))?)/i);
    if (defaultMatch) {
      column.defaultValue = defaultMatch[1];
    }
    // Extract comment (PostgreSQL: COMMENT ON COLUMN ... is separate, so skip)
    return column;
  };

  // Add back getConstraintType and parseColumnOrConstraint for parser logic
  const getConstraintType = (constraint: string) => {
    const upper = constraint.toUpperCase();
    if (upper.includes('PRIMARY KEY')) return 'PRIMARY KEY';
    if (upper.includes('FOREIGN KEY')) return 'FOREIGN KEY';
    if (upper.includes('UNIQUE')) return 'UNIQUE';
    if (upper.includes('CHECK')) return 'CHECK';
    if (upper.includes('INDEX') || upper.match(/^KEY\s/)) return 'INDEX';
    return 'CONSTRAINT';
  };

  const parseColumnOrConstraint = (item: string, columns: Column[], constraints: Constraint[]) => {
    const constraintTypes = ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK', 'INDEX', 'KEY'];
    const isConstraint = constraintTypes.some(type => 
      item.toUpperCase().includes(type) && !item.toUpperCase().match(/^\w+\s+\w+/)
    );
    if (isConstraint) {
      const constraint = parseConstraint(item);
      constraints.push(constraint);
    } else {
      const column = parseColumn(item);
      if (column) {
        columns.push(column);
      }
    }
  };

  const handleParse = () => {
    setError('');
    setParsedSchema(null);
    setSelectedTable(null);
    if (!sqlInput.trim()) {
      setError('Please enter CREATE TABLE statement(s)');
      return;
    }
    try {
      const result = parseMultipleTables(sqlInput);
      if (result.tables.length === 0) {
        setError('No valid CREATE TABLE statements found');
        return;
      }
      setParsedSchema(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const exportToJSON = () => {
    if (!parsedSchema) return;
    const dataStr = JSON.stringify(parsedSchema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'database_schema.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // PostgreSQL sample SQL
  const sampleSQL = `CREATE TABLE customers (
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
  );`;

  const getConstraintColor = (constraint: string | null) => {
    const colors: { [key: string]: string } = {
      'PRIMARY KEY': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'NOT NULL': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'UNIQUE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'AUTO_INCREMENT': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'FOREIGN KEY': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return constraint && colors[constraint] ? colors[constraint] : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  // Calculate table positions for diagram layout
  const getTablePositions = (tables: TableType[]): Positions => {
    const positions: Positions = {};
    const cols = Math.ceil(Math.sqrt(tables.length));
    const tableWidth = 280;
    const tableHeight = 200;
    // Increase horizontal spacing for clearer arrows
    const spacingX = 160; // was 60
    const spacingY = 60;
    tables.forEach((table, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      positions[table.tableName] = {
        x: col * (tableWidth + spacingX) + 50,
        y: row * (tableHeight + spacingY) + 50,
        width: tableWidth,
        height: Math.max(tableHeight, 80 + table.columns.length * 25)
      };
    });
    return positions;
  };

  // Draw relationship lines
  const drawRelationships = (relationships: Relationship[], positions: Positions) => {
    return relationships.map((rel, index) => {
      const fromPos = positions[rel.fromTable];
      const toPos = positions[rel.toTable];
      if (!fromPos || !toPos) return null;
      const fromX = fromPos.x + fromPos.width;
      const fromY = fromPos.y + fromPos.height / 2;
      const toX = toPos.x;
      const toY = toPos.y + toPos.height / 2;
      const midX = (fromX + toX) / 2;
      return (
        <g key={index}>
          <path
            d={`M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`}
            stroke={darkMode ? '#8B5CF6' : '#7C3AED'}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          <text
            x={midX}
            y={(fromY + toY) / 2 - 10}
            textAnchor="middle"
            style={{ fontSize: '10px' }} // scale down relationship label text
            className="text-xs fill-current text-purple-600 dark:text-purple-400"
          >
            {rel.fromColumn} → {rel.toColumn}
          </text>
        </g>
      );
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">PostgreSQL Schema Visualizer</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {parsedSchema && (
              <button
                onClick={exportToJSON}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            )}
          </div>
        </div>
        <div className="grid xl:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                SQL Input
              </h2>
              <button
                onClick={() => setSqlInput(sampleSQL)}
                className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              placeholder="Paste your CREATE TABLE statements here..."
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleParse}
              disabled={!sqlInput.trim()}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Parse SQL
            </button>
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {/* Relationships Summary */}
            {parsedSchema && parsedSchema.relationships.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Relationships ({parsedSchema.relationships.length})
                </h3>
                <div className="space-y-2 text-sm">
                  {parsedSchema.relationships.map((rel, index) => (
                    <div key={index} className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <span className="font-medium">{rel.fromTable}.{rel.fromColumn}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-medium">{rel.toTable}.{rel.toColumn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Schema Diagram */}
          <div className="xl:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Schema
              {parsedSchema && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({parsedSchema.tables.length} tables)
                </span>
              )}
            </h2>
            {parsedSchema ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                {/* Schema Diagram */}
                <div className="p-4 overflow-auto" style={{ height: '600px' }}>
                  {(() => {
                    const positions = getTablePositions(parsedSchema.tables);
                    const maxX = Math.max(...Object.values(positions).map(p => p.x + p.width)) + 50;
                    const maxY = Math.max(...Object.values(positions).map(p => p.y + p.height)) + 50;
                    return (
                      <svg
                        ref={svgRef}
                        width={Math.max(maxX, 800)}
                        height={Math.max(maxY, 500)}
                        className="border border-gray-200 dark:border-gray-600 rounded"
                      >
                        <defs>
                          <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="10"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 3.5, 0 7"
                              fill={darkMode ? '#8B5CF6' : '#7C3AED'}
                            />
                          </marker>
                        </defs>
                        {/* Draw relationships first */}
                        {drawRelationships(parsedSchema.relationships, positions)}
                        {/* Draw tables */}
                        {parsedSchema.tables.map((table, tableIndex) => {
                          const pos = positions[table.tableName];
                          return (
                            <g key={tableIndex}>
                              {/* Table container */}
                              <rect
                                x={pos.x}
                                y={pos.y}
                                width={pos.width}
                                height={pos.height}
                                fill={darkMode ? '#374151' : '#ffffff'}
                                stroke={selectedTable === table.tableName ? '#3B82F6' : (darkMode ? '#4B5563' : '#D1D5DB')}
                                strokeWidth={selectedTable === table.tableName ? '3' : '1'}
                                rx="8"
                                className="cursor-pointer"
                                onClick={() => setSelectedTable(selectedTable === table.tableName ? null : table.tableName)}
                              />
                              {/* Table header */}
                              <rect
                                x={pos.x}
                                y={pos.y}
                                width={pos.width}
                                height="40"
                                fill="#3B82F6"
                                rx="8"
                              />
                              <rect
                                x={pos.x}
                                y={pos.y + 32}
                                width={pos.width}
                                height="8"
                                fill="#3B82F6"
                              />
                              {/* Table name */}
                              <text
                                x={pos.x + pos.width / 2}
                                y={pos.y + 25}
                                textAnchor="middle"
                                className="fill-white font-semibold text-sm"
                              >
                                {table.tableName}
                              </text>
                              {/* Columns */}
                              {table.columns.slice(0, 8).map((column, colIndex) => (
                                <g key={colIndex}>
                                  <text
                                    x={pos.x + 12}
                                    y={pos.y + 60 + colIndex * 22}
                                    className={`text-xs ${darkMode ? 'fill-gray-200' : 'fill-gray-800'}`}
                                  >
                                    <tspan className="font-medium">{column.name}</tspan>
                                    <tspan className={`${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}> : {column.dataType}</tspan>
                                  </text>
                                  {/* Primary key icon */}
                                  {column.constraints.includes('PRIMARY KEY') && (
                                    <circle
                                      cx={pos.x + pos.width - 20}
                                      cy={pos.y + 56 + colIndex * 22}
                                      r="6"
                                      fill="#F59E0B"
                                    />
                                  )}
                                  {/* Foreign key icon */}
                                  {(column.constraints.includes('FOREIGN KEY') || column.foreignKey) && (
                                    <circle
                                      cx={pos.x + pos.width - 35}
                                      cy={pos.y + 56 + colIndex * 22}
                                      r="6"
                                      fill="#8B5CF6"
                                    />
                                  )}
                                </g>
                              ))}
                              {/* Show more columns indicator */}
                              {table.columns.length > 8 && (
                                <text
                                  x={pos.x + 12}
                                  y={pos.y + 60 + 8 * 22}
                                  className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}
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
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    {(() => {
                      const table = parsedSchema.tables.find((t: { tableName: string; }) => t.tableName === selectedTable);
                      if (!table) return null;
                      return (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Table className="w-5 h-5" />
                            {table.tableName} Details
                          </h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Columns */}
                            <div>
                              <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                Columns ({table.columns.length})
                              </h4>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {table.columns.map((column, index) => (
                                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{column.name}</span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                          {column.dataType}
                                        </span>
                                      </div>
                                      {column.constraints.includes('PRIMARY KEY') && (
                                        <Key className="w-4 h-4 text-yellow-600" />
                                      )}
                                    </div>
                                    {column.constraints.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mb-1">
                                        {column.constraints.map((constraint, i) => (
                                          <span
                                            key={i}
                                            className={`text-xs px-2 py-1 rounded-full ${getConstraintColor(typeof constraint === 'string' ? constraint : null)}`}
                                          >
                                            {constraint}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    {column.foreignKey && (
                                      <div className="text-xs text-purple-600 dark:text-purple-400">
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
                                const relatedTables = parsedSchema.relationships.filter(
                                    (rel: Relationship) => rel.fromTable === selectedTable || rel.toTable === selectedTable
                                );
                                return (
                                  <div>
                                    <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                      Related Tables ({relatedTables.length})
                                    </h4>
                                    {relatedTables.length > 0 ? (
                                      <div className="space-y-2">
                                        {relatedTables.map((rel, index) => (
                                          <div key={index} className="flex items-center gap-2 text-sm p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                            {rel.fromTable === selectedTable ? (
                                              <>
                                                <span className="font-medium">{rel.fromColumn}</span>
                                                <ArrowRight className="w-3 h-3" />
                                                <span 
                                                  className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                                                  onClick={() => setSelectedTable(rel.toTable)}
                                                >
                                                  {rel.toTable}.{rel.toColumn}
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <span 
                                                  className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                                                  onClick={() => setSelectedTable(rel.fromTable)}
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
                                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        No relationships found for this table.
                                      </p>
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
              <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter CREATE TABLE statements and click "Parse SQL" to visualize the database schema
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLTableVisualizer; 