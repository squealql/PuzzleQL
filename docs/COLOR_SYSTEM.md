# SQL Query Builder - Color System Documentation

## Overview

This document outlines the color system design for the SQL Query Builder application. The color scheme is based on the provided reference image and includes two distinct categories:

1. **UI Colors**: Muted, subdued colors for the application interface
2. **Block Colors**: Vibrant, eye-catching colors for the query-building blocks

## Color Naming Convention

We've established a consistent naming convention to clearly differentiate between UI elements and query-building blocks:

### UI Colors (Muted/Subdued)
- Prefix: `--ui-`
- Format: `--ui-[color-family]-[shade]`
- Example: `--ui-navy-900` for the darkest navy blue, `--ui-beige-200` for light beige

### Block Colors (Vibrant)
- Prefix: `--block-`
- Format: `--block-[color-family]-[shade]`
- Example: `--block-pink-500` for the bright pink, `--block-purple-700` for dark purple

### Shade Scale
- Uses a 100-900 scale (similar to Tailwind CSS):
  - 100-300: Light shades
  - 400-600: Medium shades
  - 700-900: Dark shades

## Color Palette and Usage Guide

### UI Colors (Muted/Subdued)

#### Navy/Blue Family
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--ui-navy-950` | 202 97% 15% | #012A4A | Darkest navy blue | Main application background, dark mode containers, primary headers |
| `--ui-navy-900` | 228 76% 29% | #012494 | Very dark navy blue | Primary navigation backgrounds, secondary headers, footer backgrounds |
| `--ui-navy-800` | 228 76% 35% | | Dark navy blue | Active navigation items, dark accent elements, focused UI elements |
| `--ui-navy-700` | 200 98% 24% | #01497C | Dark blue | Primary buttons, important actions, main interactive elements |
| `--ui-navy-600` | 200 98% 30% | | Medium-dark blue | Secondary buttons, dropdown backgrounds, hover states for dark UI elements |
| `--ui-navy-500` | 201 61% 37% | #2A6F97 | Medium blue | Accent colors, loading indicators, progress bars |
| `--ui-navy-400` | 201 40% 57% | #61A5C2 | Medium-light blue | Informational elements, success states, tooltips, badges |
| `--ui-navy-300` | 186 75% 59% | #49D6E5 | Bright cyan-blue | Selected items, highlights, focused form elements |
| `--ui-navy-200` | 190 50% 78% | #A9D6E5 | Light blue | Subtle backgrounds, disabled buttons, input borders, dividers |
| `--ui-navy-100` | 186 75% 85% | | Very light cyan-blue | Light backgrounds, subtle highlights, alternate row colors in tables |

#### Purple Family
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--ui-purple-600` | 251 48% 52% | #6145C2 | Medium-dark purple | Secondary interactive elements, alerts, important toggles |
| `--ui-purple-500` | 251 48% 60% | | Medium purple | Hover states, minor accents, secondary selection indicators |
| `--ui-purple-400` | 251 48% 70% | | Light purple | Light accents, subtle notifications, tertiary indicators |

#### Earth Tones
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--ui-terracotta-700` | 17 54% 42% | | Dark terracotta | Delete/cancel buttons, warning indicators, critical actions |
| `--ui-terracotta-600` | 17 54% 45% | | Medium-dark terracotta | Error states, validation errors, destructive actions |
| `--ui-terracotta-500` | 17 54% 48% | #BE5A38 | Medium terracotta | Secondary buttons, warning notifications, important alerts |
| `--ui-terracotta-400` | 17 54% 55% | | Medium-light terracotta | Warning backgrounds, form validation, highlight important text |
| `--ui-terracotta-300` | 17 54% 65% | | Light terracotta | Subtle warnings, notice backgrounds, soft error indications |

#### Neutral Tones
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--ui-beige-300` | 39 42% 85% | | Medium beige | Content area backgrounds, cards, dialog backgrounds |
| `--ui-beige-200` | 39 42% 92% | #EAE0CC | Light beige | Secondary content backgrounds, alternating list items, subtle highlights |
| `--ui-beige-100` | 40 60% 95% | #F8F2DC | Very light cream | Page backgrounds, light mode containers, form backgrounds |

### Block Colors (Vibrant)

