'use client'

import React from 'react';
import { useState, useEffect } from 'react';

export interface TableRow {
  [columnName: string]: any;
}

export interface DatabaseTable {
  name: string;
  columns: string[];
  data: TableRow[];
}

export interface Database {
  tables: Record<string, DatabaseTable>;
}

// Mock database with raw data (no schema info)
const mockDatabase: Database = {
  tables: {
    users: {
      name: 'users',
      columns: ['id', 'username', 'email', 'created_at', 'is_active', 'last_login'],
      data: [
        { id: 1, username: 'john_doe', email: 'john@example.com', created_at: '2024-01-15 10:30:00', is_active: true, last_login: '2024-07-15 14:22:33' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', created_at: '2024-01-16 14:20:00', is_active: true, last_login: '2024-07-14 09:15:21' },
        { id: 3, username: 'bob_wilson', email: 'bob@example.com', created_at: '2024-01-17 09:15:00', is_active: false, last_login: null },
        { id: 4, username: 'alice_brown', email: 'alice@example.com', created_at: '2024-01-18 16:45:00', is_active: true, last_login: '2024-07-16 11:08:45' },
        { id: 5, username: 'charlie_davis', email: 'charlie@example.com', created_at: '2024-01-19 11:30:00', is_active: true, last_login: '2024-07-13 16:42:12' },
        { id: 6, username: 'diana_white', email: 'diana@example.com', created_at: '2024-02-01 08:00:00', is_active: false, last_login: '2024-06-20 13:55:30' },
        { id: 7, username: 'frank_miller', email: 'frank@example.com', created_at: '2024-02-05 12:15:00', is_active: true, last_login: '2024-07-16 18:30:15' }
      ]
    },
    orders: {
      name: 'orders',
      columns: ['order_id', 'user_id', 'product_name', 'quantity', 'price', 'order_date', 'status', 'shipping_cost', 'discount'],
      data: [
        { order_id: 1001, user_id: 1, product_name: 'MacBook Pro', quantity: 1, price: 1999.99, order_date: '2024-02-10', status: 'delivered', shipping_cost: 0.00, discount: 100.00 },
        { order_id: 1002, user_id: 1, product_name: 'USB-C Hub', quantity: 2, price: 49.99, order_date: '2024-02-10', status: 'delivered', shipping_cost: 9.99, discount: 0.00 },
        { order_id: 1003, user_id: 2, product_name: 'Wireless Mouse', quantity: 1, price: 29.99, order_date: '2024-02-12', status: 'shipped', shipping_cost: 5.99, discount: 5.00 },
        { order_id: 1004, user_id: 4, product_name: 'Monitor Stand', quantity: 1, price: 89.99, order_date: '2024-02-15', status: 'processing', shipping_cost: 12.99, discount: 0.00 },
        { order_id: 1005, user_id: 1, product_name: 'Keyboard', quantity: 1, price: 159.99, order_date: '2024-02-18', status: 'cancelled', shipping_cost: 0.00, discount: 0.00 },
        { order_id: 1006, user_id: 3, product_name: 'Webcam', quantity: 1, price: 79.99, order_date: '2024-02-20', status: 'pending', shipping_cost: 7.99, discount: 10.00 },
        { order_id: 1007, user_id: 5, product_name: 'Headphones', quantity: 1, price: 199.99, order_date: '2024-02-22', status: 'delivered', shipping_cost: 0.00, discount: 20.00 },
        { order_id: 1008, user_id: 7, product_name: 'Phone Case', quantity: 3, price: 24.99, order_date: '2024-02-25', status: 'shipped', shipping_cost: 4.99, discount: 0.00 }
      ]
    },
    products: {
      name: 'products',
      columns: ['product_id', 'name', 'category', 'price', 'stock', 'supplier_id', 'weight_kg', 'dimensions', 'rating'],
      data: [
        { product_id: 101, name: 'MacBook Pro', category: 'Laptops', price: 1999.99, stock: 25, supplier_id: 501, weight_kg: 1.4, dimensions: '30.4×21.2×1.6 cm', rating: 4.8 },
        { product_id: 102, name: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 150, supplier_id: 502, weight_kg: 0.2, dimensions: '10×5×2 cm', rating: 4.3 },
        { product_id: 103, name: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 200, supplier_id: 503, weight_kg: 0.1, dimensions: '12×6×4 cm', rating: 4.5 },
        { product_id: 104, name: 'Monitor Stand', category: 'Accessories', price: 89.99, stock: 75, supplier_id: 502, weight_kg: 2.1, dimensions: '35×25×15 cm', rating: 4.6 },
        { product_id: 105, name: 'Keyboard', category: 'Accessories', price: 159.99, stock: 60, supplier_id: 504, weight_kg: 0.8, dimensions: '44×13×3 cm', rating: 4.7 },
        { product_id: 106, name: 'Webcam', category: 'Electronics', price: 79.99, stock: 40, supplier_id: 505, weight_kg: 0.3, dimensions: '8×8×6 cm', rating: 4.2 },
        { product_id: 107, name: 'Headphones', category: 'Audio', price: 199.99, stock: 80, supplier_id: 506, weight_kg: 0.4, dimensions: '20×18×8 cm', rating: 4.9 },
        { product_id: 108, name: 'Phone Case', category: 'Accessories', price: 24.99, stock: 300, supplier_id: 507, weight_kg: 0.05, dimensions: '16×8×1 cm', rating: 4.1 }
      ]
    },
    suppliers: {
      name: 'suppliers',
      columns: ['supplier_id', 'company_name', 'contact_person', 'email', 'phone', 'country', 'established_year'],
      data: [
        { supplier_id: 501, company_name: 'TechCorp Ltd', contact_person: 'Sarah Johnson', email: 'sarah@techcorp.com', phone: '+1-555-0101', country: 'USA', established_year: 2010 },
        { supplier_id: 502, company_name: 'AccessoryWorld', contact_person: 'Mike Chen', email: 'mike@accessoryworld.com', phone: '+1-555-0102', country: 'Canada', established_year: 2015 },
        { supplier_id: 503, company_name: 'PeripheralPro', contact_person: 'Anna Rodriguez', email: 'anna@peripheralpro.com', phone: '+1-555-0103', country: 'Mexico', established_year: 2018 },
        { supplier_id: 504, company_name: 'KeyboardKings', contact_person: 'David Smith', email: 'david@keyboardkings.com', phone: '+44-20-7946-0958', country: 'UK', established_year: 2012 },
        { supplier_id: 505, company_name: 'CameraSupply Co', contact_person: 'Lisa Wang', email: 'lisa@camerasupply.com', phone: '+86-10-8888-9999', country: 'China', established_year: 2008 },
        { supplier_id: 506, company_name: 'AudioTech Solutions', contact_person: 'Thomas Mueller', email: 'thomas@audiotech.de', phone: '+49-30-12345678', country: 'Germany', established_year: 2005 },
        { supplier_id: 507, company_name: 'MobileCover Express', contact_person: 'Priya Patel', email: 'priya@mobilecover.in', phone: '+91-11-2345-6789', country: 'India', established_year: 2020 }
      ]
    },
    order_items: {
      name: 'order_items',
      columns: ['item_id', 'order_id', 'product_id', 'quantity', 'unit_price', 'total_price'],
      data: [
        { item_id: 2001, order_id: 1001, product_id: 101, quantity: 1, unit_price: 1999.99, total_price: 1999.99 },
        { item_id: 2002, order_id: 1002, product_id: 102, quantity: 2, unit_price: 49.99, total_price: 99.98 },
        { item_id: 2003, order_id: 1003, product_id: 103, quantity: 1, unit_price: 29.99, total_price: 29.99 },
        { item_id: 2004, order_id: 1004, product_id: 104, quantity: 1, unit_price: 89.99, total_price: 89.99 },
        { item_id: 2005, order_id: 1005, product_id: 105, quantity: 1, unit_price: 159.99, total_price: 159.99 },
        { item_id: 2006, order_id: 1006, product_id: 106, quantity: 1, unit_price: 79.99, total_price: 79.99 },
        { item_id: 2007, order_id: 1007, product_id: 107, quantity: 1, unit_price: 199.99, total_price: 199.99 },
        { item_id: 2008, order_id: 1008, product_id: 108, quantity: 3, unit_price: 24.99, total_price: 74.97 }
      ]
    }
  }
};

// Custom CSS for themed colors
const customCSS = `
:root {
  /* UI Colors (Muted/Subdued) */
  --ui-navy-950: hsl(202, 97%, 15%); /* #012A4A */
  --ui-navy-900: hsl(228, 76%, 29%); /* #012494 */
  --ui-navy-800: hsl(228, 76%, 35%);
  --ui-navy-700: hsl(200, 98%, 24%); /* #01497C */
  --ui-navy-600: hsl(200, 98%, 30%);
  --ui-navy-500: hsl(201, 61%, 37%); /* #2A6F97 */
  --ui-navy-400: hsl(201, 40%, 57%); /* #61A5C2 */
  --ui-navy-300: hsl(186, 75%, 59%); /* #49D6E5 */
  --ui-navy-200: hsl(190, 50%, 78%); /* #A9D6E5 */
  --ui-navy-100: hsl(186, 75%, 85%);
  
  /* Earth Tones */
  --ui-terracotta-700: hsl(17, 54%, 42%);
  --ui-terracotta-600: hsl(17, 54%, 45%);
  --ui-terracotta-500: hsl(17, 54%, 48%); /* #BE5A38 */
  --ui-terracotta-400: hsl(17, 54%, 55%);
  --ui-terracotta-300: hsl(17, 54%, 65%);
  
  /* Neutral Tones */
  --ui-beige-300: hsl(39, 42%, 85%);
  --ui-beige-200: hsl(39, 42%, 92%); /* #EAE0CC */
  --ui-beige-100: hsl(40, 60%, 95%); /* #F8F2DC */
}

.ui-navy-950 { background-color: var(--ui-navy-950); }
.ui-navy-900 { background-color: var(--ui-navy-900); }
.ui-navy-800 { background-color: var(--ui-navy-800); }
.ui-navy-700 { background-color: var(--ui-navy-700); }
.ui-navy-600 { background-color: var(--ui-navy-600); }
.ui-navy-500 { background-color: var(--ui-navy-500); }
.ui-navy-400 { background-color: var(--ui-navy-400); }
.ui-navy-300 { background-color: var(--ui-navy-300); }
.ui-navy-200 { background-color: var(--ui-navy-200); }
.ui-navy-100 { background-color: var(--ui-navy-100); }

.ui-terracotta-700 { background-color: var(--ui-terracotta-700); }
.ui-terracotta-600 { background-color: var(--ui-terracotta-600); }
.ui-terracotta-500 { background-color: var(--ui-terracotta-500); }
.ui-terracotta-400 { background-color: var(--ui-terracotta-400); }
.ui-terracotta-300 { background-color: var(--ui-terracotta-300); }

.ui-beige-300 { background-color: var(--ui-beige-300); }
.ui-beige-200 { background-color: var(--ui-beige-200); }
.ui-beige-100 { background-color: var(--ui-beige-100); }

.text-ui-navy-950 { color: var(--ui-navy-950); }
.text-ui-navy-900 { color: var(--ui-navy-900); }
.text-ui-navy-800 { color: var(--ui-navy-800); }
.text-ui-navy-700 { color: var(--ui-navy-700); }
.text-ui-navy-600 { color: var(--ui-navy-600); }
.text-ui-navy-500 { color: var(--ui-navy-500); }
.text-ui-navy-400 { color: var(--ui-navy-400); }
.text-ui-navy-300 { color: var(--ui-navy-300); }
.text-ui-navy-200 { color: var(--ui-navy-200); }
.text-ui-navy-100 { color: var(--ui-navy-100); }

.border-ui-navy-200 { border-color: var(--ui-navy-200); }
.border-ui-navy-300 { border-color: var(--ui-navy-300); }
.border-ui-navy-400 { border-color: var(--ui-navy-400); }

.hover\\:ui-navy-500:hover { background-color: var(--ui-navy-500); }
.hover\\:ui-navy-600:hover { background-color: var(--ui-navy-600); }
.hover\\:ui-terracotta-400:hover { background-color: var(--ui-terracotta-400); }
.hover\\:ui-beige-300:hover { background-color: var(--ui-beige-300); }

.focus\\:border-ui-navy-300:focus { border-color: var(--ui-navy-300); }
.focus\\:ring-ui-navy-300:focus { --tw-ring-color: var(--ui-navy-300); }

.selected { background-color: var(--ui-navy-300); }
`;

// Inject the CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = customCSS;
  document.head.appendChild(style);
}

