# VibeTasker

A modern, vibe-driven task management application with kanban boards, analytics, and team collaboration.

![VibeTasker](https://img.shields.io/badge/VibeTasker-Dark%20Glassmorphism-purple)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

## Features

- **Dashboard**: Overview of tasks, activity feed, and quick actions
- **Kanban Board**: Drag-and-drop task management with locked Daily BASE column
- **Analytics**: Visual insights into team productivity and task metrics
- **Team Management**: Invite and manage team members
- **Settings**: Customize appearance, notifications, and integrations

## Design System

### Dark Glassmorphism Theme
- Dark backgrounds with translucent glass panels
- Frosted glass effects with backdrop blur
- Subtle borders with low opacity

### Gradient Accents
- Primary: Purple (#8b5cf6) → Blue (#3b82f6) → Cyan (#06b6d4)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Convex (schema defined, ready for integration)
- **Icons**: Lucide React

## Project Structure

```
app/
├── dashboard/          # Dashboard overview page
├── kanban/            # Kanban board with drag-drop
├── analytics/         # Charts and metrics
├── team/              # Team management
├── settings/          # App settings
├── layout.tsx         # Root layout with AppShell
├── page.tsx           # Redirects to dashboard
└── globals.css        # Global styles + design tokens

components/
├── AppShell.tsx       # Main app shell wrapper
├── Sidebar.tsx        # Navigation sidebar
├── Topbar.tsx         # Header with search/actions
├── kanban/            # Kanban components
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   └── KanbanTaskCard.tsx
└── modals/            # Modal dialogs
    ├── CreateTaskModal.tsx
    ├── CreateColumnModal.tsx
    └── TaskDetailsModal.tsx

lib/
├── types.ts           # TypeScript type definitions
├── data/
│   └── mock-data.ts   # Mock data for development
└── providers/
    └── ConvexProvider.tsx

convex/
└── schema.ts          # Convex database schema
```

## Daily BASE Column

The Daily BASE column is a special locked column that:
- Cannot be deleted or renamed
- Resets daily (implementation pending)
- Serves as the default entry point for new tasks
- Visual distinction with purple gradient styling

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Convex Integration

The Convex schema is defined in `convex/schema.ts`. To connect:

1. Set up a Convex project: `npx convex dev`
2. Add your Convex URL to `.env.local`:
   ```
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```
3. Uncomment the Convex provider in `layout.tsx`

## License

MIT