#### Pink/Magenta Family
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--block-pink-600` | 334 94% 55% | | Deep pink | SELECT statement blocks (darker variant), important query blocks |
| `--block-pink-500` | 334 94% 68% | #F72585 | Bright pink | SELECT statement blocks, column selectors, primary query components |
| `--block-pink-400` | 334 94% 75% | | Light pink | SELECT variations, hover states for pink blocks, related functions |
| `--block-magenta-700` | 318 77% 40% | | Dark magenta | FROM clause backgrounds (darker variant), table source indicators |
| `--block-magenta-600` | 318 77% 50% | #B5179E | Medium magenta | FROM clause blocks, table selectors, data source indicators |
| `--block-magenta-500` | 318 77% 60% | | Light magenta | Hover states for FROM blocks, alternate FROM clause variations |

#### Purple Family
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--block-purple-800` | 280 89% 35% | | Very dark purple | Special operators, complex functions, window functions |
| `--block-purple-700` | 280 89% 38% | #7209B7 | Dark purple | Function blocks, aggregations, mathematical operations |
| `--block-purple-600` | 280 89% 45% | | Medium-dark purple | Common SQL functions, string operations, date functions |
| `--block-purple-500` | 280 89% 55% | | Medium purple | Hover states for function blocks, alternate function variations |

#### Indigo Family
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--block-indigo-800` | 263 88% 33% | #3A0CA3 | Dark indigo | WHERE clause (darker variant), complex conditions, subqueries |
| `--block-indigo-700` | 265 88% 36% | #560BAD | Medium-dark indigo | WHERE clause blocks, condition containers, primary filter indicators |
| `--block-indigo-600` | 267 88% 40% | #480CA8 | Medium indigo | Condition operators, HAVING clauses, filter expressions |
| `--block-indigo-500` | 267 88% 50% | | Light indigo | Hover states for condition blocks, alternative filtering options |

#### Blue Family
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--block-blue-700` | 242 66% 45% | | Dark blue | JOIN operations (darker variant), table relationship indicators |
| `--block-blue-600` | 242 66% 50% | #3F37C9 | Medium-dark blue | JOIN blocks, table relationship indicators, UNION operations |
| `--block-blue-500` | 231 84% 60% | #4361EE | Medium blue | Join conditions, ON clauses, table links and references |
| `--block-blue-400` | 217 85% 65% | #4895EF | Light blue | Hover states for JOIN blocks, secondary join variations |

#### Cyan Family
| Variable | HSL Value | Hex Value | Description | Primary Usage |
|----------|-----------|-----------|-------------|---------------|
| `--block-cyan-500` | 190 92% 55% | | Medium cyan | GROUP BY and ORDER BY clauses, result organization blocks |
| `--block-cyan-400` | 190 92% 62% | #4CC9F0 | Light cyan | Sorting indicators, grouping functions, LIMIT and OFFSET clauses |
| `--block-cyan-300` | 190 92% 75% | | Very light cyan | Hover states for organization blocks, secondary sorting options |

## Semantic Color Mapping

This section defines how the colors should be mapped to specific UI components and query building blocks.

### Application Interface

| Component | Primary Color | Secondary/Hover Color | Description |
|-----------|---------------|----------------------|-------------|
| **App Background** | `--ui-beige-100` | - | The main application background |
| **Dark Mode Background** | `--ui-navy-950` | - | Background color in dark mode |
| **Navigation Bar** | `--ui-navy-900` | - | Main navigation container |
| **Navigation Items** | `--ui-navy-600` | `--ui-navy-500` | Individual navigation elements |
| **Active Nav Item** | `--ui-navy-300` | - | Currently selected navigation item |
| **Primary Buttons** | `--ui-navy-700` | `--ui-navy-600` | Main action buttons |
| **Secondary Buttons** | `--ui-terracotta-500` | `--ui-terracotta-400` | Secondary action buttons |
| **Danger Buttons** | `--ui-terracotta-700` | `--ui-terracotta-600` | Delete/cancel buttons |
| **Cards/Containers** | `--ui-beige-200` | - | Content container backgrounds |
| **Form Inputs** | `white` | `--ui-navy-100` | Input fields background |
| **Input Borders** | `--ui-navy-200` | `--ui-navy-300` | Borders for input elements |
| **Focused Inputs** | `--ui-navy-300` | - | Highlight for focused form elements |
| **Success States** | `--ui-navy-400` | - | Success indicators and notifications |
| **Error States** | `--ui-terracotta-500` | - | Error indicators and messages |
| **Dividers/Separators** | `--ui-navy-200` | - | Visual separators between content |

### Query Building Blocks

