# Query Builder Card Navigation Implementation

## Overview

This document outlines the implementation plan for updating the "Launch Query Builder" button in the Query Builder Card component located in `frontend/app/projects/[id]/page.tsx`. The goal is to modify the button to navigate to the `/setup/` route when clicked, allowing users to construct their table schemas.

## Current Implementation

Currently, the Query Builder Card component contains a disabled button labeled "Launch Query Builder":

```tsx
<CardFooter>
  <Button disabled className="w-full bg-ui-navy-700 text-white">
    Launch Query Builder
  </Button>
</CardFooter>
```

## Required Changes

The following changes need to be implemented:

1. Remove the `disabled` attribute from the Button component
2. Add an onClick handler that uses the Next.js router to navigate to the `/setup/` route
3. Update the button text to better reflect its functionality

## Implementation Details

### Code Changes

```tsx
<CardFooter>
  <Button 
    className="w-full bg-ui-navy-700 text-white"
    onClick={() => router.push('/setup')}
  >
    Setup Table Schema
  </Button>
</CardFooter>
```

### Notes

- The component already imports and initializes the Next.js router with `const router = useRouter();` at the top of the file
- No query parameters need to be passed to the setup page at this stage
- No Context7 MCP server integration is needed for this functionality
- The button text is updated from "Launch Query Builder" to "Setup Table Schema" to better describe its purpose

## Testing

After implementation, the following tests should be performed:

1. Verify that the button is no longer disabled and has the updated text
2. Click the button and confirm it navigates correctly to the `/setup/` route
3. Confirm the SQL Table Visualizer component loads properly after navigation

## Next Steps

Once this implementation is complete, the feature should be fully functional, allowing users to navigate from a project's detail page to the table schema setup page.