// components/Sidebar.tsx
interface SidebarProps {
  tables: Record<string, DatabaseTable>;
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tables, selectedTable, onTableSelect }) => {
  return (
    <aside className="w-72 ui-beige-300 border-r border-ui-navy-200 p-6" style={{ backgroundColor: 'var(--ui-beige-300)', borderColor: 'var(--ui-navy-200)' }}>
      <h2 className="text-xl font-semibold text-ui-navy-900 mb-6" style={{ color: 'var(--ui-navy-900)' }}>Database Tables</h2>
      <nav className="space-y-2">
        {Object.entries(tables).map(([tableName, table]) => (
          <button
            key={tableName}
            onClick={() => onTableSelect(tableName)}
            className={`w-full text-left p-4 rounded-lg transition-colors duration-150 border-2 ${
              selectedTable === tableName
                ? 'border-ui-navy-400 text-ui-navy-950'
                : 'border-transparent text-ui-navy-700 hover:ui-beige-200'
            }`}
            style={{
              backgroundColor: selectedTable === tableName ? 'var(--ui-navy-300)' : 'white',
              borderColor: selectedTable === tableName ? 'var(--ui-navy-400)' : 'transparent',
              color: selectedTable === tableName ? 'var(--ui-navy-950)' : 'var(--ui-navy-700)'
            }}
            onMouseEnter={(e) => {
              if (selectedTable !== tableName) {
                e.currentTarget.style.backgroundColor = 'var(--ui-beige-200)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTable !== tableName) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            <div className="font-medium text-base">{tableName}</div>
            <div className="text-sm mt-1" style={{ color: selectedTable === tableName ? 'var(--ui-navy-800)' : 'var(--ui-navy-500)' }}>
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
  // Handle null/empty state
  if (!table) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--ui-beige-100)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--ui-navy-700)' }}>
            Select a Table
          </h3>
          <p style={{ color: 'var(--ui-navy-500)' }}>
            Choose a table from the sidebar to view its raw data
          </p>
        </div>
      </main>
    );
  }

  // Helper function to format cell values for display
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'NULL';
    }
    if (typeof value === 'boolean') {
      return value.toString().toUpperCase();
    }
    return String(value);
  };

  return (
    <main className="flex-1" style={{ backgroundColor: 'var(--ui-beige-100)' }}>
      {/* Table Header */}
      <div className="border-b p-6" style={{ borderColor: 'var(--ui-navy-200)', backgroundColor: 'white' }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ui-navy-900)' }}>{table.name}</h1>
        <p style={{ color: 'var(--ui-navy-600)' }}>
          Displaying all {table.data.length} rows • {table.columns.length} columns
        </p>
      </div>

      {/* Table Container */}
      <div className="p-6">
        <div className="border rounded-lg overflow-hidden shadow-sm" style={{ borderColor: 'var(--ui-navy-200)', backgroundColor: 'white' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr style={{ backgroundColor: 'var(--ui-beige-200)' }}>
                  {table.columns.map((columnName) => (
                    <th
                      key={columnName}
                      className="px-4 py-3 text-left text-sm font-semibold border-b"
                      style={{ 
                        color: 'var(--ui-navy-700)', 
                        borderColor: 'var(--ui-navy-200)' 
                      }}
                    >
                      {columnName}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {table.data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="transition-colors duration-150"
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? 'white' : 'var(--ui-beige-200)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--ui-navy-100)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? 'white' : 'var(--ui-beige-200)';
                    }}
                  >
                    {table.columns.map((columnName) => {
                      const cellValue = row[columnName];
                      const isNull = cellValue === null || cellValue === undefined;
                      
                      return (
                        <td
                          key={columnName}
                          className="px-4 py-3 text-sm border-b"
                          style={{
                            borderColor: 'var(--ui-navy-200)',
                            color: isNull ? 'var(--ui-navy-400)' : 'var(--ui-navy-800)',
                            fontStyle: isNull ? 'italic' : 'normal',
                            fontWeight: isNull ? '500' : 'normal'
                          }}
                        >
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

        {/* Footer Info */}
        <div className="mt-4 text-center">
          <p className="text-sm" style={{ color: 'var(--ui-navy-500)' }}>
            Complete dataset: {table.data.length} rows from "{table.name}" table
          </p>
        </div>
      </div>
    </main>
  );
};

// Main App Component
export default function SQLDataViewer() {
  // State Management
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [database] = useState<Database>(mockDatabase);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Event Handlers
  const handleTableSelect = (tableName: string): void => {
    setSelectedTable(tableName);
  };

  // Derived State - Get current table data
  const currentTable = selectedTable ? database.tables[selectedTable] : null;

  // Prevent rendering until component is mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ui-beige-100)' }}>
      {/* Header */}
      <header className="border-b shadow-sm" style={{ backgroundColor: 'var(--ui-navy-900)', borderColor: 'var(--ui-navy-200)' }}>
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              SQL Raw Data Viewer
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ui-navy-200)' }}>
              View complete table data as stored in your database
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-150 font-medium"
            style={{ backgroundColor: 'var(--ui-navy-700)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ui-navy-600)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ui-navy-700)';
            }}
            onClick={() => {
              // TODO: Implement save to blocks functionality
              console.log('Save to Blocks clicked');
            }}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4h6v6H4V4zm0 8h6v8H4v-8zm8-8h8v4h-8V4zm0 6h4v10h-4V10z"
              />
            </svg>
            Back to Blocks
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Component */}
        <Sidebar
          tables={database.tables}
          selectedTable={selectedTable}
          onTableSelect={handleTableSelect}
        />

        {/* Table Display Component */}
        <TableDisplay table={currentTable} />
      </div>
    </div>
  );
}