| SQL Component | Primary Color | Secondary/Hover Color | Description |
|---------------|---------------|----------------------|-------------|
| **SELECT Statement** | `--block-pink-500` | `--block-pink-400` | Blocks for selecting columns |
| **Column References** | `--block-pink-400` | `--block-pink-300` | Individual column references |
| **FROM Clause** | `--block-magenta-600` | `--block-magenta-500` | Source table indicators |
| **Table References** | `--block-indigo-600` | `--block-indigo-500` | Individual table references |
| **WHERE Clause** | `--block-indigo-700` | `--block-indigo-600` | Filtering conditions |
| **Condition Operators** | `--block-indigo-600` | `--block-indigo-500` | Comparison and logical operators |
| **JOIN Operations** | `--block-blue-600` | `--block-blue-500` | Table join blocks |
| **JOIN Conditions** | `--block-blue-500` | `--block-blue-400` | ON clause and join predicates |
| **Functions** | `--block-purple-700` | `--block-purple-600` | SQL functions and calculations |
| **Aggregations** | `--block-purple-700` | `--block-purple-600` | COUNT, SUM, AVG, etc. |
| **GROUP BY Clause** | `--block-cyan-400` | `--block-cyan-300` | Grouping specifications |
| **ORDER BY Clause** | `--block-cyan-400` | `--block-cyan-300` | Sorting specifications |
| **LIMIT/OFFSET** | `--block-cyan-500` | `--block-cyan-400` | Result limiting parameters |
| **Subqueries** | `--block-indigo-800` | `--block-indigo-700` | Nested query blocks |
| **Window Functions** | `--block-purple-800` | `--block-purple-700` | OVER, PARTITION BY, etc. |

## Implementation Details

### CSS Implementation

The color system is implemented in `frontend/app/theme/colors.css` with the following structure:

```css
/* 
 * SQL Query Builder - Color Theme
 * 
 * This file defines the color system for the application, with two distinct categories:
 * 1. UI Colors: Muted, subdued colors for the application interface (--ui-*)
 * 2. Block Colors: Vibrant, eye-catching colors for the query-building blocks (--block-*)
 */

:root {
  /* UI Colors (Muted/Subdued) */
  
  /* Navy/Blue Family */
  --ui-navy-950: 202 97% 15%; /* #012A4A */
  --ui-navy-900: 228 76% 29%; /* #012494 */
  --ui-navy-800: 228 76% 35%;
  --ui-navy-700: 200 98% 24%; /* #01497C */
  --ui-navy-600: 200 98% 30%;
  --ui-navy-500: 201 61% 37%; /* #2A6F97 */
  --ui-navy-400: 201 40% 57%; /* #61A5C2 */
  --ui-navy-300: 186 75% 59%; /* #49D6E5 */
  --ui-navy-200: 190 50% 78%; /* #A9D6E5 */
  --ui-navy-100: 186 75% 85%;

  /* Purple Family */
  --ui-purple-600: 251 48% 52%; /* #6145C2 */
  --ui-purple-500: 251 48% 60%;
  --ui-purple-400: 251 48% 70%;

  /* Earth Tones */
  --ui-terracotta-700: 17 54% 42%;
  --ui-terracotta-600: 17 54% 45%;
  --ui-terracotta-500: 17 54% 48%; /* #BE5A38 */
  --ui-terracotta-400: 17 54% 55%;
  --ui-terracotta-300: 17 54% 65%;

  /* Neutral Tones */
  --ui-beige-300: 39 42% 85%;
  --ui-beige-200: 39 42% 92%; /* #EAE0CC */
  --ui-beige-100: 40 60% 95%; /* #F8F2DC */

  /* Block Colors (Vibrant) */
  
  /* Pink/Magenta Family */
  --block-pink-600: 334 94% 55%;
  --block-pink-500: 334 94% 68%; /* #F72585 */
  --block-pink-400: 334 94% 75%;
  --block-magenta-700: 318 77% 40%;
  --block-magenta-600: 318 77% 50%; /* #B5179E */
  --block-magenta-500: 318 77% 60%;

  /* Purple Family */
  --block-purple-800: 280 89% 35%;
  --block-purple-700: 280 89% 38%; /* #7209B7 */
  --block-purple-600: 280 89% 45%;
  --block-purple-500: 280 89% 55%;

  /* Indigo Family */
  --block-indigo-800: 263 88% 33%; /* #3A0CA3 */
  --block-indigo-700: 265 88% 36%; /* #560BAD */
  --block-indigo-600: 267 88% 40%; /* #480CA8 */
  --block-indigo-500: 267 88% 50%;

  /* Blue Family */
  --block-blue-700: 242 66% 45%;
  --block-blue-600: 242 66% 50%; /* #3F37C9 */
  --block-blue-500: 231 84% 60%; /* #4361EE */
  --block-blue-400: 217 85% 65%; /* #4895EF */

  /* Cyan Family */
  --block-cyan-500: 190 92% 55%;
  --block-cyan-400: 190 92% 62%; /* #4CC9F0 */
  --block-cyan-300: 190 92% 75%;
}

/* Dark mode overrides if needed */
.dark {
  /* No dark mode specific overrides for custom colors at this time */
}
```

### Tailwind Configuration

The colors are integrated into the Tailwind configuration in `frontend/tailwind.config.ts`:

```typescript
// Excerpt of the colors section in the theme.extend part of the config
colors: {
  // Existing colors...
  
  // UI Colors
  'ui-navy': {
    950: 'hsl(var(--ui-navy-950))',
    900: 'hsl(var(--ui-navy-900))',
    800: 'hsl(var(--ui-navy-800))',
    700: 'hsl(var(--ui-navy-700))',
    600: 'hsl(var(--ui-navy-600))',
    500: 'hsl(var(--ui-navy-500))',
    400: 'hsl(var(--ui-navy-400))',
    300: 'hsl(var(--ui-navy-300))',
    200: 'hsl(var(--ui-navy-200))',
    100: 'hsl(var(--ui-navy-100))',
  },
  'ui-purple': {
    600: 'hsl(var(--ui-purple-600))',
    500: 'hsl(var(--ui-purple-500))',
    400: 'hsl(var(--ui-purple-400))',
  },
  'ui-terracotta': {
    700: 'hsl(var(--ui-terracotta-700))',
    600: 'hsl(var(--ui-terracotta-600))',
    500: 'hsl(var(--ui-terracotta-500))',
    400: 'hsl(var(--ui-terracotta-400))',
    300: 'hsl(var(--ui-terracotta-300))',
  },
  'ui-beige': {
    300: 'hsl(var(--ui-beige-300))',
    200: 'hsl(var(--ui-beige-200))',
    100: 'hsl(var(--ui-beige-100))',
  },
  
  // Block Colors
  'block-pink': {
    600: 'hsl(var(--block-pink-600))',
    500: 'hsl(var(--block-pink-500))',
    400: 'hsl(var(--block-pink-400))',
  },
  'block-magenta': {
    700: 'hsl(var(--block-magenta-700))',
    600: 'hsl(var(--block-magenta-600))',
    500: 'hsl(var(--block-magenta-500))',
  },
  'block-purple': {
    800: 'hsl(var(--block-purple-800))',
    700: 'hsl(var(--block-purple-700))',
    600: 'hsl(var(--block-purple-600))',
    500: 'hsl(var(--block-purple-500))',
  },
  'block-indigo': {
    800: 'hsl(var(--block-indigo-800))',
    700: 'hsl(var(--block-indigo-700))',
    600: 'hsl(var(--block-indigo-600))',
    500: 'hsl(var(--block-indigo-500))',
  },
  'block-blue': {
    700: 'hsl(var(--block-blue-700))',
    600: 'hsl(var(--block-blue-600))',
    500: 'hsl(var(--block-blue-500))',
    400: 'hsl(var(--block-blue-400))',
  },
  'block-cyan': {
    500: 'hsl(var(--block-cyan-500))',
    400: 'hsl(var(--block-cyan-400))',
    300: 'hsl(var(--block-cyan-300))',
  },
},
```

## Component-Specific Implementation Guidelines

### Navigation and Header Elements

```jsx
// Example of navigation implementation
<nav className="bg-ui-navy-900 text-white p-4">
  <ul className="flex space-x-4">
    <li className="px-3 py-2 bg-ui-navy-600 rounded hover:bg-ui-navy-500">Home</li>
    <li className="px-3 py-2 bg-ui-navy-300 rounded">Projects</li> {/* Active item */}
    <li className="px-3 py-2 bg-ui-navy-600 rounded hover:bg-ui-navy-500">Settings</li>
  </ul>
</nav>
```

### Button Styling

```jsx
// Primary button (main actions)
<button className="bg-ui-navy-700 hover:bg-ui-navy-600 text-white px-4 py-2 rounded">
  Save Query
</button>

// Secondary button (alternative actions)
<button className="bg-ui-terracotta-500 hover:bg-ui-terracotta-400 text-white px-4 py-2 rounded">
  Cancel
</button>

// Danger button (destructive actions)
<button className="bg-ui-terracotta-700 hover:bg-ui-terracotta-600 text-white px-4 py-2 rounded">
  Delete
</button>
```

### Form Elements

```jsx
// Input with focus state
<div className="mb-4">
  <label className="block text-ui-navy-900 mb-1">Table Name</label>
  <input 
    type="text" 
    className="border border-ui-navy-200 focus:border-ui-navy-300 focus:ring-1 focus:ring-ui-navy-300 rounded px-3 py-2 w-full"
  />
</div>
```

### Query Building Blocks

```jsx
// SELECT block
<div className="p-3 bg-block-pink-500 text-white rounded">
  SELECT column1, column2
</div>

// FROM block
<div className="p-3 bg-block-magenta-600 text-white rounded">
  FROM my_table
</div>

// WHERE condition
<div className="p-3 bg-block-indigo-700 text-white rounded">
  WHERE column1 > 100
</div>

// JOIN operation
<div className="p-3 bg-block-blue-500 text-white rounded">
  JOIN other_table ON my_table.id = other_table.id
</div>

// GROUP BY clause
<div className="p-3 bg-block-cyan-400 text-white rounded">
  GROUP BY category_id
</div>
```

## Accessibility Considerations

### Color Contrast

All color combinations used in the interface should meet WCAG 2.1 AA standards for contrast:
- Text and interactive elements have a contrast ratio of at least 4.5:1 against their backgrounds
- Large text (18pt or 14pt bold) has a contrast ratio of at least 3:1
- UI components and graphical objects have a contrast ratio of at least 3:1 against adjacent colors

### Color Meaning

- Never use color as the only means of conveying information
- Always pair color indicators with text labels, icons, or patterns
- Ensure that all information conveyed with color is also available without color

### Focus States

- All interactive elements have visible focus states using `--ui-navy-300` for highlighting
- Focus indicators should have sufficient contrast against both the element and the background

## Usage Guidelines

### When to Use UI Colors

UI colors should be used for:

1. **Application Structure Elements**
   - Page layouts and backgrounds
   - Navigation components
   - Headers and footers
   - Modal dialogs and overlays

2. **Interactive UI Components**
   - Buttons and action elements
   - Form inputs and controls
   - Toggles, sliders, and other controls
   - Selection indicators

3. **Content Containers**
   - Cards and panels
   - Accordions and tabs
   - Tables and list views
   - Sidebar widgets

4. **Status and Feedback**
   - Success/error messages (use terracotta for warnings/errors)
   - Loading indicators
   - Progress bars
   - Notification badges

### When to Use Block Colors

Block colors should be used exclusively for:

1. **SQL Query Components**
   - SQL keywords and clause blocks (SELECT, FROM, WHERE, etc.)
   - Table and column references
   - Functions and operators
   - Join types and conditions

2. **Query Building Interface**
   - Visual query builder components
   - Draggable query elements
   - SQL syntax highlighting
   - Query element relationships

3. **Data Visualization Elements**
   - Chart and graph elements
   - Data flow diagrams
   - Schema relationship visualizations
   - Query execution plans

4. **Interactive Teaching Elements**
   - Tutorial highlights
   - Educational code samples
   - Feature spotlights
   - Guided walkthroughs

## Design Rationale

The color system is designed with the following principles in mind:

### 1. Visual Distinction Between UI and Query Elements

The clear separation between muted UI colors and vibrant block colors ensures that users can instantly distinguish between the application interface and the query-building components. This differentiation helps users focus on the query-building task without distraction.

### 2. Semantic Color Mapping

Each color family is assigned to specific functional areas of the application:
- Navy blues form the backbone of the UI interface
- Terracotta provides contrast for warnings and important actions
- Beige creates neutral, calm backgrounds
- The vibrant block colors form a logical sequence following SQL syntax order

### 3. Consistent Color Progression

The shade progression within each color family provides a systematic way to indicate states and hierarchy:
- Darker shades (700-900) for primary elements and important actions
- Middle shades (400-600) for standard components and neutral states
- Lighter shades (100-300) for backgrounds, hover states, and subtle elements

### 4. Harmonious Color Relationships

The colors within each category (UI and Block) are designed to work together harmoniously while maintaining sufficient contrast. The UI colors provide a cohesive, professional backdrop that allows the vibrant block colors to stand out clearly.

### 5. Flexibility and Extendability

The systematic approach to color naming and organization makes it easy to:
- Add new colors as needed
- Adjust existing colors while maintaining relationships
- Apply colors consistently across the application
- Support future theming capabilities

## Conclusion

This comprehensive color system provides a solid foundation for the SQL Query Builder application's visual identity. By clearly separating UI elements from query-building blocks, the design creates an intuitive, focused experience that helps users understand and interact with complex SQL concepts.

The structured approach to color naming, organization, and application ensures consistency across the interface while providing flexibility for future expansion. As the application evolves, this color system can be extended while maintaining the core principles that guide its design.

Developers should refer to this documentation when implementing new features or components to ensure adherence to the established color system and maintain a cohesive user experience throughout the application